import os
import uuid
import aiofiles
from fastapi import UploadFile
from app.core.config import settings

# Attempt to configure Cloudinary if keys are provided
has_cloudinary = False
try:
    import cloudinary
    import cloudinary.uploader

    if (
        settings.CLOUDINARY_CLOUD_NAME
        and settings.CLOUDINARY_CLOUD_NAME != "your_cloud_name"
        and settings.CLOUDINARY_API_KEY != "your_api_key"
    ):
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True,
        )
        has_cloudinary = True
except Exception:
    has_cloudinary = False


class UploadService:
    """Service to handle file and image uploads via Cloudinary or local storage fallback."""

    UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")

    @classmethod
    async def upload_image(cls, file: UploadFile, folder: str = "homeserve") -> str:
        """Upload an image file and return its accessible URL."""
        if has_cloudinary:
            contents = await file.read()
            upload_result = cloudinary.uploader.upload(
                contents,
                folder=folder,
                resource_type="auto",
            )
            return upload_result.get("secure_url", upload_result.get("url"))

        # Fallback to local file storage
        os.makedirs(cls.UPLOAD_DIR, exist_ok=True)
        file_ext = os.path.splitext(file.filename or "")[1] or ".jpg"
        filename = f"{uuid.uuid4().hex}{file_ext}"
        destination = os.path.join(cls.UPLOAD_DIR, filename)

        contents = await file.read()
        async with aiofiles.open(destination, "wb") as f:
            await f.write(contents)

        return f"{settings.BACKEND_URL}/static/uploads/{filename}"


upload_service = UploadService()
