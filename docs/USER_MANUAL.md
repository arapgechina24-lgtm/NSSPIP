# NCTIRS & USALAMA User Manual

## Part 1: USALAMA App (Citizen Portal)

### 1. Reporting an Incident
**Goal:** Submit a distress signal or crime report with zero latency.
1. Navigate to the USALAMA reporting portal (`/usalama/report`).
2. Select the **Report Type** (e.g., Terrorism, Violent Crime, Riot/Protest).
3. Fill in the location details and description.
4. Click **Submit**. You will immediately receive a unique **Case Reference Number** (e.g., `USL-123456789`).

### 2. Tracking an Incident
1. Navigate to the Track page (`/usalama/track`).
2. Input your Case Reference Number.
3. Instantly view the status of your report (e.g., `Pending`, `Under Investigation`, `Resolved`).

### 3. Emergency 999
For immediate life-threatening situations, use the red **Emergency 999** button in the header.

---

## Part 2: NCTIRS Command Center (Analyst Portal)

### 1. Accessing the Platform
**Clearance Required:** National Security Level 5
1. Go to the main URL (`/`).
2. You will be presented with the **Command Center** hub.

### 2. Navigating the 5 Views
Use the top-right navigation grid to switch operational contexts:

*   **COMMAND CENTER (Main Hub)**: Your primary dashboard. View live system metrics, active cases, and the high-level CNI Heatmap.
*   **FUSION CENTER (Intel Feed)**: Deep dive into forensic ledgers, inter-agency communications, and raw surveillance feeds.
*   **THREAT MATRIX (Live Matrix)**: Focus exclusively on active threats mapped geospatially via Leaflet. Lists all unassigned critical incidents.
*   **ANALYTICS (AI Insights)**: View predictive models detailing the probability of future crime types across specific vectors.
*   **OPERATIONS (Response)**: Manage the "4 Winning Pillars" of the AI system and approve/override automated SOAR responses (Security Orchestration).

### 3. Handling an Emergency (Mock Riot Triage)
1. Monitor the **Key Metrics Bar**. If "THREAT LEVEL" hits CRITICAL, an incident has occurred.
2. Locate the incident on the **Threat Map**.
3. In the event of a catastrophic system threat, click the pulsating red **SIMULATE BREACH** button.
4. Review the generated NC4 Report and execute the "Emergency Air-Gap Protocol" to isolate the threat.
