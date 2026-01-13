# Seed Scripts Guide

## ⚠️ IMPORTANT: Run scripts from the correct directory!

**You must be in:** `D:\payloadsite\district-interiors`

**NOT in:** `D:\payloadsite` or `D:\payloadsite\district-interiors\district-interiors`

## Quick Fix Command:

```powershell
cd D:\payloadsite\district-interiors
```

## Key Seed Scripts to Run:

```powershell
# 1. Upload all media files (images, logos, etc.)
npx tsx src/scripts/seed-media.ts

# 2. Seed Styling Page defaults
npx tsx src/scripts/seed-styling-page-defaults.ts

# 3. Upload and link Flowers catalog preview image
npx tsx src/scripts/seed-flowers-catalog-image.ts

# 4. Seed other page defaults (if needed)
npx tsx src/scripts/seed-flowers-page-defaults.ts
npx tsx src/scripts/seed-hero.ts
npx tsx src/scripts/seed-client-logos.ts
# ... etc
```

## Verify You're in the Right Directory:

```powershell
# Check if you're in the right place:
Test-Path ".\src\scripts\seed-media.ts"
# Should return: True
```



