import math
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, get_db, role_required
from app.core.exceptions import NotFoundException
from app.models.customer import Customer
from app.models.payment import Payment, PaymentStatus
from app.models.user import User, UserRole
from app.schemas.payment import (
    CreateOrderRequest,
    CreateOrderResponse,
    PaymentResponse,
    PaymentVerify,
    RefundRequest,
)
from app.services.payment_service import payment_service

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/create-order", response_model=CreateOrderResponse)
def create_payment_order(
    order_data: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Initiate a Razorpay payment order for booking."""
    return payment_service.create_order(db, order_data.booking_id)


@router.post("/verify", response_model=PaymentResponse)
def verify_payment_signature(
    verify_data: PaymentVerify,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Verify Razorpay signature after client-side payment completion and generate invoice."""
    payment = payment_service.verify_payment(db, verify_data)
    return PaymentResponse.model_validate(payment)


@router.get("", response_model=List[PaymentResponse])
def list_payments(
    status: Optional[PaymentStatus] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List payment transactions based on user role."""
    query = db.query(Payment)

    if current_user.role == UserRole.CUSTOMER:
        customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
        if not customer:
            return []
        query = query.join(Payment.booking).filter(Payment.booking.has(customer_id=customer.id))
    # Super Admin sees all

    if status:
        query = query.filter(Payment.status == status)

    payments = query.order_by(Payment.created_at.desc()).all()
    return [PaymentResponse.model_validate(p) for p in payments]


@router.get("/{id}", response_model=PaymentResponse)
def get_payment(id: int, db: Session = Depends(get_db)):
    """Retrieve payment receipt details by ID."""
    payment = db.query(Payment).filter(Payment.id == id).first()
    if not payment:
        raise NotFoundException("Payment transaction not found")
    return PaymentResponse.model_validate(payment)


@router.post("/{id}/refund", response_model=PaymentResponse, dependencies=[Depends(role_required("SUPER_ADMIN"))])
def refund_payment(id: int, refund_data: RefundRequest, db: Session = Depends(get_db)):
    """Issue a full or partial refund for a captured payment (Admin only)."""
    payment = payment_service.process_refund(
        db=db,
        payment_id=id,
        refund_amount=refund_data.refund_amount,
        refund_reason=refund_data.refund_reason,
    )
    return PaymentResponse.model_validate(payment)
