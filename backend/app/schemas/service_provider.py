from datetime import datetime, time
from decimal import Decimal
from typing import Any, List, Optional
from pydantic import BaseModel, ConfigDict
from app.models.service_provider import VerificationStatus
from app.schemas.service import ServiceResponse
from app.schemas.user import UserResponse


class ProviderBase(BaseModel):
    company_name: str
    description: Optional[str] = None
    license_number: Optional[str] = None
    commission_rate: Decimal = Decimal("15.00")
    is_featured: bool = False


class ProviderCreate(ProviderBase):
    user_id: Optional[int] = None
    # Optional fields for auto user creation
    email: Optional[str] = None
    password: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None


class ProviderUpdate(BaseModel):
    company_name: Optional[str] = None
    description: Optional[str] = None
    license_number: Optional[str] = None
    verification_documents: Optional[Any] = None
    is_featured: Optional[bool] = None


class ProviderVerification(BaseModel):
    verification_status: VerificationStatus
    admin_remarks: Optional[str] = None
    commission_rate: Optional[Decimal] = None


class ProviderServiceCreate(BaseModel):
    service_id: int
    custom_price: Optional[Decimal] = None
    is_available: bool = True


class ProviderServiceResponse(BaseModel):
    id: int
    provider_id: int
    service_id: int
    custom_price: Optional[Decimal] = None
    is_available: bool
    service: Optional[ServiceResponse] = None

    model_config = ConfigDict(from_attributes=True)


class AvailabilitySlotBase(BaseModel):
    day_of_week: int  # 0=Monday, 6=Sunday
    start_time: time
    end_time: time
    is_available: bool = True


class AvailabilitySlotCreate(AvailabilitySlotBase):
    pass


class AvailabilitySlotUpdate(BaseModel):
    day_of_week: Optional[int] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    is_available: Optional[bool] = None


class AvailabilitySlotResponse(AvailabilitySlotBase):
    id: int
    provider_id: int

    model_config = ConfigDict(from_attributes=True)


class ServiceAreaCreate(BaseModel):
    city: str
    state: str
    postal_code: Optional[str] = None
    radius_km: int = 10


class ServiceAreaResponse(ServiceAreaCreate):
    id: int
    provider_id: int

    model_config = ConfigDict(from_attributes=True)


class ProviderResponse(ProviderBase):
    id: int
    user_id: int
    verification_status: VerificationStatus
    verification_documents: Optional[Any] = None
    admin_remarks: Optional[str] = None
    rating_avg: Decimal
    total_reviews: int
    created_at: datetime
    updated_at: datetime
    user: Optional[UserResponse] = None
    provider_services: List[ProviderServiceResponse] = []
    service_areas: List[ServiceAreaResponse] = []
    availability_slots: List[AvailabilitySlotResponse] = []

    model_config = ConfigDict(from_attributes=True)


class ProviderListResponse(BaseModel):
    items: List[ProviderResponse]
    total: int
    page: int
    limit: int
    pages: int

    model_config = ConfigDict(from_attributes=True)
