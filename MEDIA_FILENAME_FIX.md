# Media Filename Fix Guide

## Problem
Payload CMS auto-generates filenames when files are uploaded (e.g., `amazon.png` → `amazon-33.png` to avoid conflicts). The database has entries with these auto-generated filenames, but the actual files on disk don't match.

## Solution
Run the `fix:media-filenames` script to sync files from `src/assets` to `/app/media` with the correct Payload-generated filenames.

## Steps

### 1. Run the Fix Script
In Coolify Terminal, run:
```bash
pnpm run fix:media-filenames
```

This script will:
- Query all media entries from Payload database
- Match them with source files in `src/assets`
- Copy files to `/app/media` with Payload-generated filenames

### 2. Restart the Application
After running the script, restart the app in Coolify to ensure the server copies files to the standalone directory.

### 3. Verify
Check that files exist:
```bash
ls -la /app/media | grep -E "(amazon|linklaters|pepsico|simah)"
```

You should see files like:
- `amazon-33.png`
- `linklaters-33.png`
- `pepsico-33.png`
- `simah-33.png`

## If Files Still Missing

If some files are still missing after running the script:

1. **Check the source files exist:**
   ```bash
   ls -la /app/src/assets/logos/
   ```

2. **Manually upload missing files through Payload Admin:**
   - Go to `/admin/collections/media`
   - Click "Create New"
   - Upload the file
   - Note the generated filename
   - Copy the file to `/app/media` with that exact filename

3. **Or re-run seed script (will create new entries):**
   ```bash
   pnpm run seed:media
   ```
   Then run the fix script again.

## About Hero Section

The Hero Section is currently hardcoded in the component and doesn't read from CMS. This is why you can't edit it from Payload. To make it editable:

1. Update `HeroSection` component to accept props from CMS
2. Pass `homePage.heroSection.slides` from the page component
3. Map the CMS data to the component's expected format

This requires code changes and is a separate task from the media fix.



