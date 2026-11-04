import enum
from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, Numeric, func
from sqlalchemy.orm import relationship
from app.database.session import Base


class EarningStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    HELD = "HELD"


class ProviderEarning(Base):
    __tablename__ = "provider_earnings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    provider_id = Column(Integer, ForeignKey("service_providers.id", ondelete="CASCADE"), nullable=False)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), unique=True, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    commission_amount = Column(Numeric(10, 2), nullable=False)
    earning_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(EarningStatus), default=EarningStatus.PENDING, nullable=False)
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relationships
    provider = relationship("ServiceProvider", back_populates="earnings")
    booking = relationship("Booking", back_populates="earning")
