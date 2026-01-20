from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List
import uuid
import mimetypes

from app.storage import create_configured_storage, StorageInterface

router = APIRouter()


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    storage: StorageInterface = Depends(create_configured_storage)
):
    """Upload a file to storage."""

    # Validate file type and size
    if file.size and file.size > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=413, detail="File too large")

    # Generate unique filename
    file_extension = mimetypes.guess_extension(file.content_type or '') or ''
    if file.filename:
        original_ext = '.' + \
            file.filename.split('.')[-1] if '.' in file.filename else ''
        file_extension = file_extension or original_ext

    filename = f"{uuid.uuid4()}{file_extension}"
    path = f"uploads/{filename}"

    try:
        # Upload to storage
        url = await storage.upload_file(
            file.file,
            path,
            content_type=file.content_type
        )

        return {
            "success": True,
            "data": {
                "id": filename.split('.')[0],
                "filename": file.filename,
                "path": path,
                "url": url,
                "size": file.size,
                "content_type": file.content_type
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.delete("/files/{file_path:path}")
async def delete_file(
    file_path: str,
    storage: StorageInterface = Depends(create_configured_storage)
):
    """Delete a file from storage."""

    try:
        success = await storage.delete_file(file_path)
        if success:
            return {"success": True, "message": "File deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="File not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")


@router.get("/files")
async def list_files(
    prefix: str = "",
    limit: int = 100,
    storage: StorageInterface = Depends(create_configured_storage)
):
    """List files in storage."""

    try:
        files = await storage.list_files(prefix=prefix, limit=limit)
        return {
            "success": True,
            "data": files,
            "count": len(files)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"List failed: {str(e)}")


@router.get("/files/{file_path:path}/url")
async def get_file_url(
    file_path: str,
    expires_in: int = 3600,
    storage: StorageInterface = Depends(create_configured_storage)
):
    """Get a signed URL for a file."""

    try:
        # Check if file exists
        if not await storage.file_exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")

        url = await storage.get_file_url(file_path, expires_in=expires_in)
        return {
            "success": True,
            "data": {
                "url": url,
                "expires_in": expires_in
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"URL generation failed: {str(e)}")
