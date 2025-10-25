# 🎮 Steam Manifest Manager

A full-stack web application for managing and sharing Steam game manifests with real-time updates. Built with React, DaisyUI, Node.js, Express, and PostgreSQL.

## ✨ Features

- 📤 **Upload Steam Manifests** - Store your game manifests in a central database
- 🔍 **Search & Filter** - Find manifests by game name or App ID
- 📊 **Statistics Dashboard** - View total manifests, unique games, and storage usage
- 🔄 **Real-time Updates** - WebSocket integration for instant manifest updates
- 🎨 **Multiple Themes** - Dark, Light, Synthwave, and Cyberpunk themes with DaisyUI
- 💾 **Download Manifests** - Export manifests back to `.acf` format
- 📝 **Metadata Support** - Add notes and uploader information
- 🗑️ **Manage Manifests** - Delete outdated or incorrect manifests

## 🚀 Quick Start

### Option 1: 100% Free Hosting (5 minutes) 🆓

**RECOMMENDED** - No credit card needed!

**Frontend on Vercel + Backend on Render**

See `DEPLOYMENT-GUIDE.md` for step-by-step instructions!

```bash
cat DEPLOYMENT-GUIDE.md
```

### Option 2: Firebase (requires billing) 🔥

**Only if you have billing-enabled Firebase**

```bash
# Firebase needs Blaze plan (credit card required)
cat FIREBASE-QUICKSTART.md
```

### Option 3: Local Development

**Prerequisites:**
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd SteamManifestManager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   
   Create a new PostgreSQL database:
   ```sql
   CREATE DATABASE steam_manifests;
   ```

4. **Configure environment variables**
   
   Copy `.env.example` to `.env` and update with your database credentials:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=steam_manifests
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=3001
   CLIENT_URL=http://localhost:5173
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API on `http://localhost:3001`
   - Frontend on `http://localhost:5173`
   - WebSocket server for real-time updates

## 📖 Usage

### Uploading Manifests

1. Click the **"Upload Manifest"** button in the navbar
2. Fill in the required information:
   - **App ID** - Steam Application ID (e.g., 730 for CS:GO)
   - **Game Name** - Full name of the game
   - **Manifest ID** - Unique manifest identifier
   - **Depot ID** (optional) - Steam depot identifier
   - **Your Name** (optional) - Uploader attribution
   - **Notes** (optional) - Additional information
3. Select your manifest file (`.acf`, `.txt`, or `.manifest`)
4. Click **"Upload"**

### Finding Manifests

- Use the search bar to filter by game name or App ID
- Browse the grid view of all manifests
- Click **"View Content"** to see the manifest file contents
- Click **"Download"** to export the manifest
- Click **"Delete"** to remove a manifest (requires confirmation)

### Connecting with Beehive Studio

You can connect to your PostgreSQL database using [Beehive Studio](https://beehive-studio.com/) or any other PostgreSQL client using the credentials from your `.env` file.

## 🏗️ Project Structure

```
SteamManifestManager/
├── server/                  # Backend code
│   ├── controllers/         # Request handlers
│   ├── routes/             # API routes
│   ├── db/                 # Database configuration and migrations
│   └── index.js            # Express server entry point
├── src/                    # Frontend code
│   ├── components/         # React components
│   ├── services/           # API and WebSocket services
│   ├── App.jsx            # Main React component
│   └── main.jsx           # React entry point
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **ws** - WebSocket library for real-time updates
- **Multer** - File upload handling

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **DaisyUI** - Component library
- **Tailwind CSS** - Styling

## 🔌 API Endpoints

- `GET /api/manifests` - Get all manifests (supports search, limit, offset)
- `GET /api/manifests/stats` - Get statistics
- `GET /api/manifests/:id` - Get single manifest by ID
- `POST /api/manifests/upload` - Upload new manifest
- `DELETE /api/manifests/:id` - Delete manifest

## 🎨 Themes

Switch between themes using the theme selector in the navbar:
- 🌙 Dark
- ☀️ Light
- 🌈 Synthwave
- 🤖 Cyberpunk

## 🔄 Real-time Updates

The application uses WebSocket to provide real-time updates when:
- New manifests are uploaded
- Manifests are deleted
- Manifests are updated

## 📝 Database Schema

```sql
CREATE TABLE manifests (
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
```

## 🚢 Production Deployment

Choose your deployment method:

### 🆓 Free Hosting (No Credit Card)
See `FREE-HOSTING-GUIDE.md` for:
- Vercel (Frontend)
- Railway (Backend)
- Neon (Database)

### 🔥 Firebase (Requires Billing)
See `FIREBASE-QUICKSTART.md` for:
- Firebase Hosting
- Firestore Database
- Firebase Auth

### 🖥️ Self-Hosted
1. Build the frontend:
   ```bash
   npm run build
   ```

2. Set `NODE_ENV=production` in your `.env`

3. Serve the `dist` folder with your backend

4. Use a process manager like PM2:
   ```bash
   pm2 start server/index.js --name steam-manifest-manager
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for any purpose.

## 💡 Future Enhancements

- 🔐 User authentication and authorization
- 📦 Batch upload support
- 🏷️ Tags and categories for manifests
- 📈 Advanced analytics and charts
- 🔔 Email notifications for new manifests
- 🌐 CDN integration for manifest files
- 🔒 Private/public manifest visibility
- 📱 Mobile-responsive improvements
- 🔗 Steam Workshop integration
- 📊 Manifest version tracking

---

Made with ❤️ for the Steam community

## 🎯 Getting Started Video

Coming soon! Watch this space for a video tutorial on:
- Setting up the database
- Uploading your first manifest
- Using Beehive Studio to manage data
- Advanced features and tips

## 💬 Community

- Share your manifests
- Report bugs and request features
- Contribute to the project
- Help others get started

## 🔒 Security

This application stores manifest files which may contain sensitive information. Always:
- Use strong database passwords
- Enable SSL for production deployments
- Review uploaded manifests before sharing publicly
- Keep your dependencies updated

For security issues, please create a private security advisory on GitHub.

## 📊 Performance

The application is optimized for:
- Fast manifest uploads (up to 10MB files)
- Quick searches across thousands of manifests
- Real-time updates with minimal latency
- Efficient database queries with indexes

## 🌟 Star History

If you find this project useful, please consider giving it a star on GitHub!
