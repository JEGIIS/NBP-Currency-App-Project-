from sqlalchemy import Column, Date, DateTime, Float, Integer, String, UniqueConstraint
from sqlalchemy.sql import func
from app.database import Base


class CurrencyRate(Base):
    __tablename__ = "currency_rates"
    __table_args__ = (
        UniqueConstraint("code", "effective_date", name="uq_currency_code_date"),
    )

    id = Column(Integer, primary_key=True, index=True)
    currency = Column(String(120), nullable=False)
    code = Column(String(3), index=True, nullable=False)
    rate = Column(Float, nullable=False)
    effective_date = Column(Date, index=True, nullable=False)
    year = Column(Integer, index=True, nullable=False)
    quarter = Column(Integer, index=True, nullable=False)
    month = Column(Integer, index=True, nullable=False)
    day = Column(Integer, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
