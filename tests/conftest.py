import copy

import pytest
from fastapi.testclient import TestClient

import src.app as app_module


@pytest.fixture
def client():
    """Arrange: provide a TestClient for the ASGI app."""
    return TestClient(app_module.app)


@pytest.fixture(autouse=True)
def activities_snapshot():
    """Snapshot and restore the in-memory `activities` between tests.

    This ensures tests are isolated (AAA: Arrange / cleanup).
    """
    original = copy.deepcopy(app_module.activities)
    yield
    app_module.activities = original
