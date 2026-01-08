/**
 * Utility functions for constructing media URLs
 * Handles both development and production environments
 */

/**
 * Get the base server URL for media files
 * Uses NEXT_PUBLIC_SERVER_URL if set, otherwise constructs from request
 */
export function getServerUrl(): string {
  // In production, use NEXT_PUBLIC_SERVER_URL if set
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL
  }
  
  // Fallback for development
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'
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

