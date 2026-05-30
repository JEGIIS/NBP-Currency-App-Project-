from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@db:5432/nbp_db"
    nbp_base_url: str = "https://api.nbp.pl/api"

    class Config:
        env_file = ".env"


settings = Settings()
