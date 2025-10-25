# 🐳 Docker Setup Guide (EASIEST METHOD!)

## Step 1: Install Docker Desktop

Download and install Docker Desktop:
- **Windows**: https://www.docker.com/products/docker-desktop/
- **Mac**: https://www.docker.com/products/docker-desktop/
- **Linux**: https://docs.docker.com/engine/install/

## Step 2: Start Docker Desktop

Open Docker Desktop and make sure it's running (you'll see the whale icon)

## Step 3: Start PostgreSQL

Open your terminal in the project folder and run:

```bash
docker-compose up -d
```

That's it! This will:
- ✅ Download PostgreSQL image (first time only)
- ✅ Create a database called `steam_manifests`
- ✅ Start PostgreSQL on port 5432
- ✅ Set username as `postgres` with password `postgres`

## Step 4: Run Migrations

```bash
npm run db:migrate
```

## Step 5: Start the App

```bash
npm run dev
```

Open http://localhost:5173 and you're done! 🎉

---

## Useful Docker Commands

### Check if PostgreSQL is running:
```bash
docker-compose ps
```

### Stop PostgreSQL:
```bash
docker-compose down
```

### Restart PostgreSQL:
```bash
docker-compose restart
```

### View PostgreSQL logs:
```bash
docker-compose logs -f
```

### Remove everything (including data):
```bash
docker-compose down -v
```

---

## Connect with Beehive Studio

1. Open Beehive Studio
2. Click "New Connection"
3. Enter:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: `steam_manifests`
   - **Username**: `postgres`
   - **Password**: `postgres`
4. Click "Connect"

Done! 🐝

---

## Troubleshooting

### "docker-compose: command not found"
- Make sure Docker Desktop is installed and running
- Try: `docker compose up -d` (without the dash)

### "port 5432 is already in use"
- You already have PostgreSQL running locally
- Either use that instead OR stop it:
  - **Windows**: Services → PostgreSQL → Stop
  - **Mac**: `brew services stop postgresql`
  - **Linux**: `sudo systemctl stop postgresql`

### "Cannot connect to the Docker daemon"
- Start Docker Desktop application
- Wait for it to fully start (green icon)

---

## No Docker? Use Local PostgreSQL

If you don't want to use Docker, install PostgreSQL directly:

1. **Download PostgreSQL**: https://www.postgresql.org/download/
2. **Install it** (remember your password!)
3. **Open command prompt/terminal**
4. **Create database**:

**Windows (in Command Prompt or PowerShell):**
```cmd
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres
```
Then type:
```sql
CREATE DATABASE steam_manifests;
\q
```

**Mac/Linux (in Terminal):**
```bash
psql -U postgres
```
Then type:
```sql
CREATE DATABASE steam_manifests;
\q
```

5. **Update .env file** with your password
6. **Run migrations**: `npm run db:migrate`
7. **Start app**: `npm run dev`

---

## Super Quick Setup (Copy-Paste)

```bash
# 1. Install dependencies
npm install

# 2. Start database with Docker
docker-compose up -d

# 3. Wait 10 seconds for database to start
# (just wait a bit)

# 4. Run migrations
npm run db:migrate

# 5. Start the app
npm run dev
```

Open http://localhost:5173 and upload your first manifest! 🎮
