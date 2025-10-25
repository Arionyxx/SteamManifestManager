# 🔥 Firebase Quick Start

## ⚡ Super Fast Setup (5 minutes)

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 2. Create Firebase Project

1. Go to https://console.firebase.google.com
2. Add Project → "Steam Manifest Manager"
3. Disable Google Analytics (optional)
4. Create Project

### 3. Initialize Firebase

```bash
cd SteamManifestManager
firebase use --add
# Select your project
# Enter alias: default
```

Update `.firebaserc` with your project ID.

### 4. Enable Firebase Services

In Firebase Console:

**Authentication:**
- Click "Get Started"
- Enable "Email/Password"

**Firestore:**
- Click "Create Database"
- Start in Production mode
- Choose region (us-central1 recommended)

**Storage:**
- Click "Get Started"
- Start in Production mode

### 5. Deploy Security Rules

```bash
firebase deploy --only firestore:rules,storage:rules
```

### 6. Get Firebase Config

1. Project Settings (⚙️) → Your apps
2. Click Web (</>)
3. Register app: "Steam Manifest Manager"
4. Copy config values

Create `.env.local`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
```

### 7. Build and Deploy

```bash
npm run build
firebase deploy --only hosting
```

### 8. Make Yourself Admin

**Option A: Firebase Console**
1. Register account in your deployed app
2. Go to Firestore in Firebase Console
3. Create `users` collection
4. Add document with your User UID:
   ```json
   {
     "email": "your@email.com",
     "username": "yourusername",
     "role": "admin",
     "createdAt": [timestamp]
   }
   ```

**Option B: Using Script**
See FIREBASE-DEPLOYMENT.md for admin SDK script

### 9. Done! 🎉

Your app is live at: `https://your-project-id.web.app`

---

## 🔄 Quick Commands

**Deploy everything:**
```bash
npm run build && firebase deploy
```

**Deploy hosting only:**
```bash
npm run build && firebase deploy --only hosting
```

**Deploy rules only:**
```bash
firebase deploy --only firestore:rules,storage:rules
```

**View logs:**
```bash
firebase hosting:channel:list
```

**Preview before deploy:**
```bash
npm run build
firebase hosting:channel:deploy preview
```

---

## 🎯 Firebase vs PostgreSQL Comparison

### Why Firebase is Better Here:

✅ **No server management** - fully managed
✅ **Global CDN** - fast worldwide
✅ **Real-time updates** - built-in
✅ **File storage** - separate from database
✅ **Authentication** - built-in, secure
✅ **One platform** - everything in one place
✅ **Pro plan** - your friend has it!
✅ **Auto-scaling** - handles traffic spikes
✅ **SSL included** - free custom domains

### Firebase Pro Benefits:

- 50GB Storage (vs 5GB free)
- 360GB Bandwidth/month (vs 10GB free)
- Priority support
- 99.95% uptime SLA
- Advanced security features
- Custom domain SSL

---

## 💾 Database Structure

### Firestore Collections:

**users** (document ID = user UID)
```javascript
{
  email: "user@example.com",
  username: "username",
  role: "admin" | "user",
  createdAt: timestamp
}
```

**manifests** (auto-generated document ID)
```javascript
{
  appId: "730",
  gameName: "Counter-Strike",
  depotId: "731",
  manifestId: "123456",
  manifestFileUrl: "manifests/abc123/file.manifest",
  luaFileUrl: "manifests/abc123/file.lua",
  fileSize: 12345,
  uploadedAt: timestamp,
  uploadedBy: "user-uid",
  uploaderName: "username",
  notes: "optional"
}
```

### Firebase Storage:

```
manifests/
  ├── abc123-def456/
  │   ├── 731_123456.manifest
  │   └── CounterStrike.lua
  ├── xyz789-uvw012/
  │   ├── 441_789012.manifest
  │   └── TeamFortress2.lua
```

---

## 🔒 Security

Firebase security is **better than our JWT system**:

✅ Built-in authentication tokens
✅ Server-side rule validation
✅ Can't bypass from client
✅ Role-based access in rules
✅ File-level permissions
✅ Audit logging (Pro plan)

---

## 📱 Using Firebase

Your current code can stay mostly the same, but you'll use:
- Firebase Auth instead of JWT
- Firestore instead of PostgreSQL
- Firebase Storage instead of base64 in DB

Benefits:
- Simpler code
- Better performance
- Real-time sync
- Offline support
- Better scalability

---

## 🚀 Next Steps

After deployment:
1. Share URL with friends
2. They can register accounts
3. You (admin) manage manifests
4. Everyone can download
5. Zero maintenance!

---

**Total setup time: 5-10 minutes**
**Total cost with Pro plan: Already included!**
**Maintenance required: None!**

Perfect for your use case! 🔥
