# 🚀 Deployment Guide - Free Hosting

This guide will help you deploy Steam Manifest Manager to free hosting services.

## 📋 Prerequisites

- GitHub account (for deployment)
- Email for service signups

## 🗄️ Database Setup (Free PostgreSQL)

### Option 1: Neon (Recommended)

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create a new project: **Steam Manifest Manager**
4. Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)
5. Save for later use

### Option 2: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create new project
4. Go to Project Settings > Database
5. Copy the connection string (Connection Pooling mode)
6. Save for later use

### Option 3: Railway Database

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. New Project > Provision PostgreSQL
4. Copy connection details
5. Save for later use

## 🖥️ Backend Deployment (Free API Hosting)

### Option 1: Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your Steam Manifest Manager repository
4. Add environment variables:
   ```
   DB_HOST=your-neon-host
   DB_PORT=5432
   DB_NAME=your-db-name
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ADMIN_SECRET=your-admin-registration-secret
   PORT=3001
   NODE_ENV=production
   ```
5. In Settings > Networking, generate a public domain
6. Copy the public URL (e.g., `https://your-app.railway.app`)
7. Deploy!

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. New > Web Service
4. Connect your repository
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Environment**: Node
6. Add environment variables (same as Railway)
7. Create Web Service
8. Copy the URL

## 🌐 Frontend Deployment (Free Static Hosting)

### Option 1: Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your Steam Manifest Manager repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
6. Deploy!
7. Copy the production URL

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Add new site > Import existing project
4. Select your repository
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
7. Deploy!

## 🔐 Security Setup

### 1. Generate Secrets

```bash
# Generate JWT Secret (use this in environment variables)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate Admin Secret (share this only with trusted admins)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Set Environment Variables

Make sure to set these in your hosting platform:

**Backend (Railway/Render):**
```env
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=steam_manifests
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-generated-jwt-secret
ADMIN_SECRET=your-generated-admin-secret
PORT=3001
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
```

**Frontend (Vercel/Netlify):**
```env
VITE_API_URL=https://your-backend-url.railway.app
```

### 3. Update CORS

After deployment, update `server/index.js` CORS settings:

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
```

## 👑 Creating Admin Account

### Method 1: First User
1. Visit your deployed site
2. Click "Register"
3. Enter username and password
4. Enter the ADMIN_SECRET you generated
5. Register - you'll be an admin!

### Method 2: Direct Database
If you need to make an existing user admin:

1. Connect to your database (Neon/Supabase dashboard)
2. Run SQL:
   ```sql
   UPDATE users SET role = 'admin' WHERE username = 'your-username';
   ```

## 🔄 Database Migration

After deploying backend:

1. Connect to your production database
2. Run migrations manually in database console:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Manifests table
CREATE TABLE IF NOT EXISTS manifests (
  id SERIAL PRIMARY KEY,
  app_id VARCHAR(50) NOT NULL,
  game_name VARCHAR(255) NOT NULL,
  depot_id VARCHAR(50),
  manifest_id VARCHAR(100) NOT NULL,
  file_content TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploader_name VARCHAR(100),
  notes TEXT,
  UNIQUE(app_id, depot_id, manifest_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_app_id ON manifests(app_id);
CREATE INDEX IF NOT EXISTS idx_game_name ON manifests(game_name);
CREATE INDEX IF NOT EXISTS idx_uploaded_at ON manifests(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_username ON users(username);
```

## 📝 Final Checklist

- [ ] Database created and connection string saved
- [ ] Backend deployed with environment variables
- [ ] Frontend deployed with API URL
- [ ] Database migrations run
- [ ] Admin account created
- [ ] Test upload functionality
- [ ] Test download functionality
- [ ] Test user registration
- [ ] Test authentication

## 🎯 Access URLs

After deployment, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.railway.app`
- **Database**: Managed by Neon/Supabase

Share the frontend URL with users!

## 🔒 Security Best Practices

1. **Never share your ADMIN_SECRET publicly**
2. **Use strong JWT_SECRET** (64+ characters)
3. **Enable 2FA** on hosting accounts
4. **Regularly update dependencies**: `npm audit fix`
5. **Monitor logs** for suspicious activity
6. **Backup database** regularly (most services do this automatically)

## 💰 Cost Breakdown

All free tiers:
- **Neon**: Free tier - 3GB storage
- **Railway**: Free tier - $5 credit/month
- **Vercel**: Free tier - Unlimited deployments
- **Total**: $0/month for small-medium usage

## 🆘 Troubleshooting

### CORS Errors
- Update `CLIENT_URL` in backend environment variables
- Check CORS settings in `server/index.js`

### Authentication Not Working
- Verify `JWT_SECRET` is set
- Check token is being sent in requests
- Clear browser localStorage and re-login

### Database Connection Failed
- Verify connection string format
- Check database is running (hosting dashboard)
- Ensure IP whitelist includes your backend host

### WebSocket Not Connecting
- WebSocket might not work on all free tiers
- Consider disabling real-time features for production
- Or upgrade to paid tier with WebSocket support

## 🔄 Updating Your Deployment

To deploy updates:

1. Push changes to GitHub: `git push origin main`
2. Vercel/Netlify will auto-deploy frontend
3. Railway/Render will auto-deploy backend
4. No downtime!

---

Made with ❤️ for secure manifest sharing!
