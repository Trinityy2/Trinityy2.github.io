from fastapi import APIRouter

from .endpoints import auth, blog, projects, storage, analytics

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(blog.router, prefix="/blog", tags=["blog"])
api_router.include_router(
    projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(storage.router, prefix="/storage", tags=["storage"])
api_router.include_router(
    analytics.router, prefix="/analytics", tags=["analytics"])
