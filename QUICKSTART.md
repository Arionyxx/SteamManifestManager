# 🚀 Quick Start Guide

## What are Steam Manifests?

Steam manifests are files that contain information about game versions, depots, and content. They're useful for:
- Preserving specific game versions
- Sharing game builds with others
- Troubleshooting game issues
- Game modding and development

## How to Dump Steam Manifests

### Using SteamCMD

1. Download and install [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD)

2. Run SteamCMD and login:
   ```bash
   steamcmd +login <username>
   ```

3. Download a specific manifest:
   ```bash
   download_depot <app_id> <depot_id> <manifest_id>
   ```

4. The manifest files will be in your `steamcmd/depots/` folder

### From Steam Client

1. Navigate to your Steam installation folder
2. Go to `steamapps/` directory
3. Look for `.acf` files (e.g., `appmanifest_730.acf`)
4. These are your manifest files!

Common locations:
- **Windows**: `C:\Program Files (x86)\Steam\steamapps\`
- **macOS**: `~/Library/Application Support/Steam/steamapps/`
- **Linux**: `~/.steam/steam/steamapps/`

## Setting Up the Database

### Option 1: Local PostgreSQL

1. **Install PostgreSQL**
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. **Start PostgreSQL**
   ```bash
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

3. **Create the database**
   ```bash
   psql -U postgres
   CREATE DATABASE steam_manifests;
   \q
   ```

### Option 2: Using Docker

```bash
docker run --name steam-postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=steam_manifests \
  -p 5432:5432 \
  -d postgres:15
```

### Option 3: Cloud PostgreSQL

Use services like:
- [Neon](https://neon.tech/) - Free tier available
- [Supabase](https://supabase.com/) - Free tier available
- [Railway](https://railway.app/) - Free tier available
- [ElephantSQL](https://www.elephantsql.com/) - Free tier available

## Connecting with Beehive Studio

1. Download [Beehive Studio](https://beehive-studio.com/)
2. Open Beehive Studio
3. Click "New Connection"
4. Enter your database credentials:
   - Host: `localhost` (or your cloud host)
   - Port: `5432`
   - Database: `steam_manifests`
   - Username: `postgres`
   - Password: (your password from .env)
5. Click "Connect"

Now you can browse, query, and manage your manifests directly!

## First Upload

1. Start the application: `npm run dev`
2. Open browser to `http://localhost:5173`
3. Click "Upload Manifest"
4. Find a game's App ID on [SteamDB](https://steamdb.info/)
5. Fill in the form and upload your `.acf` file
6. Watch it appear instantly in the grid!

## Example Manifest File

Here's what a typical Steam manifest looks like:

```
"AppState"
{
    "appid"        "730"
    "Universe"     "1"
    "name"         "Counter-Strike: Global Offensive"
    "StateFlags"   "4"
    "installdir"   "Counter-Strike Global Offensive"
    "LastUpdated"  "1699999999"
    "UpdateResult" "0"
    "SizeOnDisk"   "25000000000"
    "buildid"      "12345678"
    "LastOwner"    "76561198000000000"
    "BytesToDownload"  "24000000000"
    "BytesDownloaded"  "24000000000"
}
```

## Common App IDs

- Counter-Strike: Global Offensive - `730`
- Dota 2 - `570`
- Team Fortress 2 - `440`
- Left 4 Dead 2 - `550`
- Portal 2 - `620`
- Half-Life 2 - `220`

Find more on [SteamDB](https://steamdb.info/)!

## Troubleshooting

### Can't connect to database
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`
- Check firewall settings

### Port already in use
- Change `PORT` in `.env` to another port
- Check what's using the port: `lsof -i :3001`

### WebSocket not connecting
- Make sure backend is running on port 3001
- Check browser console for errors
- Verify CORS settings

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Open an issue on GitHub
- Check the [Steam Developer Wiki](https://developer.valvesoftware.com/wiki/Main_Page)

Happy manifest managing! 🎮
