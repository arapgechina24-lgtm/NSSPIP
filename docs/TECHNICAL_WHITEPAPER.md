# NSSPIP Technical Whitepaper

## AI-Powered National Security & Smart Policing Intelligence Platform

## 1. Architecture Overview

NSSPIP operates on a microservices architecture designed for scalability and security.

### 1.1 Frontend (Dashboard)

- **Framework**: Next.js 14 (React) with TypeScript.
- **Styling**: Tailwind CSS + Shadcn UI.
- **State Management**: Server Actions + React Hook Form.

### 1.2 AI Engine (Backend)

- **Service**: Python FastAPI.
- **capabilities**:
  - **Predictive Modeling**: Random Forest / LSTM (Mocked for MVP) to calculate geo-spatial risk scores.
  - **Computer Vision**: Analysis of RTSP/HTTP video feeds for object detection (YOLOv8 logic).
  - **NLP**: Sentiment analysis of text reports.

### 1.3 Data Layer

- **Database**: PostgreSQL with PostGIS extension support.
- **ORM**: Prisma.
- **Security**: "Zero PII" policy. Columns like `encryptedDetails` store sensitive info as encrypted blobs (AES-256 simulation).

## 2. Security & Compliance

### 2.1 Kenya Data Protection Act (2019)

- **Data Minimization**: Only necessary metadata is exposed to analysts.
- **Encryption**: Data at rest is encrypted.
- **Audit Logs**: All officer actions (viewing intelligence, updating incidents) are logged ( Roadmap feature).

## 3. Advanced Intelligence Features

### 3.1 Intelligence Data Fusion (Phase 2)

NSSPIP transitions from synthetic modeling to **Evidence-Based Intelligence** by fusing high-fidelity open-source and proprietary datasets:

- **ACLED**: Political violence and protest telemetry (2022-2024).
- **UCDP**: Geocoded organized violence events.
- **KNBS**: Official crime statistics and urban hotspot density mapping.
- **Synthesized Sovereignty Data**: Mock confidential NIS/Police reports used for air-gapped simulation.

### 3.2 Forensic-Grade Audit Trails

NSSPIP implements a cryptographically secure chain-of-custody for all incident reports. Every submission is timestamped and hashed using **SHA-256**, creating an immutable "Forensic-ID". This ensures that evidence remains untampered from the moment of reporting to final adjudication.

### 3.3 Explainable AI (XAI)

To build trust with intelligence officers, NSSPIP avoids "Black-Box" AI. Every risk score is accompanied by specific **Contributing Factors** derived from spatial (Geographic Anomalies), temporal (Risk Bias Hours), and descriptive (NLP-based) telemetry.

### 3.4 Digital Sovereignty & Security

A core tenet of NSSPIP is **Sovereign Infrastructure**.

- **Local Deployment**: All AI models (YOLOv8, Random Forest) are executed on sovereign servers.
- **Data Air-Gapping**: No intelligence telemetry ever leaves the national security network.
- **Zero-PII Storage**: Sensitive identifiers are encrypted at the edge before archival.

## 4. Deployment

- **Containerization**: Docker support for all services.
- **CI/CD**: GitHub Actions pipeline for automated testing and semantic versioning.
