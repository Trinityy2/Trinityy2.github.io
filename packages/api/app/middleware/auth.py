import jwt
import httpx
from fastapi import HTTPException, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from typing import List
import logging

logger = logging.getLogger(__name__)


class StrapiAuthMiddleware(BaseHTTPMiddleware):
    """Authentication middleware for validating Strapi JWT tokens."""

    def __init__(
        self,
        app,
        strapi_url: str,
        jwt_secret: str,
        excluded_paths: List[str] = None
    ):
        """Initialize the middleware.

        Args:
            app: FastAPI app instance
            strapi_url: Base URL of Strapi instance
            jwt_secret: Shared JWT secret between Strapi and FastAPI
            excluded_paths: List of paths to exclude from authentication
        """
        super().__init__(app)
        self.strapi_url = strapi_url.rstrip('/')
        self.jwt_secret = jwt_secret
        self.excluded_paths = excluded_paths or []

    async def dispatch(self, request: Request, call_next) -> Response:
        """Process the request and validate authentication."""

        # Skip authentication for excluded paths
        if any(request.url.path.startswith(path) for path in self.excluded_paths):
            return await call_next(request)

        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=401,
                detail="Missing or invalid authorization header"
            )

        token = auth_header.split(" ")[1]

        try:
            # Validate JWT token
            payload = jwt.decode(
                token,
                self.jwt_secret,
                algorithms=["HS256"]
            )

            # Extract user information
            user_id = payload.get("id")
            if user_id is None:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid token payload"
                )

            # Optional: Verify user still exists in Strapi
            if await self._should_verify_user():
                user_exists = await self._verify_user_exists(user_id, token)
                if not user_exists:
                    raise HTTPException(
                        status_code=401,
                        detail="User not found or disabled"
                    )

            # Add user info to request state
            request.state.user = {
                "id": user_id,
                "token": token,
                "payload": payload
            }

            logger.debug(
                f"Authenticated user {user_id} for {request.url.path}")

        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {e}")
            raise HTTPException(status_code=401, detail="Invalid token")
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            raise HTTPException(
                status_code=500,
                detail="Authentication service error"
            )

        response = await call_next(request)
        return response

    async def _should_verify_user(self) -> bool:
        """Determine if user verification against Strapi is needed."""
        # For performance, you might want to cache this or make it configurable
        return False  # Set to True to enable user verification

    async def _verify_user_exists(self, user_id: int, token: str) -> bool:
        """Verify user still exists and is active in Strapi."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.strapi_url}/api/users/{user_id}",
                    headers={"Authorization": f"Bearer {token}"}
                )

                if response.status_code == 200:
                    user_data = response.json()
                    # Check if user is not blocked
                    return not user_data.get("blocked", False)
                else:
                    logger.warning(
                        f"User verification failed: {response.status_code}")
                    return False

        except Exception as e:
            logger.error(f"Error verifying user {user_id}: {e}")
            return False
