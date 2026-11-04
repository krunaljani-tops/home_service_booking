from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.address import AddressResponse
from app.schemas.user import UserResponse


class CustomerBase(BaseModel):
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(CustomerBase):
    pass


class CustomerResponse(CustomerBase):
    id: int
    user_id: int
    user: Optional[UserResponse] = None
    addresses: List[AddressResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
