# 🚀 Quick Start with Authentication

## Local Testing Setup

### 1. Generate Secrets

```bash
node generate-secrets.js
```

This will generate:
- `JWT_SECRET` - for token signing
- `ADMIN_SECRET` - for creating admin accounts

### 2. Update Your .env File

Add these new variables to your `.env`:

```env
# ... your existing DB config ...

# Authentication
JWT_SECRET=your-generated-jwt-secret-here
ADMIN_SECRET=your-generated-admin-secret-here
```

### 3. Run Database Migration

```bash
npm run db:migrate
```

This will create the new `users` table.

### 4. Start the Application

```bash
npm run dev
```

### 5. Create Your Admin Account

1. Open `http://localhost:5173`
2. Click **Register** tab
3. Enter your desired username and password
4. **IMPORTANT**: Enter your `ADMIN_SECRET` in the "Admin Secret" field
5. Click Register
6. You're now logged in as admin! 👑

### 6. Test Admin Features

As an admin, you can:
- ✅ Upload manifests
- ✅ Delete manifests
- ✅ View all manifests

### 7. Create a Regular User (Optional)

1. Logout (click 🚪 Logout button)
2. Click Register tab
3. Enter username and password
4. **Leave Admin Secret blank**
5. Register - you're now a regular user

Regular users can:
- ✅ View all manifests
- ✅ Download manifests
- ❌ Cannot upload
- ❌ Cannot delete

## 🔒 Security Notes

### Your Admin Secret

- **Never share your ADMIN_SECRET publicly**
- Only give it to trusted administrators
- If compromised, generate a new one and update `.env`

### Token Management

- JWT tokens expire after 7 days
- Users will need to re-login after expiration
- Tokens stored in browser localStorage

### Password Security

- Passwords are hashed with bcryptjs
- Never stored in plain text
- Use strong passwords (8+ characters, mixed case, numbers, symbols)

## 🐛 Troubleshooting

### "Access token required" error
- You're not logged in - click Login
- Your token expired - logout and login again
- Clear browser localStorage and re-login

### "Admin access required" error
- You're logged in as a regular user
- Only admins can upload/delete
- Contact admin for ADMIN_SECRET to create admin account

### Can't register with ADMIN_SECRET
- Check ADMIN_SECRET matches exactly (copy-paste recommended)
- Check .env file has correct ADMIN_SECRET value
- Restart server after changing .env

### Database error on migration
- Make sure PostgreSQL is running
- Check database credentials in .env
- Try: `dropdb steam_manifests && createdb steam_manifests` and re-run migration

## 📱 Using on Network (Tailscale)

If you want friends to access:

1. They can **view and download** manifests without logging in (coming soon)
2. They need to **register** to get an account
3. Only **you** (admin) can upload/delete
4. Give ADMIN_SECRET only to co-administrators

---

🎉 You're all set! Enjoy secure manifest management!
