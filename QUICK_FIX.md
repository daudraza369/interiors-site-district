# Quick Media Fix - Run This Now

## Option 1: Run Script Directly (No Redeploy Needed)

In Coolify Terminal, run:

```bash
cd /app
npx tsx src/scripts/fix-media-filenames.ts
```

This will:
- Query all media from Payload database
- Match with source files in `src/assets`
- Copy to `/app/media` with correct Payload-generated filenames

## Option 2: Wait for Redeploy

1. Go to Coolify → Your App → **Redeploy**
2. Wait for deployment to complete
3. Then run: `pnpm run fix:media-filenames`

## After Running Script

1. **Restart the app** in Coolify
2. **Verify files exist:**
   ```bash
   ls -la /app/media | head -20
   ```

You should see files like:
- `amazon-33.png`
- `linklaters-33.png`
- `pepsico-33.png`
- `simah-33.png`
- `hero-interior-34.jpg`
- etc.

## If Script File Doesn't Exist

The file might not be in the container yet. In that case:

1. **Redeploy in Coolify** to get the latest code
2. Then run the script

