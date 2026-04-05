# Cloud Environments & CI/CD Configuration

The NCTIRS platform is structured to be flexibly deployed either via Managed Cloud Services or Traditional IaaS configurations.

## 1. Managed Deployment Route (Render)

This is the recommended path for rapid prototyping and GitHub synchronization.

### Render Deployment Configuration

* **Next.js Frontend**: Hosted via Render's Docker-based Web Services using the standalone Next.js output.
* **Dockerfile**: Multi-stage build in the project root (`./Dockerfile`) handles dependency installation, Prisma generation, Next.js build, and production server.
* **Blueprint**: The `render.yaml` file provides Infrastructure-as-Code deployment — connect the repo and Render auto-configures the service.

### PostgreSQL Backend

* Uses an external PostgreSQL provider (e.g., Neon, Supabase, or Render Postgres).
* Connection string configured via the `DATABASE_URL` environment variable in the Render Dashboard.

---

## 2. Infrastructure as a Service (AWS & GCP Free Tier)

For deployments requiring explicit data residency controls.

### AWS Free Tier Architecture

* **Compute (Frontend/Backend)**: EC2 `t2.micro` instance running Docker.
* **Database**: Amazon RDS for PostgreSQL `db.t3.micro`.
* **Configuration**:
    1. Deploy project via Docker Compose mapping Next.js to Port 80 and a discrete Gunicorn/Uvicorn server for the AI container mapping to Port 8000.
    2. Adjust frontend `NEXT_PUBLIC_API_URL` to point to the standalone AI Docker Container running on `t2.micro`.

### GCP Free Tier Architecture

* **Compute**: e2-micro Google Compute Engine instance hosting the Next.js `npm run start` production bundle.
* **Database**: Cloud SQL (requires cost) or Host a local PostgreSQL container directly on the `e2-micro` instance.

## 3. GitHub CI/CD Pipeline

The NCTIRS CI/CD pipeline (`.github/workflows/ci.yml`) ensures clean environments.

1. **Dependency Generation**: `npm ci` is strictly handled, followed by `npx prisma generate` to construct the required Prisma Client binaries for the Ubuntu workflow container.
2. **Linting**: Tests are passed utilizing the custom rules established in `eslint.config.mjs` ensuring high compliance code structures.
3. **Deployments**: Direct pushes trigger CI checks. Render auto-deploys from `main` on successful push via GitHub integration.
