# Fix: Field Value Too Long Error

## Problem
Getting "Upload error: Field value too long" when uploading manifest files.

## Solution

### 1. Update Backend (Already Done in This PR)
The server now has increased limits:
- **File size**: 50MB per file
- **Field size**: 50MB for text fields (base64 images)
- **Max fields**: 20 non-file fields
- **Max parts**: 50 total parts (files + fields)

### 2. Run Database Migration (If Needed)

If you're still experiencing issues, run this command to ensure database fields can handle large data:

```bash
npm run db:fix-length
```

This will:
- Ensure `file_content` is TEXT (unlimited in PostgreSQL)
- Ensure `notes` is TEXT
- Ensure `game_image` is TEXT
- Show current largest file size

### 3. Restart Server

After applying the changes:
```bash
npm run server
```

## What Changed

### Multer Configuration
```javascript
limits: {
  fileSize: 50 * 1024 * 1024, // 50MB per file
  fieldSize: 50 * 1024 * 1024, // 50MB for text fields
  fields: 20, // Max non-file fields
  parts: 50 // Max total parts
}
```

### Error Messages
Now you get specific errors:
- `LIMIT_FILE_SIZE` → "File too large. Maximum size is 50MB per file."
- `LIMIT_FIELD_VALUE` → "Field value too large. Try uploading smaller images or fewer files."
- `LIMIT_PART_COUNT` → "Too many parts. Maximum is 50 files + fields combined."
- `LIMIT_FIELD_COUNT` → "Too many fields. Maximum is 20 non-file fields."

## Tips

1. **Large Images**: If you're uploading high-res game covers, the base64 encoding can make them very large. Consider:
   - Compressing images before upload
   - Using lower resolution for covers (1920x1080 is usually enough)
   - Current limit is 10MB for images (after base64 encoding ~13.3MB)

2. **Multiple Manifests**: You can upload up to 10 manifest files at once
   - Each file can be up to 50MB
   - Total upload size depends on your server memory

3. **Database**: PostgreSQL TEXT type has no practical limit
   - Can store up to 1GB per field
   - Performance may degrade with very large values

## Still Having Issues?

Check server logs for the exact error:
```bash
# In server console, you'll see:
Multer error: MulterError: Field value too long
  code: 'LIMIT_FIELD_VALUE'
```

This tells you exactly what limit was hit!
