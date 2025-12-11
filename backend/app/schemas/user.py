from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from uuid import UUID
from backend.app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str


class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.VISITOR

    @field_validator('password')
    @classmethod
    def validate_password_length(cls, v: str) -> str:
        if len(v.encode('utf-8')) > 72:
            raise ValueError("Пароль не может быть длиннее 72 символов")
        if len(v) < 6:
            raise ValueError("Пароль должен содержать минимум 6 символов")
        return v


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    first_name: str | None = None
    last_name: str | None = None
    role: UserRole | None = None


class UserResponse(UserBase):
    uuid: UUID
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None
    role: UserRole | None = None
