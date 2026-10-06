"""Adapter boundary for existing Jenkins code. No network calls yet."""

from backend.services.common import NotConfiguredError


def get_build(project_id: str, build_number: int, environment: str) -> dict:
    # Later load project configuration and call the existing Jenkins implementation.
    raise NotConfiguredError("Jenkins integration is not configured.")
