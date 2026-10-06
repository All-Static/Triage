"""Local API for the existing React frontend."""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import api
from backend.services.common import NotConfiguredError
from fastapi.responses import JSONResponse

app = FastAPI(title="Triage API")
origins = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin.strip()],
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(NotConfiguredError)
async def not_configured_handler(request, exc: NotConfiguredError):
    return JSONResponse(status_code=503, content={"detail": str(exc)})


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(api.router, prefix="/api")
