from datetime import datetime
from decimal import Decimal
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, role_required
from app.core.exceptions import ConflictException, NotFoundException
from app.models.coupon import Coupon, CouponDiscountType
from app.schemas.common import MessageResponse
from app.schemas.coupon import (
    CouponCreate,
    CouponResponse,
    CouponUpdate,
    CouponValidateRequest,
    CouponValidateResponse,
)

router = APIRouter(prefix="/coupons", tags=["Coupons & Discounts"])


@router.post("", response_model=CouponResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(role_required("SUPER_ADMIN"))])
def create_coupon(coupon_data: CouponCreate, db: Session = Depends(get_db)):
    """Create a new promotional discount coupon (Admin only)."""
    code = coupon_data.code.strip().upper()
    existing = db.query(Coupon).filter(Coupon.code == code).first()
    if existing:
        raise ConflictException(f"Coupon code '{code}' already exists")

    coupon = Coupon(
        code=code,
        description=coupon_data.description,
        discount_type=coupon_data.discount_type,
        discount_value=coupon_data.discount_value,
        max_discount=coupon_data.max_discount,
        min_order_amount=coupon_data.min_order_amount,
        usage_limit=coupon_data.usage_limit,
        valid_from=coupon_data.valid_from,
        valid_until=coupon_data.valid_until,
        is_active=coupon_data.is_active,
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return CouponResponse.model_validate(coupon)


@router.get("", response_model=List[CouponResponse])
def list_coupons(db: Session = Depends(get_db)):
    """List available promotional coupons."""
    coupons = db.query(Coupon).order_by(Coupon.created_at.desc()).all()
    return [CouponResponse.model_validate(c) for c in coupons]


@router.get("/{id}", response_model=CouponResponse)
def get_coupon(id: int, db: Session = Depends(get_db)):
    """Retrieve coupon details by ID."""
    coupon = db.query(Coupon).filter(Coupon.id == id).first()
    if not coupon:
        raise NotFoundException("Coupon not found")
    return CouponResponse.model_validate(coupon)


@router.put("/{id}", response_model=CouponResponse, dependencies=[Depends(role_required("SUPER_ADMIN"))])
def update_coupon(id: int, update_data: CouponUpdate, db: Session = Depends(get_db)):
    """Modify promotional coupon terms (Admin only)."""
    coupon = db.query(Coupon).filter(Coupon.id == id).first()
    if not coupon:
        raise NotFoundException("Coupon not found")

    data = update_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(coupon, key, value)

    db.commit()
    db.refresh(coupon)
    return CouponResponse.model_validate(coupon)


@router.delete("/{id}", response_model=MessageResponse, dependencies=[Depends(role_required("SUPER_ADMIN"))])
def delete_coupon(id: int, db: Session = Depends(get_db)):
    """Delete a coupon (Admin only)."""
    coupon = db.query(Coupon).filter(Coupon.id == id).first()
    if not coupon:
        raise NotFoundException("Coupon not found")

    db.delete(coupon)
    db.commit()
    return MessageResponse(message="Coupon deleted successfully")


@router.post("/validate", response_model=CouponValidateResponse)
def validate_coupon(req: CouponValidateRequest, db: Session = Depends(get_db)):
    """Validate a coupon code and calculate savings on a given order total."""
    code = req.code.strip().upper()
    now = datetime.now()

    coupon = db.query(Coupon).filter(Coupon.code == code).first()
    if not coupon:
        return CouponValidateResponse(
            valid=False,
            final_amount=req.order_amount,
            message="Invalid coupon code",
        )

    if not coupon.is_active:
        return CouponValidateResponse(
            valid=False,
            final_amount=req.order_amount,
            message="This coupon is no longer active",
        )

    if coupon.valid_from > now or coupon.valid_until < now:
        return CouponValidateResponse(
            valid=False,
            final_amount=req.order_amount,
            message="Coupon has expired or is not yet active",
        )

    if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
        return CouponValidateResponse(
            valid=False,
            final_amount=req.order_amount,
            message="Coupon usage limit has been reached",
        )

    if req.order_amount < coupon.min_order_amount:
        return CouponValidateResponse(
            valid=False,
            final_amount=req.order_amount,
            message=f"Minimum order amount of ₹{coupon.min_order_amount} required",
        )

    # Compute discount
    if coupon.discount_type == CouponDiscountType.PERCENTAGE:
        discount = (req.order_amount * coupon.discount_value) / Decimal("100")
        if coupon.max_discount:
            discount = min(discount, coupon.max_discount)
    else:
        discount = min(coupon.discount_value, req.order_amount)

    final_amt = max(Decimal("0.00"), req.order_amount - discount)

    return CouponValidateResponse(
        valid=True,
        coupon_id=coupon.id,
        discount_amount=discount,
        final_amount=final_amt,
        message=f"Coupon applied successfully! You saved ₹{discount:.2f}",
    )
