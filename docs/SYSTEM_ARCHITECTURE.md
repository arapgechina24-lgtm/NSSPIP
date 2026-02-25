# System Architecture Design

The National Security and Smart Policing Intelligence Platform (NSSPIP) is designed for **High-Availability (HA)** and **Sovereign Intelligence Processing**.

## System Overview

```mermaid
graph TD
    subgraph "Public Domain (Edge)"
        M[Mobile Reporting App]
        S[Surveillance Feeds (RTSP/HTTP)]
        O[OSINT Scrapers (News/Social)]
    end

    subgraph "Sovereign Fusion Center (Backend)"
        API[API Gateway - Next.js]
        DB[(PostgreSQL/PostGIS)]
        ASH[Forensic Hashing - SHA256]
    end

    subgraph "AI Core (FastAPI Engine)"
        CV[Computer Vision - YOLOv8]
        PR[Predictive Risk - Random Forest]
        NLP[Sentiment Analysis - VADER]
    end

    subgraph "Command UI"
        D[Incident Dashboard]
        TM[Threat Heatmap]
        AM[Analytics Monitor]
    end

    M -->|Encrypted Report| API
    S -->|Video Stream| CV
    O -->|Raw Intel| NLP
    
    API --> ASH
    ASH -->|Immutable ID| DB
    
    API <-->|Feature Vector| PR
    CV -->|Detections| API
    NLP -->|Sentiment Score| API
    
    DB <--> API
    API -->|Real-time Socket| D
    API -->|Hydration| D
    API -->|Telemetry| TM
```

## Data Lifecycle

1. **Ingestion**: Raw telemetry and reports are ingested via TLS 1.3.
2. **Forensic Pinning**: Every record is hashed immediately to ensure chain-of-custody.
3. **AI Enrichment**: The AI Engine performs parallel inferences (Risk, CV, Sentiment).
4. **Fusion**: Data is stored in a PostGIS-enabled DB for tactical visualization.
5. **Visualization**: Reactive dashboard provides "Single Pane of Glass" for commanders.
