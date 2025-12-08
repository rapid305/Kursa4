from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_active_user, require_role
from backend.app.models.user import UserModel, UserRole
from backend.app.schemas.user import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=List[UserResponse])
async def get_users(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Get all users (доступно всем авторизованным пользователям)"""
    users = db.query(UserModel).all()
    return users


@router.get("/{user_uuid}", response_model=UserResponse)
async def get_user(
    user_uuid: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Get user by UUID"""
    user = db.query(UserModel).filter(UserModel.uuid == user_uuid).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Users can only view their own profile unless they are admin/moderator
    if current_user.uuid != user.uuid and current_user.role not in [UserRole.ADMIN, UserRole.MODERATOR]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    
    return user


@router.put("/{user_uuid}", response_model=UserResponse)
async def update_user(
    user_uuid: str,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Update user (Admin can update anyone, users can update themselves)"""
    user = db.query(UserModel).filter(UserModel.uuid == user_uuid).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Only admin can update other users or change roles
    if current_user.uuid != user.uuid:
        if current_user.role != UserRole.ADMIN:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    
    # Only admin can change roles
    if user_update.role and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can change roles")
    
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_uuid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_uuid: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(require_role([UserRole.ADMIN]))
):
    """Delete user (Admin only)"""
    user = db.query(UserModel).filter(UserModel.uuid == user_uuid).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    db.delete(user)
    db.commit()
    return None

