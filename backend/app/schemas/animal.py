from pydantic import BaseModel
from datetime import date, datetime
from uuid import UUID
from backend.app.schemas.species import SpeciesResponse
from backend.app.schemas.enclosure import EnclosureResponse


class AnimalBase(BaseModel):
    name: str
    gender: str
    birth_date: date | None = None
    arrival_date: date
    health_status: str = "healthy"
    description: str | None = None
    species_uuid: UUID
    enclosure_uuid: UUID | None = None


class AnimalCreate(AnimalBase):
    pass


class AnimalUpdate(BaseModel):
    name: str | None = None
    gender: str | None = None
    birth_date: date | None = None
    arrival_date: date | None = None
    health_status: str | None = None
    description: str | None = None
    species_uuid: UUID | None = None
    enclosure_uuid: UUID | None = None


class AnimalResponse(AnimalBase):
    uuid: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    species: SpeciesResponse | None = None
    enclosure: EnclosureResponse | None = None

    class Config:
        from_attributes = True

