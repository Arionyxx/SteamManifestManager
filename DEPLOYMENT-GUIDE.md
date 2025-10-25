# Deployment Guide - Split Frontend & Backend

This guide shows how to deploy the frontend on Vercel and backend on Render (free tier).

## Architecture

```
Frontend (Vercel)  --->  Backend (Render)  --->  Database (Neon)
   |                        |                        |
   |                        |                  PostgreSQL
   |                        |                        |
   +-- API calls --------> +-- DATABASE_URL --------+
       via VITE_API_URL
```

## Step 1: Create Database on Neon

1. Go to [neon.tech](https://neon.tech) and sign up (free)
2. Click **Create Project**
3. Choose a name (e.g., "steam-manifests")
4. Select region closest to you
5. Click **Create Project**
6. **Copy the connection string** (starts with `postgresql://`)
7. Keep this tab open - you'll need it for Step 2

### Run Database Migration

After creating the Neon database, you need to create the tables:

```bash
# Install PostgreSQL client if needed
npm install -g pg

# Run migration (replace with your Neon connection string)
DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname?sslmode=require" node server/db/migrate.js
```

Or manually run the SQL from `server/db/migrate.js` in the Neon SQL Editor.

## Step 2: Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign up (free)
2. Click **New +** > **Web Service**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Click **Create Web Service**
6. Wait for deployment to complete
7. **Copy your Render URL** (e.g., `https://steam-manifest-backend.onrender.com`)

### Backend Environment Variables on Render

Set these in Render Dashboard > Environment:

```
NODE_ENV=production
PORT=3001
JWT_SECRET=your-secure-secret-here
ADMIN_SECRET=your-admin-secret-here
DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require
```

⚠️ **Important:** 
- `DATABASE_URL` must be your Neon connection string from Step 1
- Generate secure secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Keep your secrets safe!

## Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click **New Project**
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration
5. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: Your Render URL from Step 1 (e.g., `https://steam-manifest-backend.onrender.com/api`)
6. Click **Deploy**

### Frontend Environment Variables on Vercel

```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

⚠️ **Important:** Include `/api` at the end of the URL!

## Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Try registering a new account
3. Try uploading a manifest
4. Check browser console for any errors

## Local Development

For local development, you don't need to set `VITE_API_URL`. It defaults to `/api` which works with the dev proxy.

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

## Troubleshooting

### "Unexpected token '<'" errors
- Your frontend is getting HTML instead of JSON
- Check that `VITE_API_URL` is set correctly in Vercel
- Verify your Render backend is running (check logs)

### 405 Method Not Allowed
- Check backend routes in `server/routes/`
- Verify CORS is configured correctly in `server/index.js`

### WebSocket connection issues
- WebSockets don't work in this split setup yet
- Real-time updates will be disabled
- Consider using polling or upgrading to a solution that supports WebSockets

## Cost

- **Neon Free Tier:** 3GB storage, 1 database
- **Render Free Tier:** Backend spins down after 15 min of inactivity (cold starts)
- **Vercel Free Tier:** Unlimited bandwidth for personal projects
- **Total:** $0/month 🎉

## Alternative: Docker Deployment

If you want both frontend + backend in one place, see `docker-compose.yml` for self-hosting options.
