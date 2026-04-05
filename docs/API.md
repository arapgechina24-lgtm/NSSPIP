# System API Documentation

The backend consists of two integrated layers:

1. **Next.js Server API (`/api/nctirs/*`)**: Manages business logic, database mutations (via Prisma), and authentications.
2. **Python AI Engine (`/api/ai/*`)**: Written in FastAPI, these endpoints manage AI inferences.

## AI Engine Endpoints

### 1. Risk Scoring

* **Endpoint:** `POST /api/ai/predict/risk-score`
* **Description:** Calculates the likelihood of a high-risk event based on geospatial location.

**Request Body (`application/json`)**

```json
{
  "latitude": -1.282,
  "longitude": 36.821,
  "time_of_day": "night"
}
```

**Response (`200 OK`)**

```json
{
  "risk_score": 77,
  "risk_level": "HIGH",
  "contributing_factors": [
    "Geographic Anomaly: Target coordinates match high-density historical sector (Nairobi CBD).",
    "Temporal Risk: Elevated activity profile during curfew hours (+15% score bias).",
    "Model Inference: Random Forest ensemble identifies spatial proximity patterns."
  ]
}
```

### 2. Live Surveillance Analysis

* **Endpoint:** `POST /api/ai/analyze/surveillance`
* **Description:** Processes frames from CCTV feeds to identify weapons or abandoned bags.

**Request Body (`application/json`)**

```json
{
  "feed_id": "cctv_nrb_cbd_04",
  "image_url": "base64_encoded_or_url"
}
```

**Response (`200 OK`)**

```json
{
  "feed_id": "cctv_nrb_cbd_04",
  "timestamp": "2024-03-24T12:00:00.000000",
  "detected_objects": [
    {
      "label": "abandoned_bag",
      "confidence": 0.89,
      "bbox": [100, 200, 50, 50]
    }
  ],
  "alert_triggered": true
}
```

### 3. Intelligence Sentiment

* **Endpoint:** `POST /api/ai/analyze/sentiment`
* **Description:** Assesses the volatility or safety sentiment of unstructured intelligence reports using NLTK VADER.

**Request Body (`application/json`)**

```json
{
  "text": "The protest turned violent after an armed dispute near the CBD."
}
```

**Response (`200 OK`)**

```json
{
  "text_preview": "The protest turned violent after an armed dispute...",
  "sentiment": "NEGATIVE",
  "score": -0.52
}
```

### 4. Unified Volatility (Risk + CV + NLP)

* **Endpoint:** `POST /api/ai/volatility`
* **Description:** Combines geospatial risk, optional surveillance (CV), and optional NLP sentiment (or live news when enabled) into a single threat/volatility score (0–100) with XAI factors.

**Request Body (`application/json`)**

```json
{
  "latitude": -1.282,
  "longitude": 36.821,
  "time_of_day": "night",
  "image_url": "https://example.com/frame.jpg",
  "text_for_sentiment": "Crowds gathering in central district. Police deployed.",
  "use_live_news": false
}
```

All fields except `latitude` and `longitude` are optional. Set `use_live_news: true` only when `NCTIRS_ENABLE_NLP_EXTERNAL_NEWS` is enabled.

**Response (`200 OK`)**

```json
{
  "volatility_score": 72,
  "level": "HIGH",
  "risk_score": 65,
  "cv_contribution": 15,
  "nlp_contribution": -2.5,
  "contributing_factors": ["Geographic Anomaly: ...", "Computer Vision: Suspicious artifacts detected (backpack)."],
  "breakdown": {
    "risk_score": 65,
    "cv_contribution": 15,
    "nlp_contribution": -2.5,
    "sentiment_compound": -0.1,
    "live_news_compound": 0.0,
    "cv_alert_triggered": true,
    "cv_labels": ["backpack"]
  }
}
```

### AI Engine Configuration (Environment Variables)

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `NCTIRS_ENABLE_CV` | `true` | Set to `0` to disable YOLO load and CV inference (mock-only). |
| `NCTIRS_ENABLE_CV_EXTERNAL_DOWNLOAD` | `false` | Set to `1` to allow downloading images from URLs for surveillance. |
| `NCTIRS_ENABLE_NLP_EXTERNAL_NEWS` | `false` | Set to `1` to allow live RSS/news scrape in volatility and sentiment. |
