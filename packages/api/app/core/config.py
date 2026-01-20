from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    """Application settings."""

    # Project Info
    PROJECT_NAME: str = "Personal Website API"
    PROJECT_DESCRIPTION: str = "FastAPI backend for personal website"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Security
    JWT_SECRET: str = os.getenv(
        "JWT_SECRET", "your-shared-jwt-secret-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",  # Vue dev server
        "http://localhost:1337",  # Strapi
        "http://localhost:8000",  # FastAPI
    ]

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://personal_website_user:personal_website_pass@localhost:5432/personal_website"
    )

    # Strapi Integration
    STRAPI_URL: AnyHttpUrl = os.getenv("STRAPI_URL", "http://localhost:1337")
    STRAPI_API_TOKEN: Optional[str] = os.getenv("STRAPI_API_TOKEN")
    ENABLE_AUTH_MIDDLEWARE: bool = os.getenv(
        "ENABLE_AUTH_MIDDLEWARE", "true").lower() == "true"

    # Storage Configuration
    STORAGE_PROVIDER: str = os.getenv("STORAGE_PROVIDER", "local")
    STORAGE_LOCAL_PATH: str = os.getenv("STORAGE_LOCAL_PATH", "./uploads")
    STORAGE_LOCAL_URL: str = os.getenv(
        "STORAGE_LOCAL_URL", "http://localhost:8000/files")

    # AWS S3 Configuration
    AWS_S3_BUCKET: Optional[str] = os.getenv("AWS_S3_BUCKET")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_ACCESS_KEY_ID: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY")

    # Cloudflare R2 Configuration
    CLOUDFLARE_R2_BUCKET: Optional[str] = os.getenv("CLOUDFLARE_R2_BUCKET")
    CLOUDFLARE_R2_ACCOUNT_ID: Optional[str] = os.getenv(
        "CLOUDFLARE_R2_ACCOUNT_ID")
    CLOUDFLARE_R2_ACCESS_KEY: Optional[str] = os.getenv(
        "CLOUDFLARE_R2_ACCESS_KEY")
    CLOUDFLARE_R2_SECRET_KEY: Optional[str] = os.getenv(
        "CLOUDFLARE_R2_SECRET_KEY")

    # Email Configuration
    SMTP_HOST: Optional[str] = os.getenv("SMTP_HOST")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER")
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "noreply@personalwebsite.com")

    class Config:
        case_sensitive = True


settings = Settings()
