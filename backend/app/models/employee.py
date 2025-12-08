from typing import TYPE_CHECKING
from sqlalchemy import String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.models.base import BaseModel

if TYPE_CHECKING:
    from backend.app.models.user import UserModel


class EmployeeModel(BaseModel):
    """Модель сотрудника зоопарка"""
    __tablename__ = 'employees'

    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    position: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )  # zookeeper, veterinarian, administrator, etc.
    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )
    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    hire_date: Mapped[Date] = mapped_column(
        Date,
        nullable=False,
    )

    # Foreign key to user (optional - для связи с системой авторизации)
    user_uuid: Mapped[str | None] = mapped_column(
        ForeignKey("users.uuid"),
        nullable=True,
        index=True,
    )

    # Relationships
    user: Mapped["UserModel | None"] = relationship(
        "UserModel",
        foreign_keys=[user_uuid]
    )

