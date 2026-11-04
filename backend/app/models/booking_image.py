import enum
from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship
from app.database.session import Base


class BookingImageType(str, enum.Enum):
    REFERENCE = "REFERENCE"
    BEFORE = "BEFORE"
    AFTER = "AFTER"


class BookingImage(Base):
    __tablename__ = "booking_images"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(500), nullable=False)
    image_type = Column(Enum(BookingImageType), nullable=False, default=BookingImageType.REFERENCE)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    uploaded_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relationships
    booking = relationship("Booking", back_populates="images")
    uploader = relationship("User")
