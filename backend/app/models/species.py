from typing import TYPE_CHECKING
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import BaseModel

if TYPE_CHECKING:
    from backend.app.models.animal import AnimalModel


class SpeciesModel(BaseModel):
    """Модель вида животных"""
    __tablename__ = 'species'

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        unique=True,
        index=True,
    )
    scientific_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    habitat: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )
    diet: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )
    conservation_status: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    # Relationships
    animals: Mapped[list["AnimalModel"]] = relationship(
        "AnimalModel",
        back_populates="species"
    )

