from typing import TYPE_CHECKING
from sqlalchemy import String, Numeric, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import BaseModel

if TYPE_CHECKING:
    from backend.app.models.animal import AnimalModel


class EnclosureModel(BaseModel):
    """Модель вольера"""
    __tablename__ = 'enclosures'

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        unique=True,
        index=True,
    )
    enclosure_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )  # indoor, outdoor, mixed
    area: Mapped[float | None] = mapped_column(
        Numeric(10, 2),
        nullable=True,
    )  # площадь в квадратных метрах
    capacity: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )  # максимальное количество животных
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    location: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    # Relationships
    animals: Mapped[list["AnimalModel"]] = relationship(
        "AnimalModel",
        back_populates="enclosure"
    )

