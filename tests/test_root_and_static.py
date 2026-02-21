def test_root_redirect(client):
    # Arrange: `client` fixture from conftest

    # Act
    resp = client.get("/", follow_redirects=False)

    # Assert
    assert resp.status_code == 307
    assert resp.headers["location"] == "/static/index.html"


def test_static_index_contains_school_name(client):
    # Arrange: `client` fixture

    # Act
    resp = client.get("/static/index.html")

    # Assert
    assert resp.status_code == 200
    assert "Mergington High School" in resp.text
