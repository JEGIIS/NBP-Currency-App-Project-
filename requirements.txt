from datetime import date
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import crud, models
from app.database import Base, engine, get_db
from app.nbp_client import NbpClientError, fetch_rates_from_nbp
from app.schemas import CurrencyRateOut, FetchRequest, FetchResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NBP Currency API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/currencies")
def currencies(db: Session = Depends(get_db)):
    rows = crud.get_all_currencies(db)
    return [{"code": row.code, "currency": row.currency} for row in rows]


@app.get("/currencies/range", response_model=list[CurrencyRateOut])
def rates_range(
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: Session = Depends(get_db),
):
    if start_date > end_date:
        raise HTTPException(status_code=400, detail="start_date cannot be later than end_date")
    return crud.get_rates_by_range(db, start_date, end_date)


@app.get("/currencies/{selected_date}", response_model=list[CurrencyRateOut])
def rates_by_date(selected_date: date, db: Session = Depends(get_db)):
    return crud.get_rates_by_date(db, selected_date)


@app.post("/currencies/fetch", response_model=FetchResponse)
async def fetch_currencies(payload: FetchRequest, db: Session = Depends(get_db)):
    if payload.start_date > payload.end_date:
        raise HTTPException(status_code=400, detail="start_date cannot be later than end_date")

    try:
        tables = await fetch_rates_from_nbp(payload.start_date, payload.end_date)
    except NbpClientError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    saved = crud.save_nbp_tables(db, tables)
    return {"saved": saved, "message": "Currency rates fetched successfully"}
