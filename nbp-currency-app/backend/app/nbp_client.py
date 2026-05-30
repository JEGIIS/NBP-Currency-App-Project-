from datetime import date
import httpx
from app.config import settings


class NbpClientError(Exception):
    pass


async def fetch_rates_from_nbp(start_date: date, end_date: date) -> list[dict]:
    url = f"{settings.nbp_base_url}/exchangerates/tables/a/{start_date}/{end_date}/"
    params = {"format": "json"}

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(url, params=params)

    if response.status_code == 404:
        return []
    if response.status_code != 200:
        raise NbpClientError(f"NBP API returned status {response.status_code}")

    return response.json()
