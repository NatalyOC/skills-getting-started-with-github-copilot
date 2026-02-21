def test_get_activities_returns_dict_and_known_activity(client):
    # Arrange: `client` fixture

    # Act
    resp = client.get("/activities")

    # Assert
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, dict)
    assert "Chess Club" in data


def test_signup_success_and_persistence(client):
    # Arrange
    activity = "Chess Club"
    email = "tester@example.com"

    # Act
    resp = client.post(f"/activities/{activity}/signup", params={"email": email})

    # Assert
    assert resp.status_code == 200
    participants = client.get("/activities").json()[activity]["participants"]
    assert email in participants


def test_signup_duplicate_returns_400(client):
    # Arrange
    activity = "Chess Club"
    email = "dup@example.com"

    # Act
    first = client.post(f"/activities/{activity}/signup", params={"email": email})
    second = client.post(f"/activities/{activity}/signup", params={"email": email})

    # Assert
    assert first.status_code == 200
    assert second.status_code == 400


def test_signup_unknown_activity_returns_404(client):
    # Arrange / Act
    resp = client.post("/activities/NoSuchActivity/signup", params={"email": "a@b.com"})

    # Assert
    assert resp.status_code == 404


def test_unregister_removes_participant(client):
    # Arrange
    activity = "Chess Club"
    email = "remove@example.com"
    signup = client.post(f"/activities/{activity}/signup", params={"email": email})
    assert signup.status_code == 200

    # Act
    resp = client.delete(f"/activities/{activity}/signup", params={"email": email})

    # Assert
    assert resp.status_code == 200
    participants = client.get("/activities").json()[activity]["participants"]
    assert email not in participants
