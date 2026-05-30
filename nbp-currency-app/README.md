# NBP Currency App

Aplikacja internetowa do pobierania i wyświetlania kursów walut z API NBP.

## Technologie

- Frontend: Angular
- Backend: FastAPI
- Baza danych: PostgreSQL
- Testy backendu: Pytest
- Testy frontendu: Jasmine/Karma
- Konteneryzacja: Docker Compose

## Struktura projektu

```text
nbp-currency-app/
├── backend/
│   ├── app/
│   └── tests/
├── frontend/
│   └── src/
├── features/
└── docker-compose.yml
```

## Uruchomienie

```bash
docker compose up --build
```

Po uruchomieniu:

- Frontend: http://localhost:4200
- Backend: http://localhost:8000
- Dokumentacja API: http://localhost:8000/docs

## Endpointy backendu

```text
GET  /health
GET  /currencies
GET  /currencies/{selected_date}
GET  /currencies/range?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
POST /currencies/fetch
```

Przykładowe ciało żądania dla `POST /currencies/fetch`:

```json
{
  "start_date": "2024-01-02",
  "end_date": "2024-01-05"
}
```

## Testy backendu

```bash
cd backend
pytest
```

Lub w kontenerze:

```bash
docker compose exec backend pytest
```

## Testy frontendu

```bash
cd frontend
npm test
```

Lub w kontenerze:

```bash
docker compose exec frontend npm test
```

## Funkcjonalności

- Pobieranie kursów walut z API NBP
- Zapis kursów w PostgreSQL
- Wyświetlanie kursów w Angularze
- Grupowanie danych według lat, kwartałów, miesięcy i dni
- Testy jednostkowe backendu i frontendu
- Scenariusze BDD w katalogu `features`
