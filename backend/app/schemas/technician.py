from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse


class TechnicianBase(BaseModel):
    specialization: Optional[str] = None
    experience_years: int = 0
    is_available: bool = True


class TechnicianCreate(TechnicianBase):
    user_id: Optional[int] = None
    provider_id: Optional[int] = None
    # If creating user along with technician
    email: Optional[str] = None
    password: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None


class TechnicianUpdate(BaseModel):
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    is_available: Optional[bool] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None


class TechnicianResponse(TechnicianBase):
    id: int
    user_id: int
    provider_id: int
    user: Optional[UserResponse] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
