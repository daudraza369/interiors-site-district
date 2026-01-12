// Custom media file serving route
// This ensures media files are served correctly even if Payload's default route doesn't work

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Media } from '@/collections/Media'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ filename: string }>
}

/**
 * Get the media directory path from Payload config
 * Handles both development and production (standalone build) scenarios
 */
function getMediaDirectory(): string {
  // Get staticDir from Media collection config
  const staticDir = Media.upload?.staticDir

  if (staticDir) {
    // If staticDir is an absolute path, use it directly
    if (path.isAbsolute(staticDir)) {
      return staticDir
    }
    // If relative, resolve from process.cwd()
    return path.resolve(process.cwd(), staticDir)
  }

  // Fallback: Try multiple possible locations
  const possiblePaths = [
    path.resolve('/app', 'media'), // Production Docker/Coolify
    path.resolve(process.cwd(), 'media'), // Development or if cwd is project root
    path.resolve(process.cwd(), '..', 'media'), // If running from .next/standalone
    path.resolve(process.cwd(), '..', '..', 'media'), // If running from .next/standalone/src
  ]

  // Return the first path that exists, or the first one as default
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return possiblePath
    }
  }

  // Default to /app/media for production
  return path.resolve('/app', 'media')
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { filename } = await params
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 })
    }

    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = path.basename(filename)
    if (sanitizedFilename !== filename || filename.includes('..')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    // Get Payload instance
    const payload = await getPayload({ config })
    
    // Find media by filename
    const mediaResult = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: sanitizedFilename,
        },
      },
      limit: 1,
    })

    if (mediaResult.docs.length === 0) {
      return NextResponse.json({ error: 'Media not found in database' }, { status: 404 })
    }

    const media = mediaResult.docs[0]
    
    // Get media directory path
    const mediaDir = getMediaDirectory()
    const filePath = path.join(mediaDir, sanitizedFilename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`[Media API] File not found at: ${filePath}`)
      console.error(`[Media API] Media directory: ${mediaDir}`)
      console.error(`[Media API] Process cwd: ${process.cwd()}`)
      
      // Try to list files in media directory for debugging
      if (fs.existsSync(mediaDir)) {
        try {
          const files = fs.readdirSync(mediaDir)
          console.error(`[Media API] Files in media directory (${files.length}):`, files.slice(0, 10))
        } catch (e) {
          console.error(`[Media API] Could not read media directory:`, e)
        }
      }
      
      return NextResponse.json({ 
        error: 'File not found on disk',
        debug: {
          mediaDir,
          filePath,
          cwd: process.cwd(),
          filename: sanitizedFilename,
        }
      }, { status: 404 })
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath)
    const fileStats = fs.statSync(filePath)

    // Get MIME type
    const ext = path.extname(sanitizedFilename).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.ico': 'image/x-icon',
    }
    const contentType = mimeTypes[ext] || media.mimeType || 'application/octet-stream'

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error: any) {
    console.error('[Media API] Error serving media file:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

