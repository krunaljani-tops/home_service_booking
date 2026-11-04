from sqlalchemy import Boolean, Column, ForeignKey, Integer, Time, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.session import Base


class AvailabilitySlot(Base):
    __tablename__ = "availability_slots"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    provider_id = Column(Integer, ForeignKey("service_providers.id", ondelete="CASCADE"), nullable=False)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_available = Column(Boolean, default=True, nullable=False)

    __table_args__ = (
        UniqueConstraint("provider_id", "day_of_week", "start_time", name="uq_provider_availability"),
    )

    # Relationships
    provider = relationship("ServiceProvider", back_populates="availability_slots")
