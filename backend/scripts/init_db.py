"""
Скрипт для инициализации базы данных и создания первого администратора
"""
import os
from sqlalchemy.orm import Session
from backend.app.core.database import SessionLocal, init_db
from backend.app.models.user import UserModel, UserRole
from backend.app.core.security import get_password_hash


def create_admin_user():
    """Создает первого администратора, если его еще нет"""
    db: Session = SessionLocal()
    try:
        admin = db.query(UserModel).filter(UserModel.role == UserRole.ADMIN).first()
        if admin:
            print("Администратор уже существует!")
            return

        admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com").strip()
        admin_password = os.getenv("ADMIN_PASSWORD", "admin123").strip()

        if len(admin_password.encode('utf-8')) > 72:
            print("Ошибка: Пароль не может быть длиннее 72 символов")
            return

        admin = UserModel(
            email=admin_email,
            first_name="Admin",
            last_name="User",
            hashed_password=get_password_hash(admin_password),
            role=UserRole.ADMIN,
        )
        db.add(admin)
        db.commit()
        print("Администратор создан успешно!")
        print(f"Email: {admin_email}")
    except Exception as e:
        print(f"Ошибка при создании администратора: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("Инициализация базы данных...")
    init_db()
    print("База данных инициализирована!")
    print("\nСоздание администратора...")
    create_admin_user()
