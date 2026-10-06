"""Adapter boundary for existing triage/ML code and workbook output."""

from backend.models.schemas import RunParameters, TriageRun, WorkbookAccess
from backend.services.common import NotConfiguredError


def get_latest_run(project_id: str) -> TriageRun | None:
    return None


def get_run(project_id: str, run_id: str) -> TriageRun:
    raise NotConfiguredError("Triage result storage is not configured.")


def start_triage(project_id: str, parameters: RunParameters) -> TriageRun:
    # Later call services.jenkins.get_build and import the existing Python workflow.
    # Return its real run status/output; do not generate simulated runs.
    raise NotConfiguredError("Triage/ML integration is not configured.")


def get_workbook_access(project_id: str, run_id: str | None) -> WorkbookAccess:
    return WorkbookAccess(message="No workbook is available. Triage output is not configured.")
