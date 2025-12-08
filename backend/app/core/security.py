from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from backend.app.core.config import settings

# Инициализируем с правильными параметрами
try:
    pwd_context = CryptContext(
        schemes=["bcrypt"],
        deprecated="auto",
        bcrypt__ident="2y",  # Пробуем другой идентификатор
    )
except ValueError:
    # Если не работает с 2y, пробуем минимальную конфигурацию
    pwd_context = CryptContext(schemes=["bcrypt"])


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверяет пароль с безопасной обрезкой"""
    try:
        # Безопасная проверка с обрезкой
        if len(plain_password.encode('utf-8')) > 72:
            password_bytes = plain_password.encode('utf-8')[:72]
            plain_password = password_bytes.decode('utf-8', errors='ignore')
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """Хеширует пароль с проверкой длины"""
    # Всегда обрезаем для безопасности
    if len(password.encode('utf-8')) > 72:
        password_bytes = password.encode('utf-8')[:72]
        password = password_bytes.decode('utf-8', errors='ignore')
    
    try:
        return pwd_context.hash(password)
    except ValueError as e:
        # Если все еще ошибка, используем fallback
        if "password cannot be longer than 72 bytes" in str(e):
            # Дополнительная обрезка
            password_bytes = password.encode('utf-8')[:70]
            password = password_bytes.decode('utf-8', errors='ignore')
            return pwd_context.hash(password)
        raise


# Остальные функции остаются без изменений...
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    """Декодирует и валидирует JWT токен"""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None