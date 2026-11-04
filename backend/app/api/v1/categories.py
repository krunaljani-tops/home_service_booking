import re
from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, role_required
from app.core.exceptions import ConflictException, NotFoundException
from app.models.service_category import ServiceCategory
from app.schemas.common import MessageResponse
from app.schemas.service_category import CategoryCreate, CategoryResponse, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["Service Categories"])


def slugify(text: str) -> str:
    text = text.lower().strip()
    return re.sub(r"[^\w\s-]", "", re.sub(r"[\s_-]+", "-", text))


@router.get("", response_model=List[CategoryResponse])
def list_categories(
    active_only: bool = True,
    parent_only: bool = False,
    db: Session = Depends(get_db),
):
    """Retrieve catalog of service categories (public)."""
    query = db.query(ServiceCategory)
    if active_only:
        query = query.filter(ServiceCategory.is_active.is_(True))
    if parent_only:
        query = query.filter(ServiceCategory.parent_id.is_(None))

    categories = query.order_by(ServiceCategory.sort_order.asc(), ServiceCategory.name.asc()).all()
    return [CategoryResponse.model_validate(c) for c in categories]


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(role_required("SUPER_ADMIN"))])
def create_category(category_data: CategoryCreate, db: Session = Depends(get_db)):
    """Create a new service category (Admin only)."""
    slug = category_data.slug or slugify(category_data.name)
    existing = db.query(ServiceCategory).filter(ServiceCategory.slug == slug).first()
    if existing:
        raise ConflictException(f"Category with slug '{slug}' already exists")

    new_cat = ServiceCategory(
        name=category_data.name,
        slug=slug,
        description=category_data.description,
        icon_url=category_data.icon_url,
        image_url=category_data.image_url,
        is_active=category_data.is_active,
        parent_id=category_data.parent_id,
        sort_order=category_data.sort_order,
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return CategoryResponse.model_validate(new_cat)


@router.get("/{id}", response_model=CategoryResponse)
def get_category(id: int, db: Session = Depends(get_db)):
    """Retrieve category details by ID (public)."""
    cat = db.query(ServiceCategory).filter(ServiceCategory.id == id).first()
    if not cat:
        raise NotFoundException("Service category not found")
    return CategoryResponse.model_validate(cat)


@router.put("/{id}", response_model=CategoryResponse, dependencies=[Depends(role_required("SUPER_ADMIN"))])
def update_category(id: int, update_data: CategoryUpdate, db: Session = Depends(get_db)):
    """Update category details (Admin only)."""
    cat = db.query(ServiceCategory).filter(ServiceCategory.id == id).first()
    if not cat:
        raise NotFoundException("Service category not found")

    data = update_data.model_dump(exclude_unset=True)
    if "name" in data and not data.get("slug"):
        data["slug"] = slugify(data["name"])

    for key, value in data.items():
        setattr(cat, key, value)

    db.commit()
    db.refresh(cat)
    return CategoryResponse.model_validate(cat)


@router.delete("/{id}", response_model=MessageResponse, dependencies=[Depends(role_required("SUPER_ADMIN"))])
def delete_category(id: int, db: Session = Depends(get_db)):
    """Delete a service category (Admin only)."""
    cat = db.query(ServiceCategory).filter(ServiceCategory.id == id).first()
    if not cat:
        raise NotFoundException("Service category not found")

    db.delete(cat)
    db.commit()
    return MessageResponse(message="Service category deleted successfully")
