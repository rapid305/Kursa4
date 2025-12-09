from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from backend.app.core.config import settings
from backend.app.core.database import init_db
from backend.app.api.v1 import api_router
from backend.app.core.exceptions import BaseAppException

app = FastAPI(
    title="ZooSystem API",
    description="Система управления зоопарком с авторизацией и разграничением прав",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Trusted Host Middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*.example.com"]
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(BaseAppException)
async def app_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Обработка неожиданных исключений"""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


# Include routers
app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["root"])
async def read_root():
    return {
        "message": "Welcome to ZooSystem API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "status": "active"
    }


@app.get("/health", tags=["health"])
async def health_check():
    """Проверка здоровья приложения"""
    return {
        "status": "healthy",
        "service": "ZooSystem API"
    }


@app.on_event("startup")
async def startup_event():
    """Инициализация при запуске приложения"""
    init_db()
    print("✓ Database initialized")
    print("✓ API is ready")


@app.on_event("shutdown")
async def shutdown_event():
    """Очистка при завершении приложения"""
    print("✓ API shutdown")


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
