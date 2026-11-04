import enum
from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, Numeric, String, Text, JSON, func
from sqlalchemy.orm import relationship
from app.database.session import Base


class VerificationStatus(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class ServiceProvider(Base):
    __tablename__ = "service_providers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company_name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    license_number = Column(String(100), nullable=True)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING, nullable=False)
    verification_documents = Column(JSON, nullable=True)
    admin_remarks = Column(Text, nullable=True)
    commission_rate = Column(Numeric(5, 2), default=15.00, nullable=False)
    rating_avg = Column(Numeric(3, 2), default=0.00, nullable=False)
    total_reviews = Column(Integer, default=0, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="service_provider")
    provider_services = relationship("ProviderService", back_populates="provider", cascade="all, delete-orphan")
    technicians = relationship("Technician", back_populates="provider", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="provider")
    earnings = relationship("ProviderEarning", back_populates="provider", cascade="all, delete-orphan")
    service_areas = relationship("ServiceArea", back_populates="provider", cascade="all, delete-orphan")
    availability_slots = relationship("AvailabilitySlot", back_populates="provider", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="provider")
