# 🚀 START HERE - Super Simple Setup

## What You Need

1. **Node.js** - Download from https://nodejs.org/ (get the LTS version)
2. **Docker Desktop** - Download from https://www.docker.com/products/docker-desktop/

That's it! No need to install PostgreSQL manually.

---

## Setup (5 Minutes)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Start Database (Docker)
```bash
docker-compose up -d
```
Wait about 10 seconds for it to start up.

### 3️⃣ Setup Database Tables
```bash
npm run db:migrate
```

### 4️⃣ Start the App
```bash
npm run dev
```

### 5️⃣ Open in Browser
Go to: **http://localhost:5173**

---

## That's It! 🎉

You should see the Steam Manifest Manager interface.

Try uploading a manifest:
1. Click "📤 Upload Manifest" button
2. Fill in the form (example: App ID: `730`, Game Name: `CS:GO`)
3. Select a `.acf` file from your Steam folder
4. Click Upload!

---

## Where to Find Steam Depot Manifests?

Steam stores depot manifest files in:

- **Windows**: `C:\Program Files (x86)\Steam\depots\`
- **Mac**: `~/Library/Application Support/Steam/depots/`
- **Linux**: `~/.steam/steam/depots/`

Look for files like:
- `3716601_3930318588611247096.manifest`
- `730_1234567890123456789.manifest`

Format: `{depot_id}_{manifest_id}.manifest`

**Important:** You'll also need depot decryption keys to use these manifests with tools like DepotDownloader!

See [MANIFEST-INFO.md](MANIFEST-INFO.md) for detailed information.

---

## Connecting Beehive Studio

1. Open Beehive Studio
2. New Connection with these settings:
   - Host: `localhost`
   - Port: `5432`
   - Database: `steam_manifests`
   - User: `postgres`
   - Password: `postgres`

---

## Problems?

### Docker not working?
- Make sure Docker Desktop is running (check system tray/menu bar)
- See [DOCKER-SETUP.md](DOCKER-SETUP.md) for detailed help

### Port already in use?
```bash
# Stop existing PostgreSQL
docker-compose down

# Or if you have local PostgreSQL running:
# Windows: Stop PostgreSQL service
# Mac: brew services stop postgresql
# Linux: sudo systemctl stop postgresql
```

### Database won't connect?
Check your `.env` file - the password should be `postgres`

---

## Quick Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the app |
| `docker-compose up -d` | Start database |
| `docker-compose down` | Stop database |
| `npm run db:migrate` | Setup database tables |
| `docker-compose logs` | See database logs |

---

**Need more help?** Check out:
- [DOCKER-SETUP.md](DOCKER-SETUP.md) - Detailed Docker guide
- [README.md](README.md) - Full documentation
- [QUICKSTART.md](QUICKSTART.md) - More info about Steam manifests
