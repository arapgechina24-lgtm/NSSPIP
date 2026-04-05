# Render Deployment Checklist

This document details the critical environment variables that must be set in your Render service for the platform to function.

## Required Environment Variables

| Variable Name   | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL`  | Connection string to your PostgreSQL instance (e.g., Neon, Supabase, or Render Postgres). | `postgresql://user:password@host/db` |
| `AUTH_SECRET`   | A random 32-byte string used to encrypt session tokens. Generate with `openssl rand -base64 32`. | `your-secure-base64-secret` |
| `NEXTAUTH_URL`  | The canonical URL of your Render deployment. | `https://nctirs.onrender.com` |

## Optional Environment Variables

| Variable Name   | Description | Default |
| :--- | :--- | :--- |
| `DEPLOYMENT_PASSWORD` | Locks the deployment behind HTTP Basic Auth | (disabled) |
| `NEXT_PUBLIC_FCIR_API_URL` | FCIR citizen reporting API URL | `https://fcir-interface.vercel.app` |
| `GOOGLE_GENERATIVE_AI_KEY` | Google Gemini API key for AI features | (disabled) |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key for AI features | (disabled) |

### Setting Environment Variables in Render

1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Select your `nctirs` service.
3. Navigate to **Environment** tab.
4. Add the variables listed above.
5. Render will automatically redeploy when environment variables change.
