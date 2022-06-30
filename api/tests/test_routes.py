def test_get_uncertainties(test_client):
    """
    GIVEN a Flask application
    WHEN the '/uncertainties' page is requested (GET)
    THEN check the response is valid
    """
    response = test_client.get("/uncertainties")
    assert response.status_code == 200


def test_get_statistics(test_client):
    """
    GIVEN a Flask application
    WHEN the '/statistics' page is requested (GET)
    THEN check the response is valid
    """
    response = test_client.get("/statistics")
    assert response.status_code == 200


def test_post_labeledfiles(test_client, init_database):
    """
    GIVEN a Flask application
    WHEN the '/labeledfiles' page is posted to (POST)
    THEN check the response is valid
    """
    response = test_client.post(
        "/labeledfiles",
        json={
            "labels": [
                {"id": 1, "audioUrl": "test.mp3", "orca": True, "extraLabel": "K"}
            ],
            "expertiseLevel": "Beginner",
            "unlabeled": [],
        },
    )
    assert response.status_code == 201
    assert response.json["success"]
