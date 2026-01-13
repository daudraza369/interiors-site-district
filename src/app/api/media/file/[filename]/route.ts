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
    // If staticDir is an absolute path, check if it exists first
    if (path.isAbsolute(staticDir)) {
      // In development, prefer the development path even if config says /app/media
      if (process.env.NODE_ENV !== 'production') {
        const devPath = path.resolve(process.cwd(), 'media')
        if (fs.existsSync(devPath)) {
          return devPath
        }
      }
      // If the configured path exists, use it
      if (fs.existsSync(staticDir)) {
        return staticDir
      }
    } else {
      // If relative, resolve from process.cwd()
      const resolvedPath = path.resolve(process.cwd(), staticDir)
      if (fs.existsSync(resolvedPath)) {
        return resolvedPath
      }
    }
  }

  // Fallback: Try multiple possible locations (check development first)
  const possiblePaths = [
    path.resolve(process.cwd(), 'media'), // Development - project root
    path.resolve(process.cwd(), '..', 'media'), // If running from .next/standalone
    path.resolve(process.cwd(), '..', '..', 'media'), // If running from .next/standalone/src
    path.resolve('/app', 'media'), // Production Docker/Coolify (check last)
  ]

  // Return the first path that exists
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return possiblePath
    }
  }

  // Default based on environment
  if (process.env.NODE_ENV === 'production') {
    return path.resolve('/app', 'media')
  }
  return path.resolve(process.cwd(), 'media')
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
    
    // Find media by filename - try exact match first
    let mediaResult = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: sanitizedFilename,
        },
      },
      limit: 1,
    })

    // If not found, try matching by base name (strip numbers like -34, -2, etc.)
    // This handles cases where database has "hero-interior-34.jpg" but request is "hero-interior.jpg"
    if (mediaResult.docs.length === 0) {
      const ext = path.extname(sanitizedFilename)
      const nameWithoutExt = path.basename(sanitizedFilename, ext)
      const baseNamePattern = nameWithoutExt.replace(/-\d+$/, '') // Remove trailing numbers
      
      // Find all media files with similar base name
      const allMedia = await payload.find({
        collection: 'media',
        where: {
          filename: {
            contains: baseNamePattern,
          },
        },
        limit: 20,
      })
      
      // Find the best match - file that starts with base name and has same extension
      const bestMatch = allMedia.docs.find((m: any) => {
        const dbFilename = m.filename
        const dbNameWithoutExt = path.basename(dbFilename, path.extname(dbFilename))
        const dbBaseName = dbNameWithoutExt.replace(/-\d+$/, '')
        return dbBaseName === baseNamePattern && path.extname(dbFilename) === ext
      })
      
      if (bestMatch) {
        mediaResult = { docs: [bestMatch] }
      }
    }

    if (mediaResult.docs.length === 0) {
      return NextResponse.json({ error: 'Media not found in database' }, { status: 404 })
    }

    const media = mediaResult.docs[0]
    
    // Use the ACTUAL filename from database (which may have numbers like -34)
    // This is critical because files on disk are named with the database filename
    const actualFilename = media.filename
    
    // Get media directory path
    const mediaDir = getMediaDirectory()
    let filePath = path.join(mediaDir, actualFilename)

    // Check if file exists - if not, try to find a matching file on disk
    if (!fs.existsSync(filePath)) {
      // Try to find a file with similar base name (handle version number mismatches)
      const ext = path.extname(actualFilename)
      const nameWithoutExt = path.basename(actualFilename, ext)
      const baseName = nameWithoutExt.replace(/-\d+$/, '') // Remove trailing version number
      
      // Find all files in media directory that match the base name
      if (fs.existsSync(mediaDir)) {
        try {
          const allFiles = fs.readdirSync(mediaDir)
          const matchingFiles = allFiles.filter((file: string) => {
            const fileExt = path.extname(file)
            const fileNameWithoutExt = path.basename(file, fileExt)
            const fileBaseName = fileNameWithoutExt.replace(/-\d+$/, '')
            return fileBaseName === baseName && fileExt === ext
          })
          
          if (matchingFiles.length > 0) {
            // Sort by version number (highest first) and use the latest version
            matchingFiles.sort((a: string, b: string) => {
              const getVersion = (name: string) => {
                const match = name.match(/-(\d+)\./)
                return match ? parseInt(match[1], 10) : 0
              }
              return getVersion(b) - getVersion(a)
            })
            
            filePath = path.join(mediaDir, matchingFiles[0])
            console.log(`[Media API] Using fallback file: ${matchingFiles[0]} (requested: ${actualFilename})`)
          }
        } catch (e) {
          console.error(`[Media API] Could not search media directory:`, e)
        }
      }
      
      // If still not found, return 404
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
            actualFilename,
          }
        }, { status: 404 })
      }
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath)
    const fileStats = fs.statSync(filePath)

    // Get MIME type - use actual filename from database
    const ext = path.extname(actualFilename).toLowerCase()
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

