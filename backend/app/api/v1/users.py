import math
from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, role_required
from app.core.exceptions import NotFoundException
from app.models.user import User, UserRole
from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.user import UserListResponse, UserResponse, UserStatusUpdate, UserUpdate

router = APIRouter(
    prefix="/users",
    tags=["Users Management"],
    dependencies=[Depends(role_required("SUPER_ADMIN"))],
)


@router.get("", response_model=UserListResponse)
def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    role: Optional[UserRole] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List users with pagination, role filtering, and text search."""
    query = db.query(User)

    if role:
        query = query.filter(User.role == role)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                User.email.ilike(search_filter),
                User.first_name.ilike(search_filter),
                User.last_name.ilike(search_filter),
                User.phone.ilike(search_filter),
            )
        )

    total = query.count()
    pages = math.ceil(total / limit) if total > 0 else 0
    offset = (page - 1) * limit
    users = query.order_by(User.created_at.desc()).offset(offset).limit(limit).all()

    return UserListResponse(
        items=[UserResponse.model_validate(u) for u in users],
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )


@router.get("/{id}", response_model=UserResponse)
def get_user_by_id(id: int, db: Session = Depends(get_db)):
    """Retrieve user details by ID."""
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise NotFoundException(f"User with ID {id} not found")
    return UserResponse.model_validate(user)


@router.put("/{id}", response_model=UserResponse)
def update_user(id: int, update_data: UserUpdate, db: Session = Depends(get_db)):
    """Update user information."""
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise NotFoundException(f"User with ID {id} not found")

    data = update_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)


@router.patch("/{id}/status", response_model=UserResponse)
def update_user_status(id: int, status_data: UserStatusUpdate, db: Session = Depends(get_db)):
    """Activate, deactivate, or toggle verification status of a user."""
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise NotFoundException(f"User with ID {id} not found")

    data = status_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)


@router.delete("/{id}", response_model=MessageResponse)
def delete_user(id: int, db: Session = Depends(get_db)):
    """Delete a user account."""
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise NotFoundException(f"User with ID {id} not found")

    db.delete(user)
    db.commit()
    return MessageResponse(message=f"User with ID {id} has been deleted")
