# TL;DR - Just Get It Running! 🚀

## Copy-Paste This:

```bash
npm install
docker-compose up -d
npm run db:migrate
npm run dev
```

Open: **http://localhost:5173**

Done! 🎉

---

## Don't Have Docker?

1. Install Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Run the commands above

---

## Still Having Issues?

### Error: "docker-compose: command not found"
- Install Docker Desktop and make sure it's running

### Error: "port 5432 already in use"
```bash
docker-compose down
```
Then try again

### Error: "Cannot connect to database"
Wait 15 seconds after `docker-compose up -d`, then run:
```bash
npm run db:migrate
```

---

## What Just Happened?

1. ✅ Installed Node.js packages
2. ✅ Started PostgreSQL in Docker
3. ✅ Created database tables
4. ✅ Started the web app

Now you can upload Steam manifests! Find them here:
- **Windows**: `C:\Program Files (x86)\Steam\steamapps\appmanifest_*.acf`
- **Mac**: `~/Library/Application Support/Steam/steamapps/appmanifest_*.acf`
- **Linux**: `~/.steam/steam/steamapps/appmanifest_*.acf`

---

**Still confused?** Read [START-HERE.md](START-HERE.md) for step-by-step instructions with pictures!
