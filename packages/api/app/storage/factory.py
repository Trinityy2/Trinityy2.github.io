from enum import Enum
from typing import Dict, Any

from .base import StorageInterface
from .local import LocalFileStorage

# Note: S3 and CloudFlare R2 implementations would be imported here when boto3 is available


class StorageProvider(Enum):
    """Available storage providers."""
    LOCAL = "local"
    S3 = "s3"
    CLOUDFLARE_R2 = "cloudflare_r2"


class StorageFactory:
    """Factory for creating storage instances."""

    @staticmethod
    def create_storage(provider: StorageProvider, **config: Any) -> StorageInterface:
        """Create storage instance based on provider.

        Args:
            provider: Storage provider type
            **config: Configuration parameters specific to the provider

        Returns:
            StorageInterface implementation

        Raises:
            ValueError: If provider is not supported
        """
        if provider == StorageProvider.LOCAL:
            return LocalFileStorage(
                base_path=config['base_path'],
                base_url=config['base_url']
            )
        # elif provider == StorageProvider.S3:
        #     return S3Storage(
        #         bucket_name=config['bucket_name'],
        #         region=config.get('region', 'us-east-1'),
        #         access_key=config.get('access_key'),
        #         secret_key=config.get('secret_key')
        #     )
        # elif provider == StorageProvider.CLOUDFLARE_R2:
        #     return CloudflareR2Storage(
        #         bucket_name=config['bucket_name'],
        #         account_id=config['account_id'],
        #         access_key=config['access_key'],
        #         secret_key=config['secret_key']
        #     )
        else:
            raise ValueError(f"Unsupported storage provider: {provider}")


def create_configured_storage() -> StorageInterface:
    """Create storage instance from application configuration."""
    from app.core.config import settings

    provider = StorageProvider(settings.STORAGE_PROVIDER)

    if provider == StorageProvider.LOCAL:
        return StorageFactory.create_storage(
            provider,
            base_path=settings.STORAGE_LOCAL_PATH,
            base_url=settings.STORAGE_LOCAL_URL
        )
    # elif provider == StorageProvider.S3:
    #     return StorageFactory.create_storage(
    #         provider,
    #         bucket_name=settings.AWS_S3_BUCKET,
    #         region=settings.AWS_REGION,
    #         access_key=settings.AWS_ACCESS_KEY_ID,
    #         secret_key=settings.AWS_SECRET_ACCESS_KEY
    #     )
    # elif provider == StorageProvider.CLOUDFLARE_R2:
    #     return StorageFactory.create_storage(
    #         provider,
    #         bucket_name=settings.CLOUDFLARE_R2_BUCKET,
    #         account_id=settings.CLOUDFLARE_R2_ACCOUNT_ID,
    #         access_key=settings.CLOUDFLARE_R2_ACCESS_KEY,
    #         secret_key=settings.CLOUDFLARE_R2_SECRET_KEY
    #     )
    else:
        raise ValueError(
            f"Unsupported storage provider: {settings.STORAGE_PROVIDER}")
