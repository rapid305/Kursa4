from pydantic_settings import BaseSettings
from typing import Optional
import json


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/kursa4_db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production-use-env-variable"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    BCRYPT_MAX_PASSWORD_LENGTH: int = 72

    CORS_ORIGINS: str = '["http://localhost:3000", "http://localhost:5173", "http://localhost:80"]'
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def get_cors_origins(self) -> list[str]:
        """Парсит CORS_ORIGINS из строки JSON в список"""
        try:
            if isinstance(self.CORS_ORIGINS, str):
                return json.loads(self.CORS_ORIGINS)
            return self.CORS_ORIGINS
        except (json.JSONDecodeError, TypeError):
            # Если не JSON, возвращаем как список из одного элемента
            return [self.CORS_ORIGINS] if isinstance(self.CORS_ORIGINS, str) else ["http://localhost:3000"]


settings = Settings()

