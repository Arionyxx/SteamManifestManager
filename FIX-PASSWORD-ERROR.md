# ❌ Fix: "client password must be a string" Error

## The Problem
Your `.env` file has an empty password field!

## The Fix (Copy-Paste This)

**Option 1: Delete and recreate .env file**

Delete your `.env` file and create a new one with this content:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=steam_manifests
DB_USER=postgres
DB_PASSWORD=postgres

PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

**Option 2: Quick Command (Windows - PowerShell)**

```powershell
@"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=steam_manifests
DB_USER=postgres
DB_PASSWORD=postgres

PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding utf8
```

Then run:
```bash
npm run db:migrate
```

---

**Option 3: Quick Command (Mac/Linux)**

```bash
cat > .env << 'ENVFILE'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=steam_manifests
DB_USER=postgres
DB_PASSWORD=postgres

PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ENVFILE
```

Then run:
```bash
npm run db:migrate
```

---

## Verify Docker is Running

Make sure Docker container is up:

```bash
docker-compose ps
```

You should see:
```
NAME                  STATUS
steam-manifest-db     Up X seconds
```

If not, start it:
```bash
docker-compose up -d
```

Wait 10 seconds, then:
```bash
npm run db:migrate
```

---

## Full Reset (if nothing works)

```bash
# Stop everything
docker-compose down -v

# Recreate .env file (see above)

# Start fresh
docker-compose up -d

# Wait 15 seconds
timeout /t 15  # Windows
# OR
sleep 15       # Mac/Linux

# Run migration
npm run db:migrate

# Start app
npm run dev
```

---

## Still Getting Errors?

The Docker container uses:
- **Username**: `postgres`
- **Password**: `postgres` (NOT empty!)

Your `.env` file MUST have `DB_PASSWORD=postgres` (not blank!)
