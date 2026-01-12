/**
 * Utility functions for constructing media URLs
 * ALWAYS returns relative URLs - never absolute URLs with hostname
 * This ensures URLs work identically in dev and production
 */

/**
 * Normalize a media URL to always be relative
 * Strips any hostname (localhost, domain, etc.) and returns /media/filename or /api/media/file/filename
 */
function normalizeMediaUrl(url: string): string {
  if (!url) return ''
  
  // Strip any absolute URL (http://, https://) and extract the path
  let path = url
  try {
    // If it's an absolute URL, extract just the pathname
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url)
      path = urlObj.pathname
    }
  } catch (e) {
    // If URL parsing fails, assume it's already a path
    path = url
  }
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  
  // If it's already /media/ or /api/media/file/, return as-is
  if (path.startsWith('/media/') || path.startsWith('/api/media/file/')) {
    return path
  }
  
  // If it's a path like /some/path/filename.jpg, extract just the filename
  const filename = path.split('/').pop() || path.replace(/^\//, '')
  if (filename) {
    // Prefer /media/ over /api/media/file/ for direct static serving
    return `/media/${filename}`
  }
  
  return path
}

/**
 * Construct a relative URL for a media file
 * ALWAYS returns relative URLs (no hostname) to work in both dev and production
 * 
 * Handles:
 * - Absolute URLs (http://localhost:3001/media/file.jpg) → /media/file.jpg
 * - Relative URLs (/media/file.jpg) → /media/file.jpg
 * - API URLs (/api/media/file/file.jpg) → /api/media/file/file.jpg
 * - Filenames (file.jpg) → /media/file.jpg
 */
export function getMediaUrl(mediaUrl: string | undefined | null): string {
  if (!mediaUrl) {
    return ''
  }
  
  // Normalize to relative URL (strips hostname if present)
  return normalizeMediaUrl(mediaUrl)
}

/**
 * Get Payload media API URL for a filename (relative)
 * Use this when you have a filename but not the full URL
 */
export function getMediaApiUrl(filename: string): string {
  // Remove leading slash if present
  const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename
  // Return relative URL
  return `/api/media/file/${cleanFilename}`
}

