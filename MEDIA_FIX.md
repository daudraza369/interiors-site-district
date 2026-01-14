# Media Files Fix Guide

## Problem
Media files show as blank white icons in Payload admin because the actual image files are missing from the `/app/media` directory in the container.

## Solution

### Option 1: Re-upload Media Files (Recommended)

1. **Connect to Coolify Terminal**
   - Go to your app in Coolify
   - Click "Terminal" tab
   - Run: `ls -la /app/media`
   - This should show if the directory exists and is empty

2. **Re-run Media Seed Script**
   ```bash
   # First, ensure media directory exists
   mkdir -p /app/media
   
   # Copy media files from src/assets to /app/media
   # (You'll need to do this manually or via a script)
   
   # Then re-run the seed script
   pnpm run seed:media
   ```

### Option 2: Upload via Payload Admin

1. Go to Payload Admin → Media
2. Delete all existing media entries (they're broken)
3. Re-upload all images manually through the admin interface

### Option 3: Copy Media Files to Container

1. **In Coolify Terminal:**
   ```bash
   # Check if src/assets exists
   ls -la /app/src/assets
   
   # Copy files from src/assets to media
   cp -r /app/src/assets/* /app/media/ 2>/dev/null || echo "src/assets not found"
   ```

2. **Then re-seed:**
   ```bash
   pnpm run seed:media
   ```

## Why This Happened

- Media files are stored in `src/assets` locally
- They get uploaded to Payload which saves them to `/app/media`
- But the Docker build doesn't include the `media` directory (it's in `.gitignore`)
- The standalone build also doesn't copy media files

## Permanent Fix

The media directory should be a **persistent volume** in Coolify:

1. Go to Coolify → Your App → Configuration
2. Add a volume mount:
   - **Source**: `/app/media` (or a named volume)
   - **Destination**: `/app/media`
3. This ensures media files persist across deployments

## Quick Fix Script

Run this in Coolify terminal to check and fix:

```bash
# Check media directory
echo "Checking media directory..."
ls -la /app/media

# Check if src/assets has files
echo "Checking src/assets..."
ls -la /app/src/assets 2>/dev/null || echo "src/assets not found"

# Create media directory if missing
mkdir -p /app/media

# If src/assets exists, copy files
if [ -d "/app/src/assets" ]; then
  echo "Copying files from src/assets to media..."
  cp -r /app/src/assets/* /app/media/
  echo "Files copied!"
else
  echo "src/assets not found. You'll need to upload files manually."
fi
```




