from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./portfolio.db"
    database_url_sync: str = "sqlite:///./portfolio.db"
    admin_api_key: str = "portfolio-admin-key-change-me"
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]
    media_dir: str = "../frontend/public/media"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
