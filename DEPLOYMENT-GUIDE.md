# Deployment Guide - Split Frontend & Backend

This guide shows how to deploy the frontend on Vercel and backend on Render (free tier).

## Architecture

```
Frontend (Vercel)  --->  Backend (Render)
   |                        |
   |                     Database
   |                        |
   +-- API calls via VITE_API_URL
```

## Step 1: Deploy Backend on Render

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
DATABASE_URL=your-database-url (optional, uses SQLite by default)
```

## Step 2: Deploy Frontend on Vercel

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

## Step 3: Test Your Deployment

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

- **Render Free Tier:** Backend spins down after 15 min of inactivity (cold starts)
- **Vercel Free Tier:** Unlimited bandwidth for personal projects
- **Total:** $0/month

## Alternative: Docker Deployment

If you want both frontend + backend in one place, see `docker-compose.yml` for self-hosting options.
