from sqlalchemy import Boolean, Column, DateTime, Integer, Numeric, String, Text, JSON, func
from app.database.session import Base


class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    duration_days = Column(Integer, nullable=False)
    max_services = Column(Integer, default=10, nullable=False)
    max_technicians = Column(Integer, default=5, nullable=False)
    commission_rate = Column(Numeric(5, 2), nullable=False)
    features = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
