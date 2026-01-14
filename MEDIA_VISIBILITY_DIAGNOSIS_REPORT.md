# Media Visibility Issue - Comprehensive Diagnostic Report

**Date:** Generated on request  
**Issue:** Some images visible, some not visible on frontend  
**Status:** Root cause identified

---

## Executive Summary

The media visibility issue is caused by a **path resolution mismatch** between:
1. Where media files are stored: `/app/media`
2. Where the API route looks for files when running from `.next/standalone` directory

The API route's path resolution logic fails in the standalone build context because `process.cwd()` changes after `server.js` switches to the standalone directory.

---

## Root Cause Analysis

### 1. Media Collection Configuration

**File:** `src/collections/Media.ts`
```typescript
upload: {
  staticDir: path.resolve('/app', 'media'),  // Hardcoded absolute path
  staticURL: '/media',
}
```

**Issue:** Hardcoded to `/app/media` - assumes files are always at this location.

---

### 2. API Route Path Resolution

**File:** `src/app/api/media/file/[filename]/route.ts`

**Current Logic:**
```typescript
function getMediaDirectory(): string {
  const staticDir = Media.upload?.staticDir  // Returns '/app/media'
  
  if (staticDir) {
    if (path.isAbsolute(staticDir)) {
      return staticDir  // Returns '/app/media'
    }
    return path.resolve(process.cwd(), staticDir)
  }
  
  // Fallback paths...
}
```

**Problem:**
- When Next.js runs from `.next/standalone`, `process.cwd()` is `.next/standalone`
- The route checks `/app/media` first (from Media config)
- If `/app/media` doesn't exist or is empty, it falls back to relative paths
- But relative paths are resolved from `.next/standalone`, not `/app`

---

### 3. Server.js File Copying Logic

**File:** `server.js`

**What it does:**
1. **Line 24:** `appMediaDir = path.join(__dirname, 'media')` → `/app/media`
2. **Line 25:** `standaloneMediaDir = path.join(standaloneDir, 'media')` → `/app/.next/standalone/media`
3. **Line 252-284:** Copies files from `/app/media` to `/app/.next/standalone/media`
4. **Line 326:** `chdir(standaloneDir)` → Changes working directory to `.next/standalone`

**Issue:**
- Files are copied to BOTH locations
- But the API route only checks `/app/media` (from Media config)
- If `/app/media` is empty or missing files, the route fails
- The fallback logic doesn't account for the standalone directory structure

---

### 4. Dockerfile Media Handling

**File:** `Dockerfile`

**What it does:**
- Line 60: Copies `.next/standalone` to `/app`
- Line 63: Copies `.next/static` to `/app/.next/static`
- **Does NOT copy `/app/media` directory**

**Issue:**
- Media files need to be in the Docker image
- Currently, media files are synced at runtime by `server.js`
- But if the sync fails or is incomplete, files won't be available

---

### 5. Working Directory Context

**The Critical Issue:**

When `server.js` runs:
1. Starts in `/app` directory
2. Syncs media files to `/app/media`
3. Copies media files to `/app/.next/standalone/media`
4. **Changes directory to `/app/.next/standalone`** (line 326)
5. Spawns Next.js server from `.next/standalone`

When the API route runs:
- `process.cwd()` = `/app/.next/standalone` (not `/app`)
- Media config says: `/app/media`
- Route checks: `/app/media` (absolute path, should work)
- **BUT:** If `/app/media` doesn't exist or is empty, fallback paths are relative to `.next/standalone`

---

## Why Some Images Work and Some Don't

### Images That Work:
1. **Statically imported images** (e.g., hero images, logos)
   - These are bundled into `.next/static` during build
   - Served by Next.js static file handler
   - Not dependent on media API route

2. **Images in `/app/media` that match database filenames exactly**
   - If file exists at `/app/media/filename.jpg` AND database has `filename.jpg`
   - Route finds it immediately

### Images That Don't Work:
1. **Images with filename mismatches**
   - Database has: `olive-tree-34.jpg`
   - File on disk: `olive-tree.jpg` (or vice versa)
   - Route tries to match but fails

2. **Images where `/app/media` is empty or missing**
   - Media sync might have failed
   - Files only in `.next/standalone/media` but route doesn't check there

3. **Images where path resolution fails**
   - Route checks `/app/media` but file is elsewhere
   - Fallback paths don't include the right location

---

## Evidence from Logs

From your server logs:
```
✅ Copied 481 media files to standalone
```

This confirms:
- Files ARE being copied to `.next/standalone/media`
- But the API route might not be checking that location

---

## The Fix Strategy

### Option 1: Fix Path Resolution (Recommended)

Update `getMediaDirectory()` in the API route to:
1. Always check `/app/media` first (from Media config)
2. If not found, check `/app/.next/standalone/media` (where files are copied)
3. If still not found, check relative to `process.cwd()`

### Option 2: Fix Media Sync Location

Update `server.js` to:
1. Ensure files are ALWAYS in `/app/media` (not just `.next/standalone/media`)
2. Make sure `/app/media` persists across container restarts

### Option 3: Fix Dockerfile

Update `Dockerfile` to:
1. Copy media files into the image during build
2. Ensure `/app/media` exists in the final image

---

## Recommended Fix (Instant Solution)

**Update the API route's `getMediaDirectory()` function:**

```typescript
function getMediaDirectory(): string {
  // Priority 1: Use Media config staticDir (absolute path)
  const staticDir = Media.upload?.staticDir
  if (staticDir && path.isAbsolute(staticDir)) {
    // Check if it exists and has files
    if (fs.existsSync(staticDir)) {
      try {
        const files = fs.readdirSync(staticDir)
        if (files.length > 0) {
          return staticDir  // Use /app/media if it has files
        }
      } catch (e) {
        // Fall through to check other locations
      }
    }
  }
  
  // Priority 2: Check standalone media directory (where server.js copies files)
  const standaloneMediaDir = path.resolve('/app', '.next', 'standalone', 'media')
  if (fs.existsSync(standaloneMediaDir)) {
    try {
      const files = fs.readdirSync(standaloneMediaDir)
      if (files.length > 0) {
        return standaloneMediaDir
      }
    } catch (e) {
      // Fall through
    }
  }
  
  // Priority 3: Check /app/media (fallback)
  const appMediaDir = path.resolve('/app', 'media')
  if (fs.existsSync(appMediaDir)) {
    return appMediaDir
  }
  
  // Priority 4: Check relative to cwd
  const cwdMediaDir = path.resolve(process.cwd(), 'media')
  if (fs.existsSync(cwdMediaDir)) {
    return cwdMediaDir
  }
  
  // Default: return /app/media (will be created if needed)
  return path.resolve('/app', 'media')
}
```

---

## Testing Checklist

After implementing the fix:

1. ✅ Check server logs for `[Media API]` messages
2. ✅ Verify files exist in `/app/media`
3. ✅ Verify files exist in `/app/.next/standalone/media`
4. ✅ Test API route directly: `curl https://yourdomain.com/api/media/file/olive-tree.jpg`
5. ✅ Check browser console for 404 errors on image requests
6. ✅ Verify all images load on frontend

---

## Additional Notes

1. **Filename Mismatch Issue:**
   - The route already handles this with base name matching (lines 84-113)
   - But it only works if the file exists in the directory being checked

2. **Media Sync Timing:**
   - `server.js` syncs media BEFORE starting the server
   - But if sync fails silently, files won't be available
   - Consider adding retry logic or better error handling

3. **Docker Volume Persistence:**
   - If using Docker volumes, ensure `/app/media` is persisted
   - Otherwise, files are lost on container restart

---

## Conclusion

**Root Cause:** Path resolution mismatch - API route checks `/app/media` but files might be in `.next/standalone/media`, or `/app/media` might be empty.

**Solution:** Update `getMediaDirectory()` to check multiple locations in priority order, ensuring it finds files regardless of where they are.

**Priority:** HIGH - This affects all media visibility on the frontend.



