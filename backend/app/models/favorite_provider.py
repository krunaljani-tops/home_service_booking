from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.database.session import Base


class FavoriteProvider(Base):
    __tablename__ = "favorite_providers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    provider_id = Column(Integer, ForeignKey("service_providers.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("customer_id", "provider_id", name="uq_customer_favorite_provider"),
    )

    # Relationships
    customer = relationship("Customer", back_populates="favorite_providers")
    provider = relationship("ServiceProvider")
