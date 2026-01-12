# Media Files Not Visible - Diagnosis

## Problem
Images are not visible in:
- Payload CMS Admin
- Frontend website

## Root Cause Analysis

### How Payload 3.0 Serves Media Files

1. **Storage Location**: Files are stored at `staticDir` path (`/app/media`)
2. **Database Records**: Payload stores file metadata in database with generated filenames (e.g., `hero-interior-34.jpg`)
3. **Serving**: Payload serves files through API route `/api/media/file/{filename}`
4. **Admin Display**: Admin panel requests files via `/api/media/file/{filename}`

### Why Images Aren't Visible

**Most Likely Causes:**

1. **Files Don't Exist at `/app/media`**
   - Files were uploaded but container restarted and files were lost (ephemeral filesystem)
   - Sync script failed to copy files from `src/assets` to `/app/media`
   - Files were never synced after initial seed

2. **Path Mismatch**
   - `staticDir` is configured as `/app/media`
   - But Payload is running from `.next/standalone` directory
   - Files need to be accessible from where Payload runs

3. **Permissions Issue**
   - Files exist but Node.js process can't read them
   - Wrong file permissions (need read access)

4. **API Route Not Working**
   - Payload's media serving route isn't configured correctly
   - Next.js standalone mode isn't routing media requests correctly

## Diagnosis Steps

Run these commands in the container to diagnose:

```bash
# 1. Check if media directory exists and has files
docker exec -it $(docker ps -q | head -1) sh -c "ls -la /app/media | head -20"

# 2. Check if files are in standalone directory
docker exec -it $(docker ps -q | head -1) sh -c "ls -la /app/.next/standalone/media 2>&1 | head -20"

# 3. Check API route response
docker exec -it $(docker ps -q | head -1) sh -c "curl -I http://localhost:3000/api/media/file/hero-interior-34.jpg 2>&1 | head -10"

# 4. Check database entries
docker exec -it $(docker ps -q | head -1) sh -c "cd /app && npx tsx -e \"
import('payload').then(async ({getPayload}) => {
  const config = await import('@payload-config')
  const p = await getPayload({config: config.default})
  const r = await p.find({collection: 'media', limit: 5})
  r.docs.forEach(d => {
    console.log(\`ID: \${d.id}, Filename: \${d.filename}, URL: \${d.url}\`)
  })
})
\""

# 5. Check server logs for errors
# Look for:
# - "Could not sync media files"
# - "ENOENT" errors (file not found)
# - Permission denied errors
```

## Expected Results

1. `/app/media` should contain files like:
   - `hero-interior-34.jpg`
   - `amazon-33.png`
   - etc.

2. API route should return:
   - `HTTP/1.1 200 OK`
   - `Content-Type: image/jpeg` (or appropriate type)
   - File content

3. Database should show:
   - Media entries with correct `filename` field
   - `url` field pointing to `/media/{filename}` or `/api/media/file/{filename}`

## Solutions

### Solution 1: Ensure Files Persist (Recommended)

**For Production (Coolify):**
1. Use a persistent volume for `/app/media`
2. OR use cloud storage (S3, Cloudinary, etc.)
3. OR copy files to a mounted volume

**For Development:**
- Files in `/app/media` persist between restarts if using a volume

### Solution 2: Fix Sync Script

The sync script in `server.js` should:
1. Run BEFORE Payload starts serving requests
2. Copy files from `src/assets` to `/app/media` with Payload-generated filenames
3. Handle file permissions correctly

**Current Issue:** Sync script spawns `tsx` which may not work correctly in Docker environment.

**Fix:** Use a simpler approach or ensure `tsx` is available in the container.

### Solution 3: Use Volume Mount (Coolify)

In Coolify, add a volume mount:
- **Host Path**: `/data/your-app/media`
- **Container Path**: `/app/media`

This ensures files persist between restarts.

## Quick Fix (Temporary)

Run this in the container to manually copy files:

```bash
# Copy all files from src/assets to /app/media
docker exec -it $(docker ps -q | head -1) sh -c "
cd /app && 
mkdir -p /app/media &&
cp -r src/assets/* /app/media/ 2>/dev/null || true &&
ls -la /app/media | head -20
"
```

**Note:** This only works for files with original names. Files with Payload-generated names (like `hero-interior-34.jpg`) need to be synced using the database query.

## Next Steps

1. Run diagnosis commands above
2. Identify which issue you have:
   - Files don't exist → Fix sync script or use volume
   - Files exist but API fails → Check permissions/path
   - API works but admin doesn't show → Check CORS/headers
3. Apply appropriate solution


