import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from api.index import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "operational"

@pytest.mark.asyncio
async def test_predict_risk_score():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"latitude": -1.28, "longitude": 36.82, "time_of_day": "day"}
        response = await ac.post("/predict/risk-score", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "risk_level" in data
    assert isinstance(data["contributing_factors"], list)

@pytest.mark.asyncio
async def test_analyze_surveillance():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"feed_id": "test-feed", "image_url": "test-url"}
        response = await ac.post("/analyze/surveillance", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["feed_id"] == "test-feed"
    assert "detected_objects" in data
    assert "alert_triggered" in data
