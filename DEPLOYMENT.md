# MAGNUS Production Deployment Guide

> **Complete step-by-step guide to deploy MAGNUS for 100+ concurrent users**

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Supabase Database Setup](#step-1-supabase-database-setup)
3. [Step 2: Upstash Redis Setup](#step-2-upstash-redis-setup)
4. [Step 3: Cloudflare R2 Media Storage](#step-3-cloudflare-r2-media-storage)
5. [Step 4: Deploy Strapi to Railway](#step-4-deploy-strapi-to-railway)
6. [Step 5: Deploy Frontend to Vercel](#step-5-deploy-frontend-to-vercel)
7. [Step 6: Run Load Tests](#step-6-run-load-tests)
8. [Post-Deployment Checklist](#post-deployment-checklist)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- [ ] GitHub repository with MAGNUS code pushed
- [ ] Credit card for Supabase Pro (recommended) or use free tier
- [ ] Cloudflare account (free) for R2 storage
- [ ] Railway account (free tier available)
- [ ] Vercel account (free tier available)

**Estimated Time**: 30-45 minutes

---

## Step 1: Supabase Database Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** → Sign in with GitHub
3. Click **"New project"**
4. Fill in:
   - **Organization**: Select or create one
   - **Name**: `magnus-production`
   - **Database Password**: Generate a strong password → **SAVE THIS!**
   - **Region**: Choose closest to your users (e.g., `US East` for Americas)
   - **Pricing Plan**: Free (60 connections) or Pro (100+ connections recommended)
5. Click **"Create new project"** → Wait 2-3 minutes for provisioning

### 1.2 Get the Pooler Connection URL

> ⚠️ **CRITICAL**: Use the POOLER URL, not the direct connection!

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **"Database"** in the left menu
3. Scroll to **"Connection Pooling"** section
4. Find **"Connection string"** under **Transaction mode**
5. Click the copy button → It looks like:
   ```
   postgres://postgres.xxxxxxxxxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
   
**Why Pooler?**
- Direct connection: Limited to 60 connections (free) / 100 (pro)
- Pooler (Transaction mode): Supports 200-500+ concurrent connections
- Long-lived servers like Strapi MUST use pooler

### 1.3 Run Database Indexes Migration

1. In Supabase, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Copy and paste the entire contents of this file:
   ```
   magnus-strapi/database/migrations/001_performance_indexes.sql
   ```
4. Click **"Run"** (or Cmd+Enter)
5. Verify: You should see "Success. No rows returned"

**Why indexes?**
- Prevents full table scans on common queries
- Critical for `articles?filters[slug]=...` lookups
- Speeds up scheduled publishing cron

### 1.4 Record Your Credentials

Create a secure note with:
```
SUPABASE_PROJECT: magnus-production
DATABASE_URL: postgres://postgres.xxx:YOUR_PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres
```

---

## Step 2: Upstash Redis Setup

### 2.1 Create Redis Database

1. Go to [upstash.com](https://upstash.com)
2. Sign in with GitHub
3. Click **"Create Database"**
4. Fill in:
   - **Name**: `magnus-redis`
   - **Type**: Regional
   - **Region**: Same as Supabase (e.g., `US-East-1`)
   - **TLS**: Enabled (default)
5. Click **"Create"**

### 2.2 Get Connection URL

1. On the database page, find **"REST URL"** section
2. Click **"Show"** next to the URL
3. Copy the **`UPSTASH_REDIS_REST_URL`** - looks like:
   ```
   https://divine-xxxx.upstash.io
   ```
4. Also copy the **`UPSTASH_REDIS_REST_TOKEN`**

**OR** use the **Redis URL** (ioredis format):
1. Click the **"CLI"** tab
2. Copy the connection string:
   ```
   rediss://default:xxxxxxxxxxxx@divine-xxxx.upstash.io:6379
   ```

### 2.3 Record Your Credentials

```
REDIS_URL: rediss://default:YOUR_TOKEN@divine-xxxx.upstash.io:6379
```

---

## Step 3: Cloudflare R2 Media Storage

> Optional but recommended for production. Offloads media from Strapi.

### 3.1 Create R2 Bucket

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign in or create account
3. Click **"R2 Object Storage"** in sidebar
4. Click **"Create bucket"**
5. Fill in:
   - **Bucket name**: `magnus-media`
   - **Location**: Automatic (or specific region)
6. Click **"Create bucket"**

### 3.2 Enable Public Access

1. Click on your bucket (`magnus-media`)
2. Go to **"Settings"** tab
3. Under **"Public access"**, click **"Allow Access"**
4. Copy the public URL: `https://pub-xxxxxxxxxxxx.r2.dev`

**OR** for custom domain:
1. Under **"Custom Domains"**, click **"Connect Domain"**
2. Enter `media.yourdomain.com`
3. Cloudflare will auto-configure DNS

### 3.3 Create API Token

1. Go back to R2 main page
2. Click **"Manage R2 API Tokens"**
3. Click **"Create API token"**
4. Fill in:
   - **Token name**: `magnus-strapi-upload`
   - **Permissions**: Object Read & Write
   - **Specify bucket**: `magnus-media`
5. Click **"Create API Token"**
6. **SAVE THESE VALUES** (shown only once):
   - Access Key ID
   - Secret Access Key

### 3.4 Get Account ID

1. Go to any domain in Cloudflare
2. Scroll down on the right sidebar
3. Find **"Account ID"** → Copy it

### 3.5 Record Your Credentials

```
CLOUDFLARE_ACCOUNT_ID: your-account-id
CLOUDFLARE_ACCESS_KEY_ID: your-access-key
CLOUDFLARE_SECRET_ACCESS_KEY: your-secret-key
CLOUDFLARE_R2_BUCKET: magnus-media
CLOUDFLARE_R2_PUBLIC_URL: https://pub-xxxxxxxxxxxx.r2.dev
```

---

## Step 4: Deploy Strapi to Railway

### 4.1 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your MAGNUS repository
6. Railway will detect it's a monorepo

### 4.2 Configure Strapi Service

1. Click **"Add a Service"** → **"GitHub Repo"**
2. Select the same repo
3. Click on the service to open settings
4. Go to **"Settings"** tab
5. Set **Root Directory**: `magnus-strapi`
6. Set **Build Command**: `npm run build`
7. Set **Start Command**: `npm run start`

### 4.3 Set Environment Variables

1. Go to **"Variables"** tab
2. Click **"Raw Editor"**
3. Paste these variables (replace placeholders):

```env
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Secrets - GENERATE NEW ONES!
# Use: openssl rand -base64 32
APP_KEYS=base64key1,base64key2,base64key3,base64key4
API_TOKEN_SALT=your-random-32-char-string
ADMIN_JWT_SECRET=your-random-32-char-string
TRANSFER_TOKEN_SALT=your-random-32-char-string
JWT_SECRET=your-random-32-char-string

# Database - YOUR SUPABASE POOLER URL
DATABASE_CLIENT=postgres
DATABASE_URL=postgres://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres
DATABASE_SSL=true
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis - YOUR UPSTASH URL
REDIS_URL=rediss://default:token@xxx.upstash.io:6379

# CORS - YOUR FRONTEND DOMAINS
CORS_ORIGINS=https://magnus.vercel.app,https://yourdomain.com

# Cloudflare R2 (if using)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_R2_BUCKET=magnus-media
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxx.r2.dev

# Optional
CLIENT_URL=https://magnus.vercel.app
```

### 4.4 Generate Secure Keys

Run this command locally to generate keys:

```bash
# Run 5 times, use each output for different keys
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4.5 Deploy

1. Click **"Deploy"** or push to your GitHub main branch
2. Wait for build (2-5 minutes)
3. Click **"Generate Domain"** to get your public URL
4. Copy your Railway URL: `https://magnus-strapi-production.up.railway.app`

### 4.6 Create Admin User

1. Visit `https://your-railway-url.up.railway.app/admin`
2. Create your admin account
3. Go to Settings → API Tokens if you need programmatic access

---

## Step 5: Deploy Frontend to Vercel

### 5.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose your MAGNUS repository
5. Vercel detects Vite automatically

### 5.2 Configure Build Settings

1. **Framework Preset**: Vite
2. **Root Directory**: `.` (root, not magnus-strapi)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### 5.3 Set Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_STRAPI_URL` | `https://your-railway-url.up.railway.app/api` |
| `VITE_USE_MOCK` | `false` |

### 5.4 Deploy

1. Click **"Deploy"**
2. Wait for build (1-3 minutes)
3. Your frontend is live at: `https://magnus-xxx.vercel.app`

### 5.5 Update CORS Origins

Go back to Railway and update `CORS_ORIGINS` to include your Vercel domain:
```
CORS_ORIGINS=https://magnus-xxx.vercel.app
```

---

## Step 6: Run Load Tests

### 6.1 Install k6

**Windows (Chocolatey):**
```powershell
choco install k6
```

**Mac (Homebrew):**
```bash
brew install k6
```

**Or download from**: [k6.io/docs/getting-started/installation](https://k6.io/docs/getting-started/installation/)

### 6.2 Run Test

```bash
cd "c:\Users\USER\Desktop\MAGNUS HO"

# Test against production
k6 run --env BASE_URL=https://your-railway-url.up.railway.app load-test.js
```

### 6.3 Interpret Results

**Passing criteria:**
- ✅ P95 response time < 900ms
- ✅ Error rate < 0.5%
- ✅ All checks pass > 95%

**Sample output:**
```
✓ http_req_duration..............: avg=245ms  p(95)=678ms
✓ http_req_failed................: 0.12%
✓ checks.........................: 99.8% ✓ 4990 ✗ 10
```

---

## Post-Deployment Checklist

### Verify Everything Works

- [ ] Frontend loads at Vercel URL
- [ ] Articles display from Strapi
- [ ] Health check passes: `curl https://your-strapi.railway.app/api/healthz`
- [ ] Admin panel accessible at `/admin`
- [ ] Media uploads work (if R2 configured)
- [ ] Auth flow works (login/register)

### Set Up Monitoring

1. **Sentry** (Error tracking):
   - Create project at [sentry.io](https://sentry.io)
   - Add `SENTRY_DSN` to Railway variables

2. **Railway Metrics** (Built-in):
   - Monitor CPU, Memory, Requests in Railway dashboard

3. **Supabase Metrics**:
   - Database → Monitoring → Connection count

### Security Hardening

- [ ] Enable 2FA on all admin accounts
- [ ] Review Strapi roles and permissions
- [ ] Set up WAF rules in Cloudflare (optional)
- [ ] Configure rate limiting thresholds

---

## Troubleshooting

### "Too many connections" Error

**Cause**: Using direct DB URL instead of pooler

**Fix**: Update `DATABASE_URL` to use pooler URL (port 6543, not 5432)

### "populate=* is not allowed" Error

**Cause**: Code using banned query pattern

**Fix**: Update API calls to use explicit field selection

### CORS Errors

**Cause**: Frontend domain not in CORS_ORIGINS

**Fix**: Add domain to `CORS_ORIGINS` in Railway variables

### Cron Jobs Not Running

**Cause**: Redis unavailable or multiple leaders

**Fix**: 
1. Check Redis connection in Railway logs
2. Verify `REDIS_URL` is correct
3. Check logs for `[Cron] Running as leader...`

### Slow Queries

**Cause**: Missing database indexes

**Fix**: Run the indexes migration SQL in Supabase SQL Editor

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Supabase pooler connection string |
| `REDIS_URL` | ✅ | Upstash Redis connection |
| `CORS_ORIGINS` | ✅ | Comma-separated frontend domains |
| `APP_KEYS` | ✅ | Strapi encryption keys (4 base64) |
| `JWT_SECRET` | ✅ | JWT signing secret |
| `ADMIN_JWT_SECRET` | ✅ | Admin panel JWT secret |
| `CLOUDFLARE_*` | ❌ | R2 storage (optional) |
| `SENTRY_DSN` | ❌ | Error tracking (optional) |

---

## Support

If you encounter issues:
1. Check Railway logs for errors
2. Check Supabase connection count
3. Verify all environment variables are set
4. Run health check endpoint

**Need help?** Open an issue on GitHub with:
- Error message
- Railway logs
- Steps to reproduce
