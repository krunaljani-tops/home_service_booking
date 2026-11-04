from sqlalchemy import Boolean, Column, ForeignKey, Integer, Numeric, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.session import Base


class ProviderService(Base):
    __tablename__ = "provider_services"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    provider_id = Column(Integer, ForeignKey("service_providers.id", ondelete="CASCADE"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id", ondelete="CASCADE"), nullable=False)
    custom_price = Column(Numeric(10, 2), nullable=True)
    is_available = Column(Boolean, default=True, nullable=False)

    __table_args__ = (
        UniqueConstraint("provider_id", "service_id", name="uq_provider_service"),
    )

    # Relationships
    provider = relationship("ServiceProvider", back_populates="provider_services")
    service = relationship("Service", back_populates="provider_services")
