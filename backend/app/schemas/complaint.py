from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.models.complaint import ComplaintPriority, ComplaintStatus


class ComplaintCreate(BaseModel):
    booking_id: int
    subject: str
    description: str
    priority: ComplaintPriority = ComplaintPriority.MEDIUM


class ComplaintUpdate(BaseModel):
    status: Optional[ComplaintStatus] = None
    priority: Optional[ComplaintPriority] = None
    resolution: Optional[str] = None


class ComplaintResponse(BaseModel):
    id: int
    complaint_uid: str
    booking_id: int
    customer_id: int
    subject: str
    description: str
    status: ComplaintStatus
    priority: ComplaintPriority
    resolution: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
