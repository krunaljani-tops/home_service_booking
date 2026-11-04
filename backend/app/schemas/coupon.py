from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.models.coupon import CouponDiscountType


class CouponBase(BaseModel):
    code: str
    description: Optional[str] = None
    discount_type: CouponDiscountType
    discount_value: Decimal
    max_discount: Optional[Decimal] = None
    min_order_amount: Decimal = Decimal("0.00")
    usage_limit: Optional[int] = None
    valid_from: datetime
    valid_until: datetime
    is_active: bool = True


class CouponCreate(CouponBase):
    pass


class CouponUpdate(BaseModel):
    description: Optional[str] = None
    discount_type: Optional[CouponDiscountType] = None
    discount_value: Optional[Decimal] = None
    max_discount: Optional[Decimal] = None
    min_order_amount: Optional[Decimal] = None
    usage_limit: Optional[int] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    is_active: Optional[bool] = None


class CouponResponse(CouponBase):
    id: int
    used_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CouponValidateRequest(BaseModel):
    code: str
    order_amount: Decimal


class CouponValidateResponse(BaseModel):
    valid: bool
    coupon_id: Optional[int] = None
    discount_amount: Decimal = Decimal("0.00")
    final_amount: Decimal
    message: str
