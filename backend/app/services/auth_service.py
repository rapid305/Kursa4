from datetime import timedelta

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend.app.models.user import UserModel, UserRole
from backend.app.schemas.user import UserCreate, UserLogin
from backend.app.core.security import verify_password, get_password_hash, create_access_token
from backend.app.core.config import settings


def authenticate_user(db: Session, email: str, password: str) -> UserModel | None:
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        verify_password("dummy_password", "dummy_hash")
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_user(db: Session, user_create: UserCreate) -> UserModel:
    """Создает нового пользователя"""
    # Проверяем, существует ли пользователь с таким email
    existing_user = db.query(UserModel).filter(
        UserModel.email == user_create.email
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Хешируем пароль
    hashed_password = get_password_hash(user_create.password)
    
    # Создаем пользователя
    db_user = UserModel(
        email=user_create.email,
        first_name=user_create.first_name,
        last_name=user_create.last_name,
        hashed_password=hashed_password,
        role=user_create.role or UserRole.USER,  # Дефолтная роль
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )



def login_user(db: Session, user_login: UserLogin) -> dict:
    """Выполняет вход пользователя и возвращает токен"""
    user = authenticate_user(db, user_login.email, user_login.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Создаем токен доступа
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    
    access_token = create_access_token(
        data={
            "sub": user.email, 
            "role": user.role.value,
            "user_id": str(user.uuid)  # Добавляем user_id для удобства
        },
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": user.uuid,
        "email": user.email,
        "role": user.role.value
    }

