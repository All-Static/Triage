"""API contracts matching src/types/index.ts; keep frontend field names."""

from typing import Literal

from pydantic import BaseModel, Field, SecretStr


class Project(BaseModel):
    id: str
    name: str


class JenkinsConfiguration(BaseModel):
    # Preserve URL templates such as {env} and {job_id} as plain strings.
    base_url: str
    username: str
    token: SecretStr


class Configuration(BaseModel):
    jenkins: JenkinsConfiguration


class RunParameters(BaseModel):
    environment: str = Field(min_length=1, pattern=r"\S")
    buildNumber: int = Field(gt=0, strict=True)


class TriageRun(BaseModel):
    id: str
    projectId: str
    buildNumber: int
    environment: str
    status: Literal[
        "Starting triage...", "Retrieving Jenkins data...", "Processing...",
        "Complete", "Failed",
    ]
    error: str | None = None
    outputWorkbookName: str | None = None
    outputLocation: str | None = None
    summary: str | None = None
    output: list[str] | None = None


class WorkbookAccess(BaseModel):
    workbookUrl: str | None = None
    downloadUrl: str | None = None
    message: str
