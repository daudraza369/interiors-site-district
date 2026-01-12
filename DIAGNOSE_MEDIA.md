# Media Diagnosis Checklist

## Issue: Images not visible in admin or frontend

## Step 1: Check if files exist in `/app/media`

```bash
docker exec -it $(docker ps -q | head -1) sh -c "ls -la /app/media | head -20"
```

Expected: Should see files like `amazon-33.png`, `hero-interior-34.jpg`, etc.

## Step 2: Check if files are in standalone directory

```bash
docker exec -it $(docker ps -q | head -1) sh -c "ls -la /app/.next/standalone/media 2>&1 | head -20"
```

Expected: Should see same files as `/app/media`

## Step 3: Check Payload API response

```bash
docker exec -it $(docker ps -q | head -1) sh -c "curl -I http://localhost:3000/api/media/file/amazon-33.png 2>&1 | head -10"
```

Expected: Should return `200 OK` with image content-type

## Step 4: Check database entries

```bash
docker exec -it $(docker ps -q | head -1) sh -c "cd /app && npx tsx -e \"import('payload').then(async ({getPayload}) => { const p = await getPayload({config: (await import('@payload-config')).default}); const r = await p.find({collection: 'media', limit: 5}); console.log(JSON.stringify(r.docs.map(d => ({id: d.id, filename: d.filename, url: d.url})), null, 2)); })\""
```

Expected: Should show media entries with filenames and URLs

## Step 5: Check server logs for media sync

Look for:
- "📁 Syncing media files with Payload database..."
- "✅ Synced X files"
- Any errors during sync

## Common Issues:

1. **Files don't exist in `/app/media`**: Sync script not running or failing
2. **Files exist but 404 from API**: Payload can't find files at configured path
3. **Files exist but wrong path**: `staticDir` configuration issue
4. **Database entries exist but files missing**: Files deleted or not synced


