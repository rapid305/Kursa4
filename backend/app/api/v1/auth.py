from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from backend.app.services.auth_service import create_user, login_user
from backend.app.core.dependencies import get_current_active_user
from backend.app.models.user import UserModel

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_create: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    return create_user(db, user_create)


@router.post("/login", response_model=Token)
async def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """Login and get access token"""
    return login_user(db, user_login)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserModel = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user

