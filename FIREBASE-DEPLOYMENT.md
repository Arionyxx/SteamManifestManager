# 🔥 Firebase Deployment Guide

Perfect choice! Firebase provides everything in one platform and works great with the Pro plan.

## 🎯 Firebase Services We'll Use

- **Firebase Authentication** - User management (replaces our JWT system)
- **Cloud Firestore** - Database (NoSQL, faster than PostgreSQL for our use)
- **Firebase Storage** - File storage (better than storing in DB!)
- **Firebase Hosting** - Frontend hosting (CDN, SSL, custom domains)
- **Cloud Functions** (Optional) - Backend API if needed

## 📋 Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Name: **Steam Manifest Manager**
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Firebase Services

#### Authentication
1. Go to **Authentication** > Get Started
2. Enable **Email/Password** sign-in method
3. (Optional) Enable Google, GitHub sign-in

#### Firestore Database
1. Go to **Firestore Database** > Create database
2. Choose **Production mode** initially
3. Select region closest to users
4. Database created!

#### Storage
1. Go to **Storage** > Get Started
2. Use production mode rules initially
3. We'll update security rules later

#### Hosting
1. Go to **Hosting** > Get Started
2. Note the commands (we'll use them)

### 3. Install Firebase Tools

```bash
npm install -g firebase-tools
firebase login
```

### 4. Initialize Firebase in Your Project

```bash
cd SteamManifestManager
firebase init
```

Select:
- ✅ Firestore
- ✅ Storage
- ✅ Hosting
- ❌ Functions (optional, not needed for now)

Configure:
- **Firestore Rules**: Use default
- **Firestore Indexes**: Use default
- **Hosting public directory**: `dist`
- **Single-page app**: Yes
- **GitHub integration**: Optional

### 5. Update Firestore Security Rules

Replace content in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection - users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow read: if isAdmin(); // Admins can see all users
    }
    
    // Manifests collection
    match /manifests/{manifestId} {
      allow read: if request.auth != null; // All logged-in users can read
      allow create: if isAdmin(); // Only admins can create
      allow update: if isAdmin(); // Only admins can update
      allow delete: if isAdmin(); // Only admins can delete
    }
  }
}
```

### 6. Update Storage Security Rules

Replace content in `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Manifest files
    match /manifests/{manifestId}/{allPaths=**} {
      allow read: if request.auth != null; // All logged-in users can download
      allow write: if isAdmin(); // Only admins can upload
      allow delete: if isAdmin(); // Only admins can delete
    }
  }
}
```

### 7. Configure Firebase in Your App

Create `src/config/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 8. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps**
3. Click **Web app** (</>)
4. Register app: "Steam Manifest Manager Web"
5. Copy the `firebaseConfig` object

Create `.env.local`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Admin email (first registered user with this email becomes admin)
VITE_ADMIN_EMAIL=your-admin-email@example.com
```

### 9. Deploy Security Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### 10. Build and Deploy Frontend

```bash
npm run build
firebase deploy --only hosting
```

Your app is live! 🎉

URL: `https://your-project-id.web.app`

## 🔧 Database Structure (Firestore)

### Collections

#### `users/`
```javascript
{
  userId: {
    email: "user@example.com",
    username: "username",
    role: "admin" | "user",
    createdAt: timestamp
  }
}
```

#### `manifests/`
```javascript
{
  manifestId: {
    appId: "730",
    gameName: "Counter-Strike: Global Offensive",
    depotId: "731",
    manifestId: "1234567890",
    manifestFileUrl: "gs://bucket/manifests/xyz/file.manifest",
    luaFileUrl: "gs://bucket/manifests/xyz/file.lua",
    fileSize: 12345,
    uploadedAt: timestamp,
    uploadedBy: userId,
    uploaderName: "username",
    notes: "optional notes"
  }
}
```

### Storage Structure

```
manifests/
  ├── {manifestId}/
  │   ├── {depotId}_{manifestId}.manifest
  │   └── {gameName}.lua
```

## 👑 Making First Admin

### Method 1: Using Firebase Console

1. Go to **Authentication** > Users
2. Register your account in the app first
3. Find your user in the console
4. Copy the User UID
5. Go to **Firestore Database**
6. Create collection `users`
7. Add document with ID = your User UID:
   ```json
   {
     "email": "your@email.com",
     "username": "yourusername",
     "role": "admin",
     "createdAt": [current timestamp]
   }
   ```

### Method 2: Using Admin SDK (Recommended)

Create a one-time setup script `scripts/create-admin.js`:

```javascript
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = 'your-admin@email.com';

async function makeAdmin() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      username: user.email.split('@')[0],
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Admin created:', email);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

makeAdmin();
```

Get service account key:
1. Project Settings > Service Accounts
2. Generate new private key
3. Save as `scripts/serviceAccountKey.json`
4. Add to `.gitignore`!

Run once:
```bash
node scripts/create-admin.js
```

## 📱 Firebase Pro Plan Benefits

Your friend's Pro plan gives you:

- ✅ **More storage**: 50GB+ (vs 5GB free)
- ✅ **More bandwidth**: 360GB+ (vs 10GB free)
- ✅ **More functions**: 2M+ invocations (vs 125K free)
- ✅ **Support**: Priority support
- ✅ **Multiple admins**: No limit
- ✅ **Custom domain**: Free SSL included

Perfect for a serious manifest manager!

## 🚀 Deployment Commands

### Full Deploy
```bash
npm run build && firebase deploy
```

### Deploy Hosting Only
```bash
npm run build && firebase deploy --only hosting
```

### Deploy Rules Only
```bash
firebase deploy --only firestore:rules,storage:rules
```

### View Logs
```bash
firebase hosting:channel:deploy preview
```

## 🔄 CI/CD with GitHub Actions

Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase

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
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

## 🔒 Security Best Practices

1. **Never commit** `serviceAccountKey.json`
2. **Add to .gitignore**: `.env.local`, `serviceAccountKey.json`
3. **Use environment variables** for all Firebase config
4. **Enable App Check** for production (Firebase Console > App Check)
5. **Review security rules** regularly
6. **Enable multi-factor auth** for admin accounts
7. **Monitor usage** in Firebase Console

## 📊 Monitoring

Firebase Console provides:
- **Authentication**: User signups, logins
- **Firestore**: Read/write operations, data size
- **Storage**: File uploads, downloads, bandwidth
- **Hosting**: Page views, bandwidth
- **Performance**: Load times, crashes

## 💰 Cost Estimate (Pro Plan)

For a small community site:
- **Storage**: ~1-5GB manifest files
- **Bandwidth**: ~50-100GB/month
- **Firestore**: ~500K reads, 50K writes/month
- **Hosting**: Included with Pro

**Fits comfortably in Pro plan!**

## 🐛 Troubleshooting

### Permission Denied Errors
- Check Firestore rules are deployed
- Verify user is logged in
- Check user role in Firestore console

### Upload Fails
- Check Storage rules are deployed
- Verify file size < 100MB (adjust in Storage rules if needed)
- Check user has admin role

### Can't Login
- Verify Email/Password is enabled in Authentication
- Check `.env.local` has correct Firebase config
- Clear browser cache and try again

## 🎯 Next Steps

1. Initialize Firebase in your project
2. Update security rules
3. Configure Firebase in code
4. Make yourself admin
5. Deploy and test!

---

Firebase gives you:
- ✅ Better authentication (built-in)
- ✅ Real-time updates (Firestore)
- ✅ File storage (not in DB!)
- ✅ Global CDN (fast worldwide)
- ✅ All in one place
- ✅ Pro plan included!

Perfect choice! 🔥
