from typing import Any, Optional
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail: Optional[Any] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.detail = detail
        super().__init__(message)


class NotFoundException(AppException):
    """Resource not found (404)."""

    def __init__(self, message: str = "Resource not found", detail: Optional[Any] = None):
        super().__init__(message=message, status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class UnauthorizedException(AppException):
    """Authentication required or token invalid/expired (401)."""

    def __init__(self, message: str = "Could not validate credentials", detail: Optional[Any] = None):
        super().__init__(message=message, status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


class ForbiddenException(AppException):
    """Permission denied (403)."""

    def __init__(self, message: str = "Not enough permissions to access this resource", detail: Optional[Any] = None):
        super().__init__(message=message, status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class BadRequestException(AppException):
    """Bad request syntax or invalid parameters (400)."""

    def __init__(self, message: str = "Bad request", detail: Optional[Any] = None):
        super().__init__(message=message, status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class ConflictException(AppException):
    """Resource conflict, e.g. duplicate key or booking conflict (409)."""

    def __init__(self, message: str = "Resource conflict detected", detail: Optional[Any] = None):
        super().__init__(message=message, status_code=status.HTTP_409_CONFLICT, detail=detail)


def register_exception_handlers(app: FastAPI) -> None:
    """Register custom exception handlers with FastAPI application."""

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
        content = {
            "success": False,
            "error": {
                "message": exc.message,
                "status_code": exc.status_code,
            }
        }
        if exc.detail is not None:
            content["error"]["detail"] = exc.detail
        return JSONResponse(status_code=exc.status_code, content=content)
