from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_active_user, require_role
from backend.app.models.enclosure import EnclosureModel
from backend.app.models.user import UserRole
from backend.app.schemas.enclosure import EnclosureCreate, EnclosureUpdate, EnclosureResponse

router = APIRouter(prefix="/enclosures", tags=["enclosures"])


@router.get("/", response_model=List[EnclosureResponse])
async def get_enclosures(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None, description="Поиск по названию вольера"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    """Получить список вольеров с возможностью поиска"""
    query = db.query(EnclosureModel).filter(EnclosureModel.is_active == True)
    
    if search:
        query = query.filter(EnclosureModel.name.ilike(f"%{search}%"))
    
    enclosures = query.offset(skip).limit(limit).all()
    return enclosures


@router.get("/{enclosure_uuid}", response_model=EnclosureResponse)
async def get_enclosure_by_uuid(
    enclosure_uuid: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    """Получить информацию о вольере"""
    enclosure = db.query(EnclosureModel).filter(
        EnclosureModel.uuid == enclosure_uuid,
        EnclosureModel.is_active == True
    ).first()
    
    if not enclosure:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вольер не найден")
    
    return enclosure


@router.post("/", response_model=EnclosureResponse, status_code=status.HTTP_201_CREATED)
async def create_enclosure(
    enclosure_create: EnclosureCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role([UserRole.ADMIN])),
):
    """Создать новый вольер (требует роль admin)"""
    # Проверка на уникальность имени
    existing = db.query(EnclosureModel).filter(EnclosureModel.name == enclosure_create.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Вольер с таким названием уже существует")
    
    enclosure = EnclosureModel(**enclosure_create.model_dump())
    db.add(enclosure)
    db.commit()
    db.refresh(enclosure)
    return enclosure


@router.put("/{enclosure_uuid}", response_model=EnclosureResponse)
async def update_enclosure(
    enclosure_uuid: UUID,
    enclosure_update: EnclosureUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role([UserRole.ADMIN])),
):
    """Обновить информацию о вольере (требует роль admin)"""
    enclosure = db.query(EnclosureModel).filter(EnclosureModel.uuid == enclosure_uuid).first()
    if not enclosure:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вольер не найден")
    
    update_data = enclosure_update.model_dump(exclude_unset=True)
    
    # Проверка уникальности имени, если обновляется
    if "name" in update_data:
        existing = db.query(EnclosureModel).filter(
            EnclosureModel.name == update_data["name"],
            EnclosureModel.uuid != enclosure_uuid
        ).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Вольер с таким названием уже существует")
    
    for field, value in update_data.items():
        setattr(enclosure, field, value)
    
    db.commit()
    db.refresh(enclosure)
    return enclosure


@router.delete("/{enclosure_uuid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_enclosure(
    enclosure_uuid: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(require_role([UserRole.ADMIN])),
):
    """Удалить вольер (требует роль admin)"""
    enclosure = db.query(EnclosureModel).filter(EnclosureModel.uuid == enclosure_uuid).first()
    if not enclosure:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вольер не найден")
    
    enclosure.is_active = False
    db.commit()
    return None

