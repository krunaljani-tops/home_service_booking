from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, get_db, role_required
from app.core.exceptions import BadRequestException, ForbiddenException, NotFoundException
from app.core.security import hash_password
from app.models.service_provider import ServiceProvider
from app.models.technician import Technician
from app.models.user import User, UserRole
from app.schemas.common import MessageResponse
from app.schemas.technician import TechnicianCreate, TechnicianResponse, TechnicianUpdate

router = APIRouter(
    prefix="/technicians",
    tags=["Technicians"],
    dependencies=[Depends(role_required("SUPER_ADMIN", "SERVICE_PROVIDER"))],
)


@router.get("", response_model=List[TechnicianResponse])
def list_technicians(
    provider_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List technicians. Providers see only their staff; admins can filter by provider_id."""
    query = db.query(Technician)

    if current_user.role == UserRole.SERVICE_PROVIDER:
        provider = db.query(ServiceProvider).filter(ServiceProvider.user_id == current_user.id).first()
        if not provider:
            return []
        query = query.filter(Technician.provider_id == provider.id)
    elif provider_id:
        query = query.filter(Technician.provider_id == provider_id)

    technicians = query.all()
    return [TechnicianResponse.model_validate(t) for t in technicians]


@router.post("", response_model=TechnicianResponse, status_code=status.HTTP_201_CREATED)
def create_technician(
    technician_data: TechnicianCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new technician record and optionally create their login user account."""
    provider_id: int

    if current_user.role == UserRole.SERVICE_PROVIDER:
        provider = db.query(ServiceProvider).filter(ServiceProvider.user_id == current_user.id).first()
        if not provider:
            raise BadRequestException("Current user does not have an associated provider record")
        provider_id = provider.id
    else:
        if not technician_data.provider_id:
            raise BadRequestException("provider_id is required for admin creating technician")
        provider_id = technician_data.provider_id

    # If new user account info provided, create user
    user_id = technician_data.user_id
    if not user_id:
        if not technician_data.email or not technician_data.password:
            raise BadRequestException("Email and password required to create technician account")

        existing_user = db.query(User).filter(User.email == technician_data.email).first()
        if existing_user:
            raise BadRequestException(f"User with email {technician_data.email} already exists")

        new_user = User(
            email=technician_data.email,
            password_hash=hash_password(technician_data.password),
            first_name=technician_data.first_name,
            last_name=technician_data.last_name,
            phone=technician_data.phone,
            role=UserRole.TECHNICIAN,
            is_active=True,
            is_verified=True,
        )
        db.add(new_user)
        db.flush()
        user_id = new_user.id

    technician = Technician(
        user_id=user_id,
        provider_id=provider_id,
        specialization=technician_data.specialization,
        experience_years=technician_data.experience_years,
        is_available=technician_data.is_available,
    )
    db.add(technician)
    db.commit()
    db.refresh(technician)
    return TechnicianResponse.model_validate(technician)


@router.get("/{id}", response_model=TechnicianResponse)
def get_technician(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve technician details by ID."""
    technician = db.query(Technician).filter(Technician.id == id).first()
    if not technician:
        raise NotFoundException("Technician not found")

    if current_user.role == UserRole.SERVICE_PROVIDER:
        provider = db.query(ServiceProvider).filter(ServiceProvider.user_id == current_user.id).first()
        if not provider or technician.provider_id != provider.id:
            raise ForbiddenException("You cannot view technicians outside your organization")

    return TechnicianResponse.model_validate(technician)


@router.put("/{id}", response_model=TechnicianResponse)
def update_technician(
    id: int,
    update_data: TechnicianUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update technician profile and availability."""
    technician = db.query(Technician).filter(Technician.id == id).first()
    if not technician:
        raise NotFoundException("Technician not found")

    if current_user.role == UserRole.SERVICE_PROVIDER:
        provider = db.query(ServiceProvider).filter(ServiceProvider.user_id == current_user.id).first()
        if not provider or technician.provider_id != provider.id:
            raise ForbiddenException("You cannot edit technicians outside your organization")

    data = update_data.model_dump(exclude_unset=True)
    # Update user fields if provided
    user_fields = ["first_name", "last_name", "phone"]
    for field in user_fields:
        if field in data and technician.user:
            setattr(technician.user, field, data.pop(field))

    for key, value in data.items():
        setattr(technician, key, value)

    db.commit()
    db.refresh(technician)
    return TechnicianResponse.model_validate(technician)


@router.delete("/{id}", response_model=MessageResponse)
def delete_technician(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a technician record."""
    technician = db.query(Technician).filter(Technician.id == id).first()
    if not technician:
        raise NotFoundException("Technician not found")

    if current_user.role == UserRole.SERVICE_PROVIDER:
        provider = db.query(ServiceProvider).filter(ServiceProvider.user_id == current_user.id).first()
        if not provider or technician.provider_id != provider.id:
            raise ForbiddenException("You cannot delete technicians outside your organization")

    db.delete(technician)
    db.commit()
    return MessageResponse(message="Technician deleted successfully")
