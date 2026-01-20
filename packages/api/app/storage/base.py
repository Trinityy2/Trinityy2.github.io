from abc import ABC, abstractmethod
from typing import BinaryIO, Dict, List, Optional
from dataclasses import dataclass


@dataclass
class FileInfo:
    """File information dataclass."""
    key: str
    size: int
    last_modified: float
    url: str
    content_type: Optional[str] = None


class StorageInterface(ABC):
    """Abstract base class for storage providers."""

    @abstractmethod
    async def upload_file(
        self,
        file: BinaryIO,
        path: str,
        content_type: Optional[str] = None,
        metadata: Optional[Dict] = None
    ) -> str:
        """Upload a file and return the public URL."""
        pass

    @abstractmethod
    async def download_file(self, path: str) -> BinaryIO:
        """Download a file."""
        pass

    @abstractmethod
    async def delete_file(self, path: str) -> bool:
        """Delete a file."""
        pass

    @abstractmethod
    async def get_file_url(self, path: str, expires_in: int = 3600) -> str:
        """Get a signed/public URL for the file."""
        pass

    @abstractmethod
    async def list_files(
        self,
        prefix: str = "",
        limit: int = 100
    ) -> List[FileInfo]:
        """List files with metadata."""
        pass

    @abstractmethod
    async def file_exists(self, path: str) -> bool:
        """Check if file exists."""
        pass
