from datetime import date, datetime, time
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.models.booking import BookingStatus
from app.models.booking_assignment import AssignmentStatus
from app.models.booking_image import BookingImageType
from app.schemas.address import AddressResponse
from app.schemas.service import ServiceResponse


class BookingImageCreate(BaseModel):
    image_url: str
    image_type: BookingImageType = BookingImageType.REFERENCE


class BookingImageResponse(BaseModel):
    id: int
    booking_id: int
    image_url: str
    image_type: BookingImageType
    uploaded_by: int
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BookingAssignmentResponse(BaseModel):
    id: int
    booking_id: int
    technician_id: int
    assigned_at: datetime
    accepted_at: Optional[datetime] = None
    arrival_time: Optional[datetime] = None
    start_time: Optional[datetime] = None
    completion_time: Optional[datetime] = None
    status: AssignmentStatus
    remarks: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class BookingCreate(BaseModel):
    provider_id: int
    service_id: int
    address_id: Optional[int] = None
    scheduled_date: date
    scheduled_time: time
    duration_minutes: int = 60
    description: Optional[str] = None
    coupon_code: Optional[str] = None
    address_line1: Optional[str] = None
    city: Optional[str] = "Mumbai"
    state: Optional[str] = "Maharashtra"
    postal_code: Optional[str] = "400001"
    coupon_code: Optional[str] = None


class BookingUpdate(BaseModel):
    scheduled_date: Optional[date] = None
    scheduled_time: Optional[time] = None
    duration_minutes: Optional[int] = None
    description: Optional[str] = None


class BookingStatusUpdate(BaseModel):
    status: BookingStatus
    cancellation_reason: Optional[str] = None


class BookingCancelRequest(BaseModel):
    cancellation_reason: str


class BookingAssignRequest(BaseModel):
    technician_id: int
    remarks: Optional[str] = None


class BookingResponse(BaseModel):
    id: int
    booking_uid: str
    customer_id: int
    provider_id: int
    service_id: int
    address_id: int
    scheduled_date: date
    scheduled_time: time
    duration_minutes: int
    status: BookingStatus
    description: Optional[str] = None
    total_amount: Decimal
    discount_amount: Decimal
    tax_amount: Decimal
    final_amount: Decimal
    coupon_id: Optional[int] = None
    cancellation_reason: Optional[str] = None
    cancelled_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    service: Optional[ServiceResponse] = None
    address: Optional[AddressResponse] = None
    assignment: Optional[BookingAssignmentResponse] = None
    images: List[BookingImageResponse] = []

    model_config = ConfigDict(from_attributes=True)


class BookingListResponse(BaseModel):
    items: List[BookingResponse]
    total: int
    page: int
    limit: int
    pages: int

    model_config = ConfigDict(from_attributes=True)
