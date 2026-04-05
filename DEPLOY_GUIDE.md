# Deployment Guide

## 🚀 Deploy to Render

### Option A: One-Click Blueprint Deploy

1. Go to [render.com/deploy](https://render.com/deploy)
2. Paste your repo URL: `https://github.com/arapgechina24-lgtm/NCTIRS.git`
3. Render will auto-detect the `render.yaml` Blueprint and configure everything
4. Set your `DATABASE_URL` in the environment variables prompt
5. Click **Deploy**

### Option B: Manual Setup

1. **Log in to Render**: Go to [dashboard.render.com](https://dashboard.render.com)
2. **New Web Service**: Click **New +** → **Web Service**
3. **Connect Repository**:
    * Connect your GitHub account if not already connected
    * Select the `NCTIRS` repository
4. **Configure Service**:
    * **Name**: `nctirs`
    * **Region**: Choose closest to your users (e.g., `Frankfurt` for East Africa)
    * **Branch**: `main`
    * **Runtime**: `Docker`
    * **Dockerfile Path**: `./Dockerfile`
    * **Plan**: Select your preferred plan (Free tier available)
5. **Environment Variables**:
    * `DATABASE_URL` → Your PostgreSQL connection string
    * `AUTH_SECRET` → Generate with `openssl rand -base64 32`
    * `NEXTAUTH_URL` → `https://nctirs.onrender.com` (or your custom domain)
6. **Deploy**: Click **Create Web Service**

---

## Database Setup (Post-Deployment)

Once deployed, populate your cloud database:

```bash
# In your local terminal
export DATABASE_URL="<your-cloud-connection-string>"
npx prisma db push
npm run db:seed
```

---

## Custom Domain (Optional)

1. In your Render service → **Settings** → **Custom Domains**
2. Add your domain (e.g., `nctirs.ke`)
3. Configure DNS as instructed by Render
