// Custom media file serving route
// This ensures media files are served correctly even if Payload's default route doesn't work

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 })
    }

    // Get Payload instance
    const payload = await getPayload({ config })
    
    // Find media by filename
    const mediaResult = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: filename,
        },
      },
      limit: 1,
    })

    if (mediaResult.docs.length === 0) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    const media = mediaResult.docs[0]
    
    // Get file path from Payload config
    const mediaDir = path.resolve('/app', 'media')
    const filePath = path.join(mediaDir, filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found at: ${filePath}`)
      return NextResponse.json({ error: 'File not found on disk' }, { status: 404 })
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath)
    const fileStats = fs.statSync(filePath)

    // Get MIME type
    const ext = path.extname(filename).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
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
      },
    })
  } catch (error: any) {
    console.error('Error serving media file:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

