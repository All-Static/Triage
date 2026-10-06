"""Thin routes; integration logic belongs in services."""

from fastapi import APIRouter, Path, Query

from backend.models.schemas import (
    Configuration, Project, RunParameters, TriageRun, WorkbookAccess,
)
from backend.services import configuration, jenkins, triage

router = APIRouter()


@router.get("/projects", response_model=list[Project])
def get_projects():
    return configuration.get_projects()


@router.get("/projects/{project_id}/configuration", response_model=Configuration | None)
def get_configuration(project_id: str):
    return configuration.get_configuration(project_id)


@router.put("/projects/{project_id}/configuration", response_model=Configuration)
def save_configuration(project_id: str, value: Configuration):
    return configuration.save_configuration(project_id, value)


@router.get("/projects/{project_id}/jenkins/builds/{build_number}")
def get_build(
    project_id: str,
    build_number: int = Path(gt=0),
    environment: str = Query(min_length=1, pattern=r"\S"),
):
    return jenkins.get_build(project_id, build_number, environment)


@router.get("/projects/{project_id}/triage/latest", response_model=TriageRun | None)
def get_latest_run(project_id: str):
    return triage.get_latest_run(project_id)


@router.post("/projects/{project_id}/triage", response_model=TriageRun)
def start_triage(project_id: str, parameters: RunParameters):
    return triage.start_triage(project_id, parameters)


@router.get("/projects/{project_id}/triage/{run_id}", response_model=TriageRun)
def get_run(project_id: str, run_id: str):
    return triage.get_run(project_id, run_id)


@router.get("/projects/{project_id}/workbook", response_model=WorkbookAccess)
def get_workbook_access(project_id: str, run_id: str | None = None):
    return triage.get_workbook_access(project_id, run_id)
