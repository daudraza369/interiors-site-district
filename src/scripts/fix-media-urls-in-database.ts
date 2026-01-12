/**
 * One-time cleanup script to fix absolute URLs in Media collection
 * Scans all media records and rewrites localhost/absolute URLs to relative /media/filename
 * 
 * Usage: npm run fix:media-urls
 * 
 * Safe to run multiple times - idempotent
 */

import { getPayload } from 'payload'
import config from '@payload-config'

function normalizeUrl(url: string | undefined | null): string | undefined {
  if (!url || typeof url !== 'string') return url
  
  // If already relative, return as-is
  if (url.startsWith('/media/') || url.startsWith('/api/media/file/')) {
    return url
  }
  
  // Strip absolute URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      
      // Convert to /media/filename format
      if (pathname.startsWith('/media/')) {
        return pathname
      }
      if (pathname.startsWith('/api/media/file/')) {
        // Convert API route to /media/ for consistency
        const filename = pathname.replace('/api/media/file/', '')
        return `/media/${filename}`
      }
      
      // Extract filename from any path
      const filename = pathname.split('/').pop()
      if (filename) {
        return `/media/${filename}`
      }
      return pathname
    } catch (e) {
      // If URL parsing fails, try regex
      const match = url.match(/\/(media|api\/media\/file)\/([^/?]+)/)
      if (match) {
        const filename = match[2]
        return `/media/${filename}`
      }
      // Last resort: extract filename from end
      const filename = url.split('/').pop()?.split('?')[0]
      if (filename) {
        return `/media/${filename}`
      }
    }
  }
  
  // If relative but not /media/, ensure it's /media/filename
  if (!url.startsWith('/')) {
    return `/media/${url}`
  }
  
  return url
}

async function fixMediaUrls() {
  console.log('🔧 Starting media URL cleanup...\n')
  
  const payload = await getPayload({ config })
  
  // Fetch all media records
  const result = await payload.find({
    collection: 'media',
    limit: 10000, // Get all records
    depth: 0,
  })
  
  console.log(`📦 Found ${result.docs.length} media records\n`)
  
  let fixed = 0
  let skipped = 0
  let errors = 0
  
  for (const media of result.docs) {
    let needsUpdate = false
    const updateData: any = {}
    
    // Check main URL
    if (media.url) {
      const normalized = normalizeUrl(media.url)
      if (normalized !== media.url) {
        updateData.url = normalized
        needsUpdate = true
        console.log(`  🔄 ${media.filename || media.id}:`)
        console.log(`     ${media.url} → ${normalized}`)
      }
    }
    
    // Check sizes URLs
    if (media.sizes && typeof media.sizes === 'object') {
      const normalizedSizes: any = {}
      let sizesChanged = false
      
      for (const sizeKey in media.sizes) {
        const size = media.sizes[sizeKey]
        if (size && typeof size === 'object' && size.url) {
          const normalized = normalizeUrl(size.url)
          if (normalized !== size.url) {
            normalizedSizes[sizeKey] = {
              ...size,
              url: normalized,
            }
            sizesChanged = true
            console.log(`     sizes.${sizeKey}: ${size.url} → ${normalized}`)
          } else {
            normalizedSizes[sizeKey] = size
          }
        } else {
          normalizedSizes[sizeKey] = size
        }
      }
      
      if (sizesChanged) {
        updateData.sizes = normalizedSizes
        needsUpdate = true
      }
    }
    
    if (needsUpdate) {
      try {
        await payload.update({
          collection: 'media',
          id: media.id,
          data: updateData,
        })
        fixed++
        console.log(`     ✅ Updated\n`)
      } catch (error: any) {
        errors++
        console.error(`     ❌ Error updating: ${error.message}\n`)
      }
    } else {
      skipped++
    }
  }
  
  console.log('\n✨ Cleanup complete!')
  console.log(`   ✅ Fixed: ${fixed}`)
  console.log(`   ⏭️  Skipped (already correct): ${skipped}`)
  console.log(`   ❌ Errors: ${errors}`)
  console.log(`   📦 Total: ${result.docs.length}\n`)
  
  process.exit(0)
}

fixMediaUrls().catch((error) => {
  console.error('💥 Fatal error:', error)
  process.exit(1)
})

