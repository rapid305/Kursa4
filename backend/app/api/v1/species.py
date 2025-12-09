from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_active_user, require_role
from backend.app.models.species import SpeciesModel
from backend.app.models.user import UserRole
from backend.app.schemas.species import SpeciesCreate, SpeciesUpdate, SpeciesResponse

router = APIRouter(prefix="/species", tags=["species"])


@router.get("/", response_model=List[SpeciesResponse])
async def get_species(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None, description="Поиск по названию вида"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    """Получить список видов животных с возможностью поиска"""
    query = db.query(SpeciesModel).filter(SpeciesModel.is_active == True)
    
    if search:
        query = query.filter(
            SpeciesModel.name.ilike(f"%{search}%")
        )
    
    species = query.offset(skip).limit(limit).all()
    return species


@router.get("/{species_uuid}", response_model=SpeciesResponse)
async def get_species_by_uuid(
    species_uuid: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    """Получить информацию о виде"""
    species = db.query(SpeciesModel).filter(
        SpeciesModel.uuid == species_uuid,
        SpeciesModel.is_active == True
    ).first()
    
    if not species:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вид не найден")
    
    return species


@router.post("/", response_model=SpeciesResponse, status_code=status.HTTP_201_CREATED)
async def create_species(
    species_create: SpeciesCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role([UserRole.ADMIN])),
):
    """Создать новый вид (требует роль admin)"""
    # Проверка на уникальность имени
    existing = db.query(SpeciesModel).filter(SpeciesModel.name == species_create.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Вид с таким названием уже существует")
    
    species = SpeciesModel(**species_create.model_dump())
    db.add(species)
    db.commit()
    db.refresh(species)
    return species


@router.put("/{species_uuid}", response_model=SpeciesResponse)
async def update_species(
    species_uuid: UUID,
    species_update: SpeciesUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role([UserRole.ADMIN])),
):
    """Обновить информацию о виде (требует роль admin)"""
    species = db.query(SpeciesModel).filter(SpeciesModel.uuid == species_uuid).first()
    if not species:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вид не найден")
    
    update_data = species_update.model_dump(exclude_unset=True)
    
    # Проверка уникальности имени, если обновляется
    if "name" in update_data:
        existing = db.query(SpeciesModel).filter(
            SpeciesModel.name == update_data["name"],
            SpeciesModel.uuid != species_uuid
        ).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Вид с таким названием уже существует")
    
    for field, value in update_data.items():
        setattr(species, field, value)
    
    db.commit()
    db.refresh(species)
    return species


@router.delete("/{species_uuid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_species(
    species_uuid: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(require_role([UserRole.ADMIN])),
):
    """Удалить вид (требует роль admin)"""
    species = db.query(SpeciesModel).filter(SpeciesModel.uuid == species_uuid).first()
    if not species:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вид не найден")
    
    species.is_active = False
    db.commit()
    return None

