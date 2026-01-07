import type { VirtualShowroom, Media } from '../../payload-types'

export interface NormalizedShowroom {
  id: string
  title: string
  description: string
  tourUrl: string
  location: string
  thumbnail: string | { url?: string; filename?: string } | null
}

/**
 * Normalize a VirtualShowroom from Payload to a Showroom for the component.
 * Ensures thumbnail is never undefined - always string | { url, filename } | null
 */
export function normalizeShowroom(raw: VirtualShowroom): NormalizedShowroom {
  // Normalize thumbnail: convert Media object or string to the expected format
  let thumbnail: string | { url?: string; filename?: string } | null = null

  if (raw.thumbnail) {
    if (typeof raw.thumbnail === 'string') {
      // If it's already a string URL, use it directly
      thumbnail = raw.thumbnail
    } else if (typeof raw.thumbnail === 'object' && 'url' in raw.thumbnail) {
      // It's a Media object (populated with depth: 1 or 2)
      const media = raw.thumbnail as Media
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'
      
      // Build the URL
      let url = ''
      if (media.url) {
        url = media.url.startsWith('http')
          ? media.url
          : `${serverUrl}${media.url.startsWith('/') ? '' : '/'}${media.url}`
      }
      
      // Return object with url and/or filename
      if (url || media.filename) {
        thumbnail = {
          ...(url && { url }),
          ...(media.filename && { filename: media.filename }),
        }
      }
    }
    // If thumbnail is null or number (unpopulated), thumbnail stays null
  }

  return {
    id: String(raw.id),
    title: raw.title || '',
    description: raw.description || '',
    tourUrl: raw.tourUrl || '',
    location: raw.location || '',
    thumbnail,
  }
}

