from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy import String, Date, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import BaseModel

if TYPE_CHECKING:
    from backend.app.models.species import SpeciesModel
    from backend.app.models.enclosure import EnclosureModel


class AnimalModel(BaseModel):
    """Модель животного"""
    __tablename__ = 'animals'

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        index=True,
    )
    gender: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )  # male, female, unknown
    birth_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )
    arrival_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )
    health_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="healthy",
    )  # healthy, sick, under_observation
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Foreign keys
    species_uuid: Mapped[str] = mapped_column(
        ForeignKey("species.uuid"),
        nullable=False,
        index=True,
    )
    enclosure_uuid: Mapped[str | None] = mapped_column(
        ForeignKey("enclosures.uuid"),
        nullable=True,
        index=True,
    )

    # Relationships
    species: Mapped["SpeciesModel"] = relationship(
        "SpeciesModel",
        back_populates="animals"
    )
    enclosure: Mapped["EnclosureModel | None"] = relationship(
        "EnclosureModel",
        back_populates="animals"
    )

