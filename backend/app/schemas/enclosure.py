from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class EnclosureBase(BaseModel):
    name: str
    enclosure_type: str
    area: float | None = None
    capacity: int | None = None
    description: str | None = None
    location: str | None = None


class EnclosureCreate(EnclosureBase):
    pass


class EnclosureUpdate(BaseModel):
    name: str | None = None
    enclosure_type: str | None = None
    area: float | None = None
    capacity: int | None = None
    description: str | None = None
    location: str | None = None


class EnclosureResponse(EnclosureBase):
    uuid: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

