# AI-Powered National Security and Smart Policing Intelligence Platform (NSSPIP)
  
  **A Next-Generation Sovereign Fusion Center integrating Advanced Computer Vision, Predictive Risk Modeling, Forensic-Grade Audit Trails, and Explainable AI.**
  
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farapgechina24-lgtm%2FNSSPIP&env=DATABASE_URL&project-name=nsspip)
  
  ---
  
## 🏛️ Executive Summary
  
  The **National Security and Smart Policing Intelligence Platform (NSSPIP)** is a data-driven security architecture designed for the National Intelligence Service (NIS) to transition from reactive responses to proactive threat prevention. Built with a **Sovereign-First** philosophy, the platform fuses multi-domain telemetry into a "Single Pane of Glass" for high-command situational awareness.
  
## 🚀 Core Intelligence Capabilities
  
### 1. Forensic-Grade Audit Trails (Immutable Chain-of-Custody)

  Every incident report and intelligence asset is cryptographically pinned using **SHA-256 Hashing**. This ensures data integrity from the moment of ingestion to court-admissible evidence, visible on the dashboard via the **Forensic-ID** badge.
  
### 2. Explainable AI (XAI) Rationale

  NSSPIP eliminates the "Black-Box" problem in security AI. Every calculated **Risk Score** (0-100) is accompanied by discrete **Contributing Factors** (e.g., Geographic Anomalies, Temporal Biases, Model Inference Rationale), allowing commanders to justify kinetic escalations.
  
### 3. Predictive Risk Engine

  Utilizing specialized **Random Forest Ensembles**, the platform analyzes historical crime geometry and OSINT sentiment to forecast regional volatility.
  
### 4. Smart Surveillance (CV)

  Deploying **YOLOv8** neural networks for real-time object detection (abandoned bags, weapons) across multiple CCTV streams, triggering automated alerts to the Command Center.
  
## 💻 System Architecture & Design
  
### 🏗️ Foundation (Phase 1 Deliverables)

- **[Digital Sovereignty Architecture](file:///Users/mac/.gemini/antigravity/scratch/NSSPIP/docs/SYSTEM_ARCHITECTURE.md)**: Detailed data-flow from Edge reporting to Sovereign Fusion Core.
- **[Entity Relationship Diagram (ERD)](file:///Users/mac/.gemini/antigravity/scratch/NSSPIP/docs/ERD.md)**: Cryptographically optimized PostgreSQL schema.
- **[System API Spec](file:///Users/mac/.gemini/antigravity/scratch/NSSPIP/docs/API.md)**: Dual-stack (Next.js & Python FastAPI) interface documentation.
  
### 📊 Intelligence Datasets

- **OSINT Aggregation**: Aggregated historical crime patterns for Kenyan sectors.
- **Synthetic "Confidential" Feeds**: Generated dummy data mimicking NIS/Police reports for safe model training and evaluation.
  
## 🛠️ Stack & Infrastructure

- **Frontend**: Next.js 16 (React 19), Tailwind CSS, Shadcn UI.
- **AI Engine**: Python 3.9, FastAPI, Scikit-Learn, YOLOv8, NLTK.
- **Database**: PostgreSQL (Prisma ORM) with PostGIS capability.
- **Pipelines**: Unified GitHub Actions CI/CD for dual-stack testing and automated build verification.
  
## ⚙️ Getting Started (Local Operations)
  
  ```bash
  # 1. Clone & Install
  git clone https://github.com/arapgechina24-lgtm/NSSPIP.git
  npm install
  
  # 2. Python ML Environment
  python3 -m venv venv && source venv/bin/activate
  pip install -r requirements.txt && pip install -r requirements-local.txt
  
  # 3. Launch Fusion Center
  npm run dev
  ```
  
  ---
  
## 🛡️ Strategic Impact

  1. **Information Superiority**: Breaking intelligence silos via multi-domain fusion.
  2. **Digital Sovereignty**: Locally deployed, auditable AI models compliant with the Kenya Data Protection Act.
  3. **Forensic Integrity**: Immutable hashing for high-stakes evidence preservation.
  
  ---
  *“In national security, time is the only currency. NSSPIP buys time.”*
