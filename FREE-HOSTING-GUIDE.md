# 🆓 100% Free Hosting Guide (No Credit Card!)

Since Firebase Hosting requires billing enabled (Blaze plan), here are **completely free alternatives** that don't need a credit card.

## ⚠️ UPDATE: Railway No Longer Free

Railway ended their free tier (now requires $5/month). Use **Render** instead - still 100% free!

## 🎯 Best Free Option: Static Frontend + Backend API

Your app can be split into:
- **Frontend (React)** → Hosted on free static hosting
- **Backend (Node.js API)** → Hosted on free backend service  
- **Database** → Free PostgreSQL

---

## 🚀 Option 1: Vercel + Render + Neon (RECOMMENDED)

### ✅ Why This Stack:

- **Vercel**: Free React hosting with CDN
- **Render**: Free Node.js backend (750 hours/month)
- **Neon**: Free PostgreSQL (3GB storage)
- **Total Cost**: $0/month
- **Setup Time**: 10 minutes
- **Credit Card**: NOT required for any service!

### 📋 Setup Steps:

#### 1. Deploy Backend to Render

```bash
# Visit render.com
# Sign up with GitHub (no credit card!)
# Click "New +" → "Web Service"
# Connect your GitHub repo
# Configure:
#   Name: steam-manifest-api
#   Root Directory: (leave blank)
#   Build Command: npm install
#   Start Command: node server/index.js
#   Select FREE plan
```

**Environment Variables on Render:**
```env
DATABASE_URL=postgresql://... (from Neon)
JWT_SECRET=your-secret-key
PORT=10000
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
```

#### 2. Deploy Database to Neon

```bash
# Visit neon.tech
# Create free account (no credit card)
# Create new project
# Copy connection string
# Add to Railway as DATABASE_URL
```

**Run migrations:**
```bash
# Render will run npm install automatically
# After first deploy, run migration via Render Shell:
# Dashboard → your service → Shell tab
npm run db:migrate
```

#### 3. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo on vercel.com
```

**Environment Variables on Vercel:**
```env
VITE_API_BASE_URL=https://your-app.onrender.com
```

### ✅ Done!

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.onrender.com`
- Database: Neon PostgreSQL

**Note:** Render free tier spins down after 15 min inactivity. First request takes ~30 seconds to wake up.

---

## 🚀 Option 2: Netlify + Render + Neon (Alternative Frontend)

### ✅ Why This Stack:

- **Netlify**: Free React hosting with forms & CDN
- **Render**: Free Node.js backend (750 hours/month)
- **Neon**: Free PostgreSQL
- **Total Cost**: $0/month

### 📋 Setup:

#### 1. Deploy Frontend to Netlify

```bash
# Visit netlify.com
# Drag and drop 'dist' folder
# Or connect GitHub repo

npm run build
# Upload dist/ folder
```

**netlify.toml** (already included):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. Deploy Backend to Render

```bash
# Visit render.com
# Connect GitHub repo
# Choose "Web Service"
# Build: npm install
# Start: node server/index.js
```

**Environment Variables on Render:**
```env
DATABASE_URL=postgresql://... (from Neon)
JWT_SECRET=your-secret-key
PORT=10000
NODE_ENV=production
```

#### 3. Database on Neon

Same as Option 1!

---

## 🚀 Option 3: GitHub Pages + Render + Neon

### ✅ Why This Stack:

- **GitHub Pages**: Free static hosting (built into GitHub!)
- **Render**: Free Node.js backend
- **Neon**: Free PostgreSQL
- **Total Cost**: $0/month
- **GitHub already have!**

### 📋 Setup:

#### 1. Enable GitHub Pages

```bash
# Build your app
npm run build

# Deploy to gh-pages branch
npm install -g gh-pages
gh-pages -d dist
```

**Or use GitHub Actions** (auto-deploy on push):

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install and Build
        run: |
          npm ci
          npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Your site**: `https://yourusername.github.io/SteamManifestManager`

#### 2. Backend + Database

Same as Option 1 (Render + Neon)!

---

## 🚀 Option 4: Cloudflare Pages (Alternative)

### ✅ Why Cloudflare:

- **Free** static hosting
- **Global CDN** (fastest in the world!)
- **Unlimited bandwidth**
- **Free SSL**

### 📋 Setup:

```bash
# Visit pages.cloudflare.com
# Connect GitHub repo
# Build command: npm run build
# Publish directory: dist
# Done!
```

---

## 📊 Free Tier Comparison (Updated 2025)

| Service | Frontend | Backend | Database | Credit Card? |
|---------|----------|---------|----------|-------------|
| **Vercel** | ✅ Free | ❌ | ❌ | ❌ No |
| **Netlify** | ✅ Free | ❌ | ❌ | ❌ No |
| **Render** | ✅ Free | ✅ Free (750h/mo) | ❌ | ❌ No |
| **Neon** | ❌ | ❌ | ✅ Free (3GB) | ❌ No |
| **GitHub Pages** | ✅ Free | ❌ | ❌ | ❌ No |
| **Cloudflare Pages** | ✅ Free | ❌ | ❌ | ❌ No |
| ~~**Railway**~~ | ❌ | ~~Free~~ **$5/mo** | ❌ | ✅ Yes |

---

## 🎯 Our Recommendation for FREE hosting:

### Best Combo (2025):
```
Vercel (Frontend) 
  → Render (Backend) 
  → Neon (Database)
```

**Why:**
- ✅ All have generous free tiers
- ✅ Easy setup (GitHub integration)
- ✅ Auto-deploy on git push
- ✅ Great performance
- ✅ **NO credit card required**
- ✅ Can handle hundreds of users
- ✅ 750 hours/month backend (good for 24/7 with sleep mode)

---

## 🔧 Quick Start (FREE Stack)

### 1. Deploy Database (Neon)

```bash
# Go to neon.tech
# Sign up (GitHub OAuth, no card needed)
# Create project: "steam-manifests"
# Copy DATABASE_URL
```

### 2. Deploy Backend (Render)

```bash
# Go to render.com
# Sign up (GitHub OAuth, no card needed)
# New + → Web Service
# Connect GitHub repo
# Build: npm install
# Start: node server/index.js
# Plan: FREE
# Add environment variables:
DATABASE_URL=<from-neon>
JWT_SECRET=<generate-random>
PORT=10000
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
```

### 3. Deploy Frontend (Vercel)

```bash
# Go to vercel.com
# Sign up (GitHub OAuth, no card needed)
# Import Git Repository
# Framework: Vite
# Add environment variable:
VITE_API_BASE_URL=https://your-app.onrender.com
# Deploy!
```

### 4. Done! 🎉

Your app is live at:
- `https://your-app.vercel.app`

**Total time: ~10 minutes**  
**Total cost: $0/month**  
**Credit card required: NO!**

---

## 🔐 Security Setup

After deployment, create your admin account:

### Option 1: Via PostgreSQL Console (Neon Dashboard)

```sql
-- Register account in your app first
-- Then run this in Neon SQL Editor:

UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Option 2: Via Render Shell

```bash
# In Render dashboard
# Open your service → Shell tab

node -e "
const pool = require('./server/db/config');
pool.query(
  'UPDATE users SET role = \$1 WHERE email = \$2',
  ['admin', 'your-email@example.com']
).then(() => console.log('Admin created!'));
"
```

---

## 💡 Tips for Free Tier

### Render (750 hours/month)
- Spins down after 15 min inactivity
- Wakes up on first request (~30 sec)
- Perfect for personal use
- 750 hours = 31 days of 24/7 uptime!

### Neon (3GB storage)
- Plenty for thousands of manifests
- Auto-pauses after inactivity
- Starts in <1 second

### Vercel (100GB bandwidth/month)
- More than enough
- Global CDN
- Instant deploy

---

## 📈 When to Upgrade

Stay free until you hit:
- 1000+ active users
- 100+ manifests
- High traffic (>1000 visits/day)

Then consider:
- Render Starter: $7/month (no spin-down)
- Vercel Pro: $20/month
- Or migrate to Firebase with billing enabled
- Or upgrade Neon for more storage

---

## 🆚 Firebase vs Free Stack

| Feature | Firebase | Free Stack |
|---------|----------|------------|
| **Setup** | Need billing | No card needed |
| **Cost** | $0 with Blaze | $0 truly free |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Limits** | Higher | Lower but sufficient |
| **Lock-in** | Vendor | Portable |

---

## ✅ Summary

**For 100% FREE hosting without credit card (2025):**

1. **Neon** - Free PostgreSQL database (3GB)
2. **Render** - Free Node.js backend API (750h/mo)  
3. **Vercel** - Free React frontend hosting (100GB bandwidth)

**Total setup time: 15 minutes**  
**Total cost: $0/month forever**  
**Credit card: NOT required**  
**Caveat: Backend sleeps after 15 min (wakes in ~30 sec)**

Perfect for personal use and small communities! 🎮

---

## 🔗 Links

- [Neon PostgreSQL](https://neon.tech) - Free PostgreSQL
- [Render](https://render.com) - Free backend hosting ⭐ **USE THIS**
- [Vercel](https://vercel.com) - Free frontend hosting
- [Netlify](https://netlify.com) - Alternative frontend
- [Cloudflare Pages](https://pages.cloudflare.com) - Alternative frontend
- ~~[Railway](https://railway.app)~~ - No longer free ($5/mo minimum)

All support GitHub OAuth signup - no email verification needed!
