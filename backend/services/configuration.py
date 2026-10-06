"""Connect project discovery and existing Python config storage here later."""

from backend.models.schemas import Configuration, Project
from backend.services.common import NotConfiguredError


def get_projects() -> list[Project]:
    return []


def get_configuration(project_id: str) -> Configuration | None:
    return None


def save_configuration(project_id: str, value: Configuration) -> Configuration:
    # No persistence or credential echo until the existing config code is connected.
    raise NotConfiguredError("Configuration storage is not configured.")
