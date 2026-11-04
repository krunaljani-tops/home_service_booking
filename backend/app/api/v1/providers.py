import math
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, get_db, role_required
from app.core.exceptions import BadRequestException, ForbiddenException, NotFoundException
from app.models.availability import AvailabilitySlot
from app.models.provider_earning import ProviderEarning
from app.models.provider_service import ProviderService
from app.models.review import Review
from app.models.service import Service
from app.models.service_area import ServiceArea
from app.models.service_provider import ServiceProvider, VerificationStatus
from app.models.user import User, UserRole
from app.schemas.common import MessageResponse
from app.schemas.review import ReviewResponse
from app.schemas.service_provider import (
    AvailabilitySlotCreate,
    AvailabilitySlotResponse,
    AvailabilitySlotUpdate,
    ProviderListResponse,
    ProviderResponse,
    ProviderServiceCreate,
    ProviderServiceResponse,
    ProviderUpdate,
    ProviderVerification,
)

router = APIRouter(prefix="/providers", tags=["Service Providers"])


@router.get("", response_model=ProviderListResponse)
def list_providers(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    city: Optional[str] = None,
    service_id: Optional[int] = None,
    min_rating: Optional[float] = None,
    verification_status: Optional[VerificationStatus] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List service providers with filtering by location, ratings, and services offered."""
    query = db.query(ServiceProvider)

    if verification_status:
        query = query.filter(ServiceProvider.verification_status == verification_status)
    if min_rating is not None:
        query = query.filter(ServiceProvider.rating_avg >= min_rating)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                ServiceProvider.company_name.ilike(search_fmt),
                ServiceProvider.description.ilike(search_fmt),
            )
        )
    if service_id:
        query = query.join(ProviderService).filter(
            ProviderService.service_id == service_id,
            ProviderService.is_available.is_(True),
        )
    if city:
        query = query.join(ServiceArea).filter(ServiceArea.city.ilike(f"%{city}%"))

    total = query.distinct().count()
    pages = math.ceil(total / limit) if total > 0 else 0
    offset = (page - 1) * limit
    providers = query.distinct().order_by(ServiceProvider.rating_avg.desc()).offset(offset).limit(limit).all()

    return ProviderListResponse(
        items=[ProviderResponse.model_validate(p) for p in providers],
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )


@router.get("/{id}", response_model=ProviderResponse)
def get_provider(id: int, db: Session = Depends(get_db)):
    """Retrieve full public provider profile."""
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == id).first()
    if not provider:
        raise NotFoundException("Service provider not found")
    return ProviderResponse.model_validate(provider)


@router.put("/{id}", response_model=ProviderResponse)
def update_provider(
    id: int,
    update_data: ProviderUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update service provider details (Provider self or Super Admin)."""
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == id).first()
    if not provider:
        raise NotFoundException("Service provider not found")

    if current_user.role != UserRole.SUPER_ADMIN and provider.user_id != current_user.id:
        raise ForbiddenException("You are not authorized to update this provider profile")

    data = update_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(provider, key, value)

    db.commit()
    db.refresh(provider)
    return ProviderResponse.model_validate(provider)


@router.post("/{id}/verify", response_model=ProviderResponse, dependencies=[Depends(role_required("SUPER_ADMIN"))])
def verify_provider(id: int, verification: ProviderVerification, db: Session = Depends(get_db)):
    """Admin endpoint to approve, reject, or update commission for a provider."""
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == id).first()
    if not provider:
        raise NotFoundException("Service provider not found")

    provider.verification_status = verification.verification_status
    if verification.admin_remarks is not None:
        provider.admin_remarks = verification.admin_remarks
    if verification.commission_rate is not None:
        provider.commission_rate = verification.commission_rate

    db.commit()
    db.refresh(provider)
    return ProviderResponse.model_validate(provider)


@router.get("/{id}/services", response_model=List[ProviderServiceResponse])
def get_provider_services(id: int, db: Session = Depends(get_db)):
    """List all services offered by this provider."""
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == id).first()
    if not provider:
        raise NotFoundException("Service provider not found")

    services = db.query(ProviderService).filter(ProviderService.provider_id == id).all()
    return [ProviderServiceResponse.model_validate(s) for s in services]


@router.post("/{id}/services", response_model=ProviderServiceResponse, status_code=status.HTTP_201_CREATED)
def add_provider_service(
    id: int,
    service_data: ProviderServiceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a service offering to the provider's portfolio."""
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == id).first()
    if not provider:
        raise NotFoundException("Service provider not found")

    if current_user.role != UserRole.SUPER_ADMIN and provider.user_id != current_user.id:
        raise ForbiddenException("Not authorized to add services for this provider")

    # Check service exists
    svc = db.query(Service).filter(Service.id == service_data.service_id).first()
    if not svc:
        raise NotFoundException("Service does not exist")

    # Check duplicate
    existing = (
        db.query(ProviderService)
        .filter(ProviderService.provider_id == id, ProviderService.service_id == service_data.service_id)
        .first()
    )
    if existing:
        existing.custom_price = service_data.custom_price
        existing.is_available = service_data.is_available
        db.commit()
        db.refresh(existing)
        return ProviderServiceResponse.model_validate(existing)

    new_ps = ProviderService(
        provider_id=id,
        service_id=service_data.service_id,
        custom_price=service_data.custom_price,
        is_available=service_data.is_available,
    )
    db.add(new_ps)
    db.commit()
    db.refresh(new_ps)
    return ProviderServiceResponse.model_validate(new_ps)


@router.delete("/{id}/services/{service_id}", response_model=MessageResponse)
def remove_provider_service(
    id: int,
    service_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove a service offering from provider's catalog."""
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == id).first()
    if not provider:
        raise NotFoundException("Service provider not found")

    if current_user.role != UserRole.SUPER_ADMIN and provider.user_id != current_user.id:
        raise ForbiddenException("Not authorized to remove service from this provider")

    ps = (
        db.query(ProviderService)
        .filter(ProviderService.provider_id == id, ProviderService.service_id == service_id)
        .first()
    )
    if not ps:
        raise NotFoundException("Provider service association not found")

    db.delete(ps)
    db.commit()
    return MessageResponse(message="Service removed from provider catalog")


@router.get("/{id}/availability", response_model=List[AvailabilitySlotResponse])
def get_availability(id: int, db: Session = Depends(get_db)):
    """Retrieve operational availability schedule for provider."""
    slots = db.query(AvailabilitySlot).filter(AvailabilitySlot.provider_id == id).all()
    return [AvailabilitySlotResponse.model_validate(s) for s in slots]


@router.post("/{id}/availability", response_model=AvailabilitySlotResponse, status_code=status.HTTP_201_CREATED)
def create_availability_slot(
    id: int,
    slot_data: AvailabilitySlotCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add an operating availability time window."""
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == id).first()
    if not provider:
        raise NotFoundException("Provider not found")

    if current_user.role != UserRole.SUPER_ADMIN and provider.user_id != current_user.id:
        raise ForbiddenException("Not authorized to configure availability for this provider")

    slot = AvailabilitySlot(
        provider_id=id,
        day_of_week=slot_data.day_of_week,
        start_time=slot_data.start_time,
        end_time=slot_data.end_time,
        is_available=slot_data.is_available,
    )
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return AvailabilitySlotResponse.model_validate(slot)


@router.put("/{id}/availability/{slot_id}", response_model=AvailabilitySlotResponse)
def update_availability_slot(
    id: int,
    slot_id: int,
    slot_data: AvailabilitySlotUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing availability slot."""
    slot = (
        db.query(AvailabilitySlot)
        .filter(AvailabilitySlot.id == slot_id, AvailabilitySlot.provider_id == id)
        .first()
    )
    if not slot:
        raise NotFoundException("Availability slot not found")

    provider = slot.provider
    if current_user.role != UserRole.SUPER_ADMIN and provider.user_id != current_user.id:
        raise ForbiddenException("Not authorized to edit this slot")

    data = slot_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(slot, key, value)

    db.commit()
    db.refresh(slot)
    return AvailabilitySlotResponse.model_validate(slot)


@router.get("/{id}/earnings")
def get_provider_earnings(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve financial ledger and earnings breakdown for provider."""
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == id).first()
    if not provider:
        raise NotFoundException("Provider not found")

    if current_user.role != UserRole.SUPER_ADMIN and provider.user_id != current_user.id:
        raise ForbiddenException("Not authorized to view financial statements for this provider")

    earnings = db.query(ProviderEarning).filter(ProviderEarning.provider_id == id).all()
    total_earned = sum(e.earning_amount for e in earnings)
    total_commission = sum(e.commission_amount for e in earnings)

    return {
        "provider_id": id,
        "total_earned": float(total_earned),
        "total_commission_paid": float(total_commission),
        "transactions": [
            {
                "id": e.id,
                "booking_id": e.booking_id,
                "total_amount": float(e.total_amount),
                "commission_amount": float(e.commission_amount),
                "earning_amount": float(e.earning_amount),
                "status": e.status.value,
                "paid_at": str(e.paid_at) if e.paid_at else None,
                "created_at": str(e.created_at),
            }
            for e in earnings
        ],
    }


@router.get("/{id}/reviews", response_model=List[ReviewResponse])
def get_provider_reviews(id: int, db: Session = Depends(get_db)):
    """Retrieve all customer reviews and ratings for this provider."""
    reviews = db.query(Review).filter(Review.provider_id == id).order_by(Review.created_at.desc()).all()
    return [ReviewResponse.model_validate(r) for r in reviews]
