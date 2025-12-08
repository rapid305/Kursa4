from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class SpeciesBase(BaseModel):
    name: str
    scientific_name: str
    description: str | None = None
    habitat: str | None = None
    diet: str | None = None
    conservation_status: str | None = None


class SpeciesCreate(SpeciesBase):
    pass


class SpeciesUpdate(BaseModel):
    name: str | None = None
    scientific_name: str | None = None
    description: str | None = None
    habitat: str | None = None
    diet: str | None = None
    conservation_status: str | None = None


class SpeciesResponse(SpeciesBase):
    uuid: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

