import math
import re
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, role_required
from app.core.exceptions import ConflictException, NotFoundException
from app.models.provider_service import ProviderService
from app.models.service import Service
from app.models.service_provider import ServiceProvider
from app.schemas.common import MessageResponse
from app.schemas.service import ServiceCreate, ServiceListResponse, ServiceResponse, ServiceUpdate
from app.schemas.service_provider import ProviderResponse

router = APIRouter(prefix="/services", tags=["Services Catalog"])


def slugify(text: str) -> str:
    text = text.lower().strip()
    return re.sub(r"[^\w\s-]", "", re.sub(r"[\s_-]+", "-", text))


@router.get("", response_model=ServiceListResponse)
def list_services(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db),
):
    """Search and filter available services catalog (public)."""
    query = db.query(Service)

    if active_only:
        query = query.filter(Service.is_active.is_(True))
    if category_id:
        query = query.filter(Service.category_id == category_id)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Service.name.ilike(search_fmt),
                Service.description.ilike(search_fmt),
            )
        )

    total = query.count()
    pages = math.ceil(total / limit) if total > 0 else 0
    offset = (page - 1) * limit
    services = query.order_by(Service.name.asc()).offset(offset).limit(limit).all()

    return ServiceListResponse(
        items=[ServiceResponse.model_validate(s) for s in services],
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )


@router.post("", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(role_required("SUPER_ADMIN"))])
def create_service(service_data: ServiceCreate, db: Session = Depends(get_db)):
    """Create a new service offering in catalog (Admin only)."""
    slug = service_data.slug or slugify(service_data.name)
    existing = db.query(Service).filter(Service.slug == slug).first()
    if existing:
        raise ConflictException(f"Service with slug '{slug}' already exists")

    new_svc = Service(
        category_id=service_data.category_id,
        name=service_data.name,
        slug=slug,
        description=service_data.description,
        base_price=service_data.base_price,
        duration_minutes=service_data.duration_minutes,
        image_url=service_data.image_url,
        is_active=service_data.is_active,
    )
    db.add(new_svc)
    db.commit()
    db.refresh(new_svc)
    return ServiceResponse.model_validate(new_svc)


@router.get("/{id}", response_model=ServiceResponse)
def get_service(id: int, db: Session = Depends(get_db)):
    """Retrieve service details by ID (public)."""
    svc = db.query(Service).filter(Service.id == id).first()
    if not svc:
        raise NotFoundException("Service not found")
    return ServiceResponse.model_validate(svc)


@router.put("/{id}", response_model=ServiceResponse, dependencies=[Depends(role_required("SUPER_ADMIN"))])
def update_service(id: int, update_data: ServiceUpdate, db: Session = Depends(get_db)):
    """Update service catalog item (Admin only)."""
    svc = db.query(Service).filter(Service.id == id).first()
    if not svc:
        raise NotFoundException("Service not found")

    data = update_data.model_dump(exclude_unset=True)
    if "name" in data and not data.get("slug"):
        data["slug"] = slugify(data["name"])

    for key, value in data.items():
        setattr(svc, key, value)

    db.commit()
    db.refresh(svc)
    return ServiceResponse.model_validate(svc)


@router.delete("/{id}", response_model=MessageResponse, dependencies=[Depends(role_required("SUPER_ADMIN"))])
def delete_service(id: int, db: Session = Depends(get_db)):
    """Delete a service from catalog (Admin only)."""
    svc = db.query(Service).filter(Service.id == id).first()
    if not svc:
        raise NotFoundException("Service not found")

    db.delete(svc)
    db.commit()
    return MessageResponse(message="Service deleted successfully")


@router.get("/{id}/providers", response_model=List[ProviderResponse])
def get_providers_for_service(id: int, db: Session = Depends(get_db)):
    """List all verified providers that offer this specific service."""
    svc = db.query(Service).filter(Service.id == id).first()
    if not svc:
        raise NotFoundException("Service not found")

    providers = (
        db.query(ServiceProvider)
        .join(ProviderService, ServiceProvider.id == ProviderService.provider_id)
        .filter(ProviderService.service_id == id, ProviderService.is_available.is_(True))
        .all()
    )
    return [ProviderResponse.model_validate(p) for p in providers]
