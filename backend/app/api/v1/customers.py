import math
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, get_db, role_required
from app.core.exceptions import ForbiddenException, NotFoundException
from app.models.customer import Customer
from app.models.user import User, UserRole
from app.schemas.customer import CustomerResponse, CustomerUpdate

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("", dependencies=[Depends(role_required("SUPER_ADMIN"))])
def list_customers(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all registered customers with pagination (Admin only)."""
    query = db.query(Customer)
    total = query.count()
    pages = math.ceil(total / limit) if total > 0 else 0
    offset = (page - 1) * limit
    customers = query.order_by(Customer.created_at.desc()).offset(offset).limit(limit).all()

    return {
        "items": [CustomerResponse.model_validate(c) for c in customers],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
    }


@router.get("/{id}", response_model=CustomerResponse)
def get_customer(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve customer details by ID (Admin or owner customer)."""
    customer = db.query(Customer).filter(Customer.id == id).first()
    if not customer:
        raise NotFoundException("Customer not found")

    if current_user.role != UserRole.SUPER_ADMIN and customer.user_id != current_user.id:
        raise ForbiddenException("You are not authorized to view this customer profile")

    return CustomerResponse.model_validate(customer)


@router.put("/{id}", response_model=CustomerResponse)
def update_customer(
    id: int,
    update_data: CustomerUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update customer details (Admin or owner customer)."""
    customer = db.query(Customer).filter(Customer.id == id).first()
    if not customer:
        raise NotFoundException("Customer not found")

    if current_user.role != UserRole.SUPER_ADMIN and customer.user_id != current_user.id:
        raise ForbiddenException("You are not authorized to edit this customer profile")

    data = update_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(customer, key, value)

    db.commit()
    db.refresh(customer)
    return CustomerResponse.model_validate(customer)
