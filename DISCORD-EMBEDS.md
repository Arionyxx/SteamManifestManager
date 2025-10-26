# 🎨 Discord Embeds Setup

Your website now has beautiful Discord embeds! When you share `manifestmew.lol` in Discord, it will show a rich preview.

## 📋 What's Included

### Meta Tags Added
- **Open Graph** tags (for Discord, Facebook, etc)
- **Twitter Card** tags
- **Theme color** for mobile browsers
- **SEO-friendly** descriptions

### Files Created
- `public/og-image.svg` - SVG embed image (ready to use!)
- `public/og-image.html` - Tool to generate PNG version
- `DISCORD-EMBEDS.md` - This guide!

## 🎭 How It Looks in Discord

When someone shares your link, Discord will show:
```
┌─────────────────────────────────────────┐
│  🐱                                      │
│  Manifest Mew :3 - Steam Manifest...    │
│  🐱 Store, manage, and share your...    │
│                                          │
│  [Large colorful preview image]         │
│  📤 Upload 📦 Store ⬇️ Download 🎮 Share  │
│                                          │
│  manifestmew.lol                        │
└─────────────────────────────────────────┘
```

## 🖼️ Image Options

### Current: SVG (Automatic)
✅ Already works!  
✅ Scales perfectly  
✅ No extra setup needed  

**Note:** Some platforms prefer PNG, so you might want to create one.

### Optional: PNG (Better compatibility)

**Method 1: Use the HTML Generator**
1. Open `public/og-image.html` in browser
2. Press F11 for fullscreen
3. Take screenshot (Win+Shift+S on Windows)
4. Crop to 1200x630 pixels
5. Save as `public/og-image.png`
6. Update `index.html` to use `.png` instead of `.svg`

**Method 2: Use Online Tool**
1. Visit [screenshotone.com](https://screenshotone.com) or similar
2. Upload the HTML file or screenshot the page
3. Export as 1200x630 PNG
4. Save to `public/og-image.png`

**Method 3: Use Figma/Photoshop**
1. Create 1200x630 canvas
2. Design your embed preview
3. Export as PNG
4. Save to `public/og-image.png`

## 🎨 Customization

### Change Colors
Edit `index.html` meta tags:
```html
<meta name="theme-color" content="#570DF8" /> <!-- Change this! -->
```

### Change Text
```html
<meta property="og:title" content="Your Title Here" />
<meta property="og:description" content="Your description..." />
```

### Change Image
Replace `/og-image.svg` with your own image URL:
```html
<meta property="og:image" content="https://your-url.com/image.png" />
```

## 🧪 Testing Your Embeds

### Discord
1. Share link in any Discord channel
2. Wait 2-3 seconds for preview
3. If no preview, Discord might have cached old version
4. Try in private/incognito mode

### Twitter/X
1. Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter your URL
3. See preview and fix any issues

### Facebook
1. Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your URL
3. Click "Scrape Again" to refresh cache

### General Testing
1. Use [OpenGraph.xyz](https://www.opengraph.xyz/)
2. Enter your URL
3. See how it looks on all platforms!

## 📊 What Discord Shows

**Title:** Manifest Mew :3 - Steam Manifest Manager  
**Description:** 🐱 Store, manage, and share your Steam game manifests! Upload, download, and organize manifest files for games and DLCs. Perfect for SteamTools users!  
**Image:** Purple gradient with cat emoji and features  
**Color:** Purple (#570DF8)  

## 🔧 Troubleshooting

### Embed Not Showing?
1. **Check file exists:** `public/og-image.svg` should be in your build
2. **Check URL:** Make sure it's `https://manifestmew.lol/og-image.svg`
3. **Clear cache:** Discord caches for 24h, try different link or server
4. **Wait:** Sometimes takes 5-10 seconds to load

### Wrong Image/Text?
1. **Clear Discord cache:** Close Discord completely and reopen
2. **Use private browser:** Incognito mode shows fresh version
3. **Wait 24h:** Discord caches embeds for a day
4. **Force refresh:** Add `?v=2` to end of URL (manifestmew.lol?v=2)

### Image Not Loading?
1. **Check permissions:** Make sure `public/` folder is served by your host
2. **Check MIME type:** SVG should be `image/svg+xml`
3. **Try PNG:** Some platforms prefer PNG over SVG
4. **Check size:** Must be under 8MB (yours is ~2KB!)

## 🚀 Deployment

When you deploy, make sure:
1. ✅ `index.html` is deployed
2. ✅ `public/og-image.svg` is accessible
3. ✅ HTTPS is enabled (required for embeds)
4. ✅ CORS headers allow embedding

Most hosting platforms (Vercel, Netlify, etc.) handle this automatically!

## 💡 Pro Tips

1. **Test first:** Always test embeds before sharing widely
2. **Update image:** Change filename to bust Discord cache (`og-image-v2.svg`)
3. **Mobile preview:** Check how it looks on mobile Discord too
4. **A/B test:** Try different images/descriptions to see what works
5. **Analytics:** Track which embeds get most clicks

## 🎯 Result

Now when you share `manifestmew.lol` anywhere, people see a beautiful, professional embed that makes them want to click! 

**Before:** Plain blue link  
**After:** Gorgeous purple card with cat and features! 🎨✨

Enjoy your cute embeds! 🐱💜
