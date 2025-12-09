from fastapi import APIRouter
from backend.app.api.v1 import auth, users, animals, species, enclosures, profile, all_stats

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(profile.router)
api_router.include_router(users.router)
api_router.include_router(animals.router)
api_router.include_router(species.router)
api_router.include_router(enclosures.router)
api_router.include_router(all_stats.router)

