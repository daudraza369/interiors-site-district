import type { CollectionConfig, CollectionAfterReadHook, CollectionBeforeChangeHook } from 'payload'
import path from 'path'

/**
 * Normalize media URL to always be relative (no hostname)
 * Strips localhost, domains, etc. and ensures /media/filename format
 */
function normalizeUrl(url: string | undefined | null): string | undefined {
  if (!url || typeof url !== 'string') return url
  
  // If it's already relative, return as-is
  if (url.startsWith('/media/') || url.startsWith('/api/media/file/')) {
    return url
  }
  
  // Strip absolute URLs (http://, https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      // Convert to /media/filename format
      if (pathname.startsWith('/media/')) {
        return pathname
      }
      if (pathname.startsWith('/api/media/file/')) {
        return pathname
      }
      // Extract filename from any path
      const filename = pathname.split('/').pop()
      if (filename) {
        return `/media/${filename}`
      }
      return pathname
    } catch (e) {
      // If URL parsing fails, try to extract filename manually
      const match = url.match(/\/(media|api\/media\/file)\/([^/?]+)/)
      if (match) {
        return match[0]
      }
      // Last resort: extract filename from end of URL
      const filename = url.split('/').pop()?.split('?')[0]
      if (filename) {
        return `/media/${filename}`
      }
    }
  }
  
  // If it's a relative path without /media/, ensure it starts with /
  if (!url.startsWith('/')) {
    return `/media/${url}`
  }
  
  return url
}

/**
 * Hook to normalize URLs after reading from database
 * Ensures even old records with absolute URLs are returned as relative
 */
const normalizeAfterRead: CollectionAfterReadHook = ({ doc }) => {
  if (doc.url) {
    doc.url = normalizeUrl(doc.url) || doc.url
  }
  
  // Normalize sizes URLs if they exist
  if (doc.sizes && typeof doc.sizes === 'object') {
    for (const sizeKey in doc.sizes) {
      const size = doc.sizes[sizeKey]
      if (size && typeof size === 'object' && size.url) {
        size.url = normalizeUrl(size.url) || size.url
      }
    }
  }
  
  return doc
}

/**
 * Hook to normalize URLs before saving to database
 * Prevents absolute URLs from being stored
 */
const normalizeBeforeChange: CollectionBeforeChangeHook = ({ data }) => {
  if (data.url) {
    data.url = normalizeUrl(data.url) || data.url
  }
  
  // Normalize sizes URLs if they exist
  if (data.sizes && typeof data.sizes === 'object') {
    for (const sizeKey in data.sizes) {
      const size = data.sizes[sizeKey]
      if (size && typeof size === 'object' && size.url) {
        size.url = normalizeUrl(size.url) || size.url
      }
    }
  }
  
  return data
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'mimeType', 'filesize', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterRead: [normalizeAfterRead],
    beforeChange: [normalizeBeforeChange],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      required: true,
      admin: {
        description: 'Alternative text for accessibility and SEO',
      },
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'text',
      admin: {
        description: 'Optional caption for the image',
      },
    },
  ],
  upload: {
    // Use environment-aware path
    // Development: relative to project root
    // Production: absolute path /app/media (Docker/Coolify)
    staticDir: process.env.NODE_ENV === 'production' 
      ? path.resolve('/app', 'media')
      : path.resolve(process.cwd(), 'media'),
    staticURL: '/media',
    // Removed imageSizes and adminThumbnail to avoid database schema mismatch
    // These require database migrations that aren't available in production
  },
}
