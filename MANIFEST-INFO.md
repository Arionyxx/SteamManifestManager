# 🔐 Steam Depot Manifests Explained

## What Are Depot Manifests?

Steam stores encrypted manifest files in:
```
C:\Program Files (x86)\Steam\depots\
```

Format: `{depot_id}_{manifest_id}.manifest`

Example: `3716601_3930318588611247096.manifest`
- **Depot ID**: `3716601`
- **Manifest ID**: `3930318588611247096`

## What's Inside?

These files contain:
- File lists for the game
- Chunk information
- Download metadata
- Encrypted with depot keys

## How to Use This App

### 1. Find Your Manifests

Navigate to your Steam depots folder:
```
C:\Program Files (x86)\Steam\depots\
```

You'll see files like:
- `228980_1234567890123456789.manifest` (Steamworks Common Redistributables)
- `730_9876543210987654321.manifest` (CS:GO)
- etc.

### 2. Get Depot Keys

You need decryption keys for depots. You can get them from:
- **SteamDB**: https://steamdb.info/depot/{depot_id}/
- **DepotDownloader**: When downloading depots
- **Steam Console**: Using depot_decrypt commands

### 3. Upload to Manager

1. Click "Upload Manifest"
2. Fill in:
   - **App ID**: The game's App ID (e.g., `730` for CS:GO)
   - **Game Name**: Full game name
   - **Depot ID**: From the filename (e.g., `3716601`)
   - **Manifest ID**: The long number (e.g., `3930318588611247096`)
   - **Depot Key** (in notes): The decryption key if you have it
3. Upload the `.manifest` file

### 4. Share & Download

Others can:
- Download your manifest files
- Use them with DepotDownloader
- Restore specific game versions
- Archive old builds

## Example Workflow

### Dumping Manifests

Using **DepotDownloader**:
```bash
DepotDownloader -app 730 -depot 731 -manifest 3930318588611247096
```

This downloads the specific version and saves the manifest.

### Using Manifests

With manifest ID and depot key:
```bash
DepotDownloader -app 730 -depot 731 -manifest 3930318588611247096 -username YOUR_USERNAME
```

## What to Store

For each game manifest:
- ✅ App ID (e.g., `730`)
- ✅ Game name (e.g., "Counter-Strike: Global Offensive")
- ✅ Depot ID (e.g., `731`)
- ✅ Manifest ID (e.g., `3930318588611247096`)
- ✅ Depot decryption key (optional, in notes)
- ✅ The actual `.manifest` file
- ✅ Build info/version notes

## Common App IDs

- **730** - CS:GO
- **440** - Team Fortress 2
- **570** - Dota 2
- **252490** - Rust
- **304930** - Unturned
- **813780** - Age of Empires II: Definitive Edition

Find more on: https://steamdb.info/

## Security Note

⚠️ **Depot keys are sensitive!** Only share with trusted people.

The manifest files themselves are encrypted and useless without:
1. The depot decryption key
2. Steam account that owns the game
3. DepotDownloader or similar tool

## Tools You'll Need

- **DepotDownloader**: https://github.com/SteamRE/DepotDownloader
- **SteamDB**: https://steamdb.info/
- **SteamCMD**: https://developer.valvesoftware.com/wiki/SteamCMD

## This App's Purpose

🎯 Central repository for manifest files and metadata  
🎯 Track different game versions/builds  
🎯 Share manifests with community  
🎯 Preserve old game versions  
🎯 Easy manifest management with search  

---

**Ready to upload your first manifest?** Start the app with `npm run dev`!
