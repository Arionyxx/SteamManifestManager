# 🆓 100% Free Hosting Guide (No Credit Card!)

Since Firebase Hosting requires billing enabled (Blaze plan), here are **completely free alternatives** that don't need a credit card.

## 🎯 Best Free Option: Static Frontend + Backend API

Your app can be split into:
- **Frontend (React)** → Hosted on free static hosting
- **Backend (Node.js API)** → Hosted on free backend service  
- **Database** → Free PostgreSQL

---

## 🚀 Option 1: Vercel + Railway + Neon (RECOMMENDED)

### ✅ Why This Stack:

- **Vercel**: Free React hosting with CDN
- **Railway**: Free Node.js backend (500 hours/month)
- **Neon**: Free PostgreSQL (3GB storage)
- **Total Cost**: $0/month
- **Setup Time**: 10 minutes

### 📋 Setup Steps:

#### 1. Deploy Backend to Railway

```bash
# Already configured in railway.json!

# Visit railway.app
# Connect GitHub repo
# Deploy from 'server' directory
# Railway auto-detects Node.js
```

**Environment Variables on Railway:**
```env
DATABASE_URL=postgresql://... (from Neon)
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=production
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
# Railway will run this automatically
npm run migrate
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
VITE_API_BASE_URL=https://your-railway-app.railway.app
```

### ✅ Done!

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- Database: Neon PostgreSQL

---

## 🚀 Option 2: Netlify + Render + Neon

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

## 🚀 Option 3: GitHub Pages + Railway + Neon

### ✅ Why This Stack:

- **GitHub Pages**: Free static hosting (built into GitHub!)
- **Railway**: Free Node.js backend
- **Neon**: Free PostgreSQL
- **Total Cost**: $0/month
- **No signup needed** (you have GitHub already!)

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

Same as Option 1 (Railway + Neon)!

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

## 📊 Free Tier Comparison

| Service | Frontend | Backend | Database |
|---------|----------|---------|----------|
| **Vercel** | ✅ Free | ❌ | ❌ |
| **Netlify** | ✅ Free | ❌ | ❌ |
| **Railway** | ❌ | ✅ Free (500h/mo) | ❌ |
| **Render** | ✅ Free | ✅ Free (750h/mo) | ❌ |
| **Neon** | ❌ | ❌ | ✅ Free (3GB) |
| **GitHub Pages** | ✅ Free | ❌ | ❌ |
| **Cloudflare Pages** | ✅ Free | ❌ | ❌ |

---

## 🎯 Our Recommendation for FREE hosting:

### Best Combo:
```
Vercel (Frontend) 
  → Railway (Backend) 
  → Neon (Database)
```

**Why:**
- ✅ All have generous free tiers
- ✅ Easy setup (GitHub integration)
- ✅ Auto-deploy on git push
- ✅ Great performance
- ✅ No credit card required
- ✅ Can handle hundreds of users

---

## 🔧 Quick Start (FREE Stack)

### 1. Deploy Database (Neon)

```bash
# Go to neon.tech
# Sign up (GitHub OAuth, no card needed)
# Create project: "steam-manifests"
# Copy DATABASE_URL
```

### 2. Deploy Backend (Railway)

```bash
# Go to railway.app  
# Sign up (GitHub OAuth, no card needed)
# New Project → Deploy from GitHub
# Select your repo
# Add environment variables:
DATABASE_URL=<from-neon>
JWT_SECRET=<generate-random>
PORT=3000
NODE_ENV=production
```

### 3. Deploy Frontend (Vercel)

```bash
# Go to vercel.com
# Sign up (GitHub OAuth, no card needed)
# Import Git Repository
# Framework: Vite
# Add environment variable:
VITE_API_BASE_URL=https://your-app.railway.app
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

### Option 2: Via Railway Shell

```bash
# In Railway dashboard
# Open your service → Shell

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

### Railway (500 hours/month)
- Restart uses hours
- Sleeps after inactivity (good!)
- ~16 hours/day of uptime = perfect for personal use

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
- Railway Pro: $5/month
- Vercel Pro: $20/month
- Or migrate to Firebase with billing enabled

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

**For 100% FREE hosting without credit card:**

1. **Neon** - Free PostgreSQL database
2. **Railway** - Free Node.js backend API  
3. **Vercel** - Free React frontend hosting

**Total setup time: 10 minutes**  
**Total cost: $0/month forever**  
**Credit card: NOT required**  

Perfect for personal use and small communities! 🎮

---

## 🔗 Links

- [Neon PostgreSQL](https://neon.tech)
- [Railway](https://railway.app)
- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [Render](https://render.com)
- [Cloudflare Pages](https://pages.cloudflare.com)

All support GitHub OAuth signup - no email verification needed!
