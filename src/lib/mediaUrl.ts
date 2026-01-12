/**
 * Utility functions for constructing media URLs
 * Handles both development and production environments
 */

/**
 * Get the base server URL for media files
 * For server-side rendering, ALWAYS use localhost to avoid DNS resolution issues
 * For client-side, use the public URL or current origin
 */
export function getServerUrl(): string {
  // Check if we're in a server context (Node.js environment)
  const isServer = typeof window === 'undefined'
  
  if (isServer) {
    // Server-side: ALWAYS use localhost to avoid DNS resolution issues
    // The container can't resolve its own public hostname, and NEXT_PUBLIC_SERVER_URL
    // might be set to an unresolvable domain causing fetch errors
    const port = process.env.PORT || '3000'
    return `http://localhost:${port}`
  }
  
  // Client-side: Use public URL if set and valid, otherwise use current origin
  // Only use NEXT_PUBLIC_SERVER_URL if it's a valid URL (not an unresolvable domain)
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    const publicUrl = process.env.NEXT_PUBLIC_SERVER_URL
    // Check if it's a valid URL format (starts with http/https)
    if (publicUrl.startsWith('http://') || publicUrl.startsWith('https://')) {
      return publicUrl
    }
  }
  
  // Fallback: Use current origin (works in browser)
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Last resort fallback
  return 'http://localhost:3000'
}

/**
 * Construct a full URL for a media file
 * Handles both relative and absolute URLs from Payload
 * Payload 3.0 returns URLs in format: /media/filename.jpg
 * But serves them through: /api/media/file/filename.jpg
 */
export function getMediaUrl(mediaUrl: string | undefined | null): string {
  if (!mediaUrl) {
    return ''
  }
  
  // If already absolute URL, return as-is
  if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
    return mediaUrl
  }
  
  const serverUrl = getServerUrl()
  
  // Payload returns URLs like /media/filename.jpg
  // We need to convert to /api/media/file/filename.jpg
  let cleanUrl = mediaUrl.startsWith('/') ? mediaUrl : `/${mediaUrl}`
  
  // If it's already the API route, use it as-is
  if (cleanUrl.startsWith('/api/media/file/')) {
    return `${serverUrl}${cleanUrl}`
  }
  
  // If it's /media/filename, convert to /api/media/file/filename
  if (cleanUrl.startsWith('/media/')) {
    const filename = cleanUrl.replace('/media/', '')
    return `${serverUrl}/api/media/file/${filename}`
  }
  
  // If it's just a filename (no leading slash), use API route directly
  if (!cleanUrl.startsWith('/')) {
    return `${serverUrl}/api/media/file/${cleanUrl}`
  }
  
  // If it's a path like /some/path/filename.jpg, extract just the filename
  const filename = cleanUrl.split('/').pop() || cleanUrl.replace(/^\//, '')
  return `${serverUrl}/api/media/file/${filename}`
}

/**
 * Get Payload media API URL for a filename
 * Use this when you have a filename but not the full URL
 */
export function getMediaApiUrl(filename: string): string {
  const serverUrl = getServerUrl()
  // Remove leading slash if present
  const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename
  return `${serverUrl}/api/media/file/${cleanFilename}`
}

