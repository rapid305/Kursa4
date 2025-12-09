"""
Кастомные исключения приложения
"""
from fastapi import HTTPException, status


class BaseAppException(HTTPException):
    """Базовое исключение приложения"""
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)


class NotFoundException(BaseAppException):
    """Ресурс не найден"""
    def __init__(self, resource: str = "Ресурс"):
        super().__init__(
            detail=f"{resource} не найден",
            status_code=status.HTTP_404_NOT_FOUND
        )


class UnauthorizedException(BaseAppException):
    """Неавторизованный доступ"""
    def __init__(self, detail: str = "Требуется аутентификация"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class ForbiddenException(BaseAppException):
    """Недостаточно прав"""
    def __init__(self, detail: str = "Недостаточно прав"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_403_FORBIDDEN
        )


class ConflictException(BaseAppException):
    """Конфликт (например, дублирование)"""
    def __init__(self, detail: str = "Конфликт"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_409_CONFLICT
        )


class BadRequestException(BaseAppException):
    """Неверный запрос"""
    def __init__(self, detail: str = "Неверный запрос"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_400_BAD_REQUEST
        )


class ValidationException(BadRequestException):
    """Ошибка валидации"""
    def __init__(self, field: str, message: str):
        super().__init__(detail=f"{field}: {message}")

