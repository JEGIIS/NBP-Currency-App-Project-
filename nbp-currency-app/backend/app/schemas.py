from datetime import date
from pydantic import BaseModel, Field


class CurrencyRateOut(BaseModel):
    id: int
    currency: str
    code: str
    rate: float
    effective_date: date
    year: int
    quarter: int
    month: int
    day: int

    class Config:
        from_attributes = True


class FetchRequest(BaseModel):
    start_date: date = Field(..., description="Start date in YYYY-MM-DD format")
    end_date: date = Field(..., description="End date in YYYY-MM-DD format")


class FetchResponse(BaseModel):
    saved: int
    message: str
