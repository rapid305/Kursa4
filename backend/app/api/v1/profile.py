from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_active_user, require_role
from backend.app.models.user import UserModel, UserRole
from backend.app.schemas.user import UserResponse, UserUpdate
from backend.app.core.security import get_password_hash, verify_password

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/me", response_model=UserResponse)
async def get_profile(
    current_user: UserModel = Depends(get_current_active_user)
):
    """Получить профиль текущего пользователя"""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Обновить профиль текущего пользователя"""
    # Проверяем, не занят ли email другим пользователем
    if update_data.email and update_data.email != current_user.email:
        existing = db.query(UserModel).filter(
            UserModel.email == update_data.email
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

    # Обновляем поля
    if update_data.email:
        current_user.email = update_data.email
    if update_data.first_name:
        current_user.first_name = update_data.first_name
    if update_data.last_name:
        current_user.last_name = update_data.last_name

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/change-password")
async def change_password(
    old_password: str,
    new_password: str,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Изменить пароль пользователя"""
    if not verify_password(old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password"
        )

    if len(new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )

    current_user.hashed_password = get_password_hash(new_password)
    db.add(current_user)
    db.commit()

    return {"message": "Password changed successfully"}

