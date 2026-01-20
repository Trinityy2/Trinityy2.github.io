from typing import BinaryIO, Dict, List, Optional
from pathlib import Path
import aiofiles
import mimetypes
import time

from .base import StorageInterface, FileInfo


class LocalFileStorage(StorageInterface):
    """Local file storage implementation."""

    def __init__(self, base_path: str, base_url: str):
        """Initialize local storage.

        Args:
            base_path: Local directory to store files
            base_url: Base URL for serving files
        """
        self.base_path = Path(base_path)
        self.base_url = base_url.rstrip('/')
        self.base_path.mkdir(parents=True, exist_ok=True)

    async def upload_file(
        self,
        file: BinaryIO,
        path: str,
        content_type: Optional[str] = None,
        metadata: Optional[Dict] = None
    ) -> str:
        """Upload file to local storage."""
        file_path = self.base_path / path
        file_path.parent.mkdir(parents=True, exist_ok=True)

        # Reset file pointer to beginning
        file.seek(0)

        async with aiofiles.open(file_path, 'wb') as f:
            content = file.read()
            await f.write(content)

        return f"{self.base_url}/{path}"

    async def download_file(self, path: str) -> BinaryIO:
        """Download file from local storage."""
        file_path = self.base_path / path
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {path}")

        return open(file_path, 'rb')

    async def delete_file(self, path: str) -> bool:
        """Delete file from local storage."""
        file_path = self.base_path / path
        if file_path.exists() and file_path.is_file():
            file_path.unlink()
            return True
        return False

    async def get_file_url(self, path: str, expires_in: int = 3600) -> str:
        """Get URL for local file (no expiration for local storage)."""
        return f"{self.base_url}/{path}"

    async def list_files(
        self,
        prefix: str = "",
        limit: int = 100
    ) -> List[FileInfo]:
        """List files in local storage."""
        search_path = self.base_path / prefix if prefix else self.base_path
        files = []

        if not search_path.exists():
            return files

        for file_path in search_path.rglob('*'):
            if file_path.is_file() and len(files) < limit:
                relative_path = file_path.relative_to(self.base_path)
                stat = file_path.stat()
                content_type, _ = mimetypes.guess_type(str(file_path))

                files.append(FileInfo(
                    key=str(relative_path),
                    size=stat.st_size,
                    last_modified=stat.st_mtime,
                    url=f"{self.base_url}/{relative_path}",
                    content_type=content_type
                ))

        return files

    async def file_exists(self, path: str) -> bool:
        """Check if file exists in local storage."""
        file_path = self.base_path / path
        return file_path.exists() and file_path.is_file()
