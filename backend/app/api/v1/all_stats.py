from fastapi import APIRouter
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.animal import AnimalModel
from backend.app.models.user import UserModel
from backend.app.models.enclosure import EnclosureModel
from backend.app.models.species import SpeciesModel
from fastapi import Depends
from sqlalchemy import select
from sqlalchemy import func


router = APIRouter(prefix="/stats",tags=["stats"])


@router.get("/")
async def stats(
   db: Session = Depends(get_db)
):
    animal_count = db.scalar(select(func.count()).select_from(AnimalModel)) or 0
    users_count = db.scalar(select(func.count()).select_from(UserModel)) or 0
    enclosures_count = db.scalar(select(func.count()).select_from(EnclosureModel)) or 0
    species_count = db.scalar(select(func.count()).select_from(SpeciesModel)) or 0

    return {
        "animals": animal_count or 0,
        "users": users_count or 0,
        "enclosures": enclosures_count or 0,
        "species": species_count or 0,
    }