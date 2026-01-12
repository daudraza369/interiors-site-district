# Verify and Fix Media - Run These Commands

## Step 1: Verify Files Are in /app/media

```bash
ls -la /app/media | head -20
```

You should see files like `amazon-33.png`, `hero-interior-34.jpg`, etc.

## Step 2: Check if Payload Can See the Files

```bash
cd /app
npx tsx -e "
import { getPayload } from 'payload';
import config from '@payload-config';
(async () => {
  const payload = await getPayload({ config: config.default });
  const { docs } = await payload.find({ collection: 'media', limit: 5 });
  console.log('Sample media entries:');
  docs.forEach(m => {
    console.log(\`  - \${m.filename} (ID: \${m.id})\`);
  });
})();
"
```

## Step 3: Test Media API Directly

```bash
curl -I http://localhost:3000/api/media/file/amazon-33.png
```

Should return `200 OK`, not `404` or `500`.

## Step 4: If Files Are Missing, Copy Them Again

If files aren't in `/app/media`, run the fix script again:

```bash
cd /app && npx tsx fix-media-now.ts
```

## Step 5: Check Media Directory Path

Payload uses `staticDir: '/app/media'`. Verify this path exists:

```bash
ls -la /app/media/amazon-33.png
```

If this file exists, Payload should be able to serve it.

## Common Issues:

1. **Files not in `/app/media`**: Run fix script again
2. **Wrong path**: Payload expects `/app/media`, not `.next/standalone/media`
3. **Permissions**: Files might not be readable
4. **API route not working**: Check server logs for errors


