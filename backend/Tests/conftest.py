import pytest
from apiflask import APIFlask

from Routes import register_routes
from Services import get_instrument_transient


@pytest.fixture
def client():
    app = APIFlask(__name__)
    app.testing = True
    register_routes(app, get_instrument_transient())
    return app.test_client()
