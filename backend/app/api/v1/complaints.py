from datetime import datetime
import random
import string
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, get_db
from app.core.exceptions import ForbiddenException, NotFoundException
from app.models.booking import Booking
from app.models.complaint import Complaint, ComplaintStatus
from app.models.customer import Customer
from app.models.user import User, UserRole
from app.schemas.complaint import ComplaintCreate, ComplaintResponse, ComplaintUpdate

router = APIRouter(prefix="/complaints", tags=["Complaints & Disputes"])


def generate_complaint_uid() -> str:
    date_str = datetime.now().strftime("%Y%m%d")
    rand_suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"CMP-{date_str}-{rand_suffix}"


@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def lodge_complaint(
    complaint_data: ComplaintCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Lodge a support complaint or dispute regarding a booking."""
    booking = db.query(Booking).filter(Booking.id == complaint_data.booking_id).first()
    if not booking:
        raise NotFoundException("Booking not found")

    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer or booking.customer_id != customer.id:
        raise ForbiddenException("You can only file complaints for your own bookings")

    complaint = Complaint(
        complaint_uid=generate_complaint_uid(),
        booking_id=booking.id,
        customer_id=customer.id,
        subject=complaint_data.subject,
        description=complaint_data.description,
        priority=complaint_data.priority,
        status=ComplaintStatus.OPEN,
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return ComplaintResponse.model_validate(complaint)


@router.get("", response_model=List[ComplaintResponse])
def list_complaints(
    status: Optional[ComplaintStatus] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List complaints. Customers see theirs; Admins view all."""
    query = db.query(Complaint)

    if current_user.role == UserRole.CUSTOMER:
        customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
        if not customer:
            return []
        query = query.filter(Complaint.customer_id == customer.id)

    if status:
        query = query.filter(Complaint.status == status)

    complaints = query.order_by(Complaint.created_at.desc()).all()
    return [ComplaintResponse.model_validate(c) for c in complaints]


@router.get("/{id}", response_model=ComplaintResponse)
def get_complaint(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve complaint details by ID."""
    complaint = db.query(Complaint).filter(Complaint.id == id).first()
    if not complaint:
        raise NotFoundException("Complaint not found")

    if current_user.role == UserRole.CUSTOMER:
        customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
        if not customer or complaint.customer_id != customer.id:
            raise ForbiddenException("Unauthorized to view this complaint")

    return ComplaintResponse.model_validate(complaint)


@router.patch("/{id}", response_model=ComplaintResponse)
def update_complaint_status(
    id: int,
    update_data: ComplaintUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update complaint status or record dispute resolution (Admin only)."""
    if current_user.role != UserRole.SUPER_ADMIN:
        raise ForbiddenException("Only administrators can update complaint status")

    complaint = db.query(Complaint).filter(Complaint.id == id).first()
    if not complaint:
        raise NotFoundException("Complaint not found")

    data = update_data.model_dump(exclude_unset=True)
    if "status" in data and data["status"] in [ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED]:
        complaint.resolved_at = datetime.now()

    for key, value in data.items():
        setattr(complaint, key, value)

    db.commit()
    db.refresh(complaint)
    return ComplaintResponse.model_validate(complaint)
