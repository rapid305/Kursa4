from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from uuid import UUID
from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_active_user, require_role
from backend.app.models.animal import AnimalModel
from backend.app.models.user import UserRole
from backend.app.schemas.animal import AnimalCreate, AnimalUpdate, AnimalResponse
from backend.app.models.species import SpeciesModel
from backend.app.models.enclosure import EnclosureModel
from backend.app.models.species import SpeciesModel

router = APIRouter(prefix="/animals", tags=["animals"])


@router.get("/", response_model=List[AnimalResponse])
async def get_animals(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None, description="Поиск по имени животного или виду"),
    species_uuid: Optional[UUID] = Query(None, description="Фильтр по виду"),
    enclosure_uuid: Optional[UUID] = Query(None, description="Фильтр по вольеру"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    """Получить список животных с возможностью поиска и фильтрации"""
    query = db.query(AnimalModel).filter(AnimalModel.is_active == True)
    
    if search:
        query = query.outerjoin(SpeciesModel, AnimalModel.species_uuid == SpeciesModel.uuid).filter(
            or_(
                AnimalModel.name.ilike(f"%{search}%"),
                SpeciesModel.name.ilike(f"%{search}%")
            )
        )
    
    if species_uuid:
        query = query.filter(AnimalModel.species_uuid == species_uuid)
    
    if enclosure_uuid:
        query = query.filter(AnimalModel.enclosure_uuid == enclosure_uuid)
    
    animals = query.offset(skip).limit(limit).all()
    return animals


@router.get("/{animal_uuid}", response_model=AnimalResponse)
async def get_animal(
    animal_uuid: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    """Получить информацию о животном"""
    animal = db.query(AnimalModel).filter(
        AnimalModel.uuid == animal_uuid,
        AnimalModel.is_active == True
    ).first()
    
    if not animal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Животное не найдено")
    
    return animal


@router.post("/", response_model=AnimalResponse, status_code=status.HTTP_201_CREATED)
async def create_animal(
    animal_create: AnimalCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role([UserRole.ADMIN])),
):
    """Создать новое животное (требует роль admin)"""
    # Проверка существования вида
    species = db.query(SpeciesModel).filter(SpeciesModel.uuid == animal_create.species_uuid).first()
    if not species:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вид не найден")
    
    # Проверка существования вольера (если указан)
    if animal_create.enclosure_uuid:
        enclosure = db.query(EnclosureModel).filter(EnclosureModel.uuid == animal_create.enclosure_uuid).first()
        if not enclosure:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вольер не найден")
    
    animal = AnimalModel(**animal_create.model_dump())
    db.add(animal)
    db.commit()
    db.refresh(animal)
    return animal


@router.put("/{animal_uuid}", response_model=AnimalResponse)
async def update_animal(
    animal_uuid: UUID,
    animal_update: AnimalUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role([UserRole.ADMIN])),
):
    """Обновить информацию о животном (требует роль admin)"""
    animal = db.query(AnimalModel).filter(AnimalModel.uuid == animal_uuid).first()
    if not animal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Животное не найдено")
    
    update_data = animal_update.model_dump(exclude_unset=True)
    
    # Проверка вида, если обновляется
    if "species_uuid" in update_data:
        from backend.app.models.species import SpeciesModel
        species = db.query(SpeciesModel).filter(SpeciesModel.uuid == update_data["species_uuid"]).first()
        if not species:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вид не найден")
    
    # Проверка вольера, если обновляется
    if "enclosure_uuid" in update_data and update_data["enclosure_uuid"]:
        from backend.app.models.enclosure import EnclosureModel
        enclosure = db.query(EnclosureModel).filter(EnclosureModel.uuid == update_data["enclosure_uuid"]).first()
        if not enclosure:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Вольер не найден")
    
    for field, value in update_data.items():
        setattr(animal, field, value)
    
    db.commit()
    db.refresh(animal)
    return animal


@router.delete("/{animal_uuid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_animal(
    animal_uuid: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(require_role([UserRole.ADMIN])),
):
    """Удалить животное (требует роль admin)"""
    animal = db.query(AnimalModel).filter(AnimalModel.uuid == animal_uuid).first()
    if not animal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Животное не найдено")
    
    animal.is_active = False
    db.commit()
    return None

