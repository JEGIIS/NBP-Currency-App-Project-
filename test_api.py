from datetime import date
from sqlalchemy.orm import Session
from app.models import CurrencyRate


def get_all_currencies(db: Session):
    return db.query(CurrencyRate.code, CurrencyRate.currency).distinct().order_by(CurrencyRate.code).all()


def get_rates_by_date(db: Session, selected_date: date):
    return db.query(CurrencyRate).filter(CurrencyRate.effective_date == selected_date).order_by(CurrencyRate.code).all()


def get_rates_by_range(db: Session, start_date: date, end_date: date):
    return (
        db.query(CurrencyRate)
        .filter(CurrencyRate.effective_date >= start_date, CurrencyRate.effective_date <= end_date)
        .order_by(CurrencyRate.effective_date, CurrencyRate.code)
        .all()
    )


def save_nbp_tables(db: Session, tables: list[dict]) -> int:
    saved = 0

    for table in tables:
        effective_date = date.fromisoformat(table["effectiveDate"])
        quarter = ((effective_date.month - 1) // 3) + 1

        for rate in table["rates"]:
            existing = (
                db.query(CurrencyRate)
                .filter(
                    CurrencyRate.code == rate["code"],
                    CurrencyRate.effective_date == effective_date,
                )
                .first()
            )
            if existing:
                existing.rate = rate["mid"]
                existing.currency = rate["currency"]
            else:
                db.add(
                    CurrencyRate(
                        currency=rate["currency"],
                        code=rate["code"],
                        rate=rate["mid"],
                        effective_date=effective_date,
                        year=effective_date.year,
                        quarter=quarter,
                        month=effective_date.month,
                        day=effective_date.day,
                    )
                )
                saved += 1

    db.commit()
    return saved
