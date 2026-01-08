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
 */
export function getMediaUrl(mediaUrl: string | undefined | null): string {
  if (!mediaUrl) {
    return ''
  }
  
  // If already absolute URL, return as-is
  if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
    return mediaUrl
  }
  
  // If relative URL, prepend server URL
  const serverUrl = getServerUrl()
  const cleanUrl = mediaUrl.startsWith('/') ? mediaUrl : `/${mediaUrl}`
  
  return `${serverUrl}${cleanUrl}`
}

/**
 * Get Payload media API URL for a filename
 * Use this when you have a filename but not the full URL
 */
export function getMediaApiUrl(filename: string): string {
  const serverUrl = getServerUrl()
  return `${serverUrl}/api/media/file/${filename}`
}

