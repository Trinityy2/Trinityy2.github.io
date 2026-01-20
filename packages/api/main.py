from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import uvicorn

from app.core.config import settings
from app.core.exceptions import setup_exception_handlers
from app.api.main import api_router
from app.middleware.auth import StrapiAuthMiddleware


def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""

    app = FastAPI(
        title=settings.PROJECT_NAME,
        description=settings.PROJECT_DESCRIPTION,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
        redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
    )

    # Set up CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add authentication middleware
    if settings.ENABLE_AUTH_MIDDLEWARE:
        app.add_middleware(
            StrapiAuthMiddleware,
            strapi_url=str(settings.STRAPI_URL),
            jwt_secret=settings.JWT_SECRET,
            excluded_paths=[
                "/docs",
                "/redoc",
                "/openapi.json",
                "/health",
                "/files",
                f"{settings.API_V1_STR}/auth/login",
                f"{settings.API_V1_STR}/auth/refresh",
            ],
        )

    # Include API router
    app.include_router(api_router, prefix=settings.API_V1_STR)

    # Mount static files for local storage
    if settings.STORAGE_PROVIDER == "local":
        os.makedirs(settings.STORAGE_LOCAL_PATH, exist_ok=True)
        app.mount(
            "/files",
            StaticFiles(directory=settings.STORAGE_LOCAL_PATH),
            name="files"
        )

    # Set up exception handlers
    setup_exception_handlers(app)

    @app.get("/health")
    async def health_check():
        """Health check endpoint."""
        return {"status": "healthy", "environment": settings.ENVIRONMENT}

    return app


app = create_application()


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development",
    )
