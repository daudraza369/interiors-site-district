// Fix portfolio images for Coolify deployment
// This script ensures portfolio images are properly linked and verifies files exist
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')
const envPath = path.join(rootDir, '.env')

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log(`✅ Loaded .env from: ${envPath}`)
} else {
  dotenv.config()
  console.log(`⚠️  .env not found at ${envPath}, using process.env`)
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

// Portfolio image mappings
const portfolioImageMap: Record<string, string> = {
  'Modern Corporate Lobby': 'portfolio-corporate-lobby',
  'Fine Dining Restaurant': 'portfolio-restaurant',
  'Private Villa Garden': 'portfolio-villa',
  'Co-Working Space': 'portfolio-coworking',
}

async function findMediaByBaseName(payload: any, baseName: string): Promise<any | null> {
  try {
    // Try exact match first
    const exactMatch = await payload.find({
      collection: 'media',
      where: {
        filename: {
          contains: baseName,
        },
      },
      limit: 50,
    })

    if (exactMatch.docs.length > 0) {
      // Find the best match (prefer exact, then highest version number)
      const matches = exactMatch.docs.filter((doc: any) => {
        const docBase = doc.filename.replace(/-\d+\./, '.').replace(/\.[^/.]+$/, '')
        return docBase.toLowerCase() === baseName.toLowerCase()
      })

      if (matches.length > 0) {
        // Sort by version number (highest first)
        matches.sort((a: any, b: any) => {
          const getVersion = (name: string) => {
            const match = name.match(/-(\d+)\./)
            return match ? parseInt(match[1], 10) : 0
          }
          return getVersion(b.filename) - getVersion(a.filename)
        })
        return matches[0]
      }
    }

    return null
  } catch (error: any) {
    console.error(`Error finding media: ${error.message}`)
    return null
  }
}

function getMediaDirectory(): string {
  const possiblePaths = [
    path.resolve(process.cwd(), 'media'),
    path.resolve('/app', 'media'),
    path.resolve(process.cwd(), '..', 'media'),
  ]

  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return possiblePath
    }
  }

  return process.env.NODE_ENV === 'production' 
    ? path.resolve('/app', 'media')
    : path.resolve(process.cwd(), 'media')
}

async function fixPortfolioImages() {
  console.log('🔧 Fixing portfolio images for Coolify...\n')

  try {
    const payload = await getPayload({ config: config.default })
    
    // Fetch homepage with depth 2 to get populated media
    const homePage = await payload.findGlobal({
      slug: 'home-page',
      depth: 2,
    })

    const projects = homePage.portfolioSection?.projects || []
    console.log(`📊 Found ${projects.length} portfolio projects\n`)

    const mediaDir = getMediaDirectory()
    console.log(`📁 Media directory: ${mediaDir}`)
    console.log(`📁 Directory exists: ${fs.existsSync(mediaDir)}\n`)

    if (fs.existsSync(mediaDir)) {
      const files = fs.readdirSync(mediaDir)
      console.log(`📁 Files in media directory: ${files.length}`)
      console.log(`📁 Sample files: ${files.slice(0, 10).join(', ')}\n`)
    }

    const updates: any[] = []
    let needsUpdate = false

    for (const project of projects) {
      console.log(`📸 Project: ${project.title}`)
      
      let imageLinked = false
      let imageFound = false
      let mediaDoc: any = null

      // Check if image is already linked
      if (project.heroImage) {
        if (typeof project.heroImage === 'object' && project.heroImage.id) {
          console.log(`   ✅ Image already linked (ID: ${project.heroImage.id})`)
          mediaDoc = project.heroImage
          imageLinked = true
        } else if (typeof project.heroImage === 'number') {
          // Try to fetch the media
          try {
            mediaDoc = await payload.findByID({
              collection: 'media',
              id: project.heroImage,
            })
            console.log(`   ✅ Image linked by ID: ${mediaDoc.filename}`)
            imageLinked = true
          } catch (e) {
            console.log(`   ⚠️  Image ID ${project.heroImage} not found`)
          }
        }
      }

      // If not linked, try to find the image
      if (!imageLinked) {
        const baseName = portfolioImageMap[project.title]
        if (baseName) {
          console.log(`   🔍 Searching for image: ${baseName}...`)
          mediaDoc = await findMediaByBaseName(payload, baseName)
          
          if (mediaDoc) {
            console.log(`   ✅ Found in database: ${mediaDoc.filename} (ID: ${mediaDoc.id})`)
            imageFound = true
            needsUpdate = true
          } else {
            console.log(`   ❌ Not found in database`)
          }
        }
      }

      // Check if file exists on disk
      if (mediaDoc && mediaDoc.filename) {
        const filePath = path.join(mediaDir, mediaDoc.filename)
        if (fs.existsSync(filePath)) {
          console.log(`   ✅ File exists on disk: ${mediaDoc.filename}`)
        } else {
          console.log(`   ⚠️  File NOT found on disk: ${mediaDoc.filename}`)
          console.log(`   📁 Expected path: ${filePath}`)
          
          // Try to find similar file
          if (fs.existsSync(mediaDir)) {
            const files = fs.readdirSync(mediaDir)
            const similarFiles = files.filter((f: string) => 
              f.toLowerCase().includes(baseName?.toLowerCase() || '')
            )
            if (similarFiles.length > 0) {
              console.log(`   💡 Similar files found: ${similarFiles.join(', ')}`)
            }
          }
        }
      }

      if (imageFound && mediaDoc) {
        updates.push({
          ...project,
          heroImage: mediaDoc.id,
        })
      } else if (!imageLinked) {
        updates.push(project) // Keep as is, but mark for update
      }

      console.log('')
    }

    // Update if needed
    if (needsUpdate && updates.length > 0) {
      console.log('🔧 Updating portfolio projects with images...\n')
      
      const updatedProjects = projects.map((p: any) => {
        const update = updates.find(u => u.title === p.title && u.heroImage)
        return update || p
      })

      await payload.updateGlobal({
        slug: 'home-page',
        data: {
          portfolioSection: {
            ...homePage.portfolioSection,
            projects: updatedProjects,
          },
        },
      })

      console.log('✅ Portfolio images updated!\n')
    } else {
      console.log('✅ All portfolio images are properly linked!\n')
    }

    // Final verification
    console.log('🔍 Final verification:\n')
    const finalHomePage = await payload.findGlobal({
      slug: 'home-page',
      depth: 2,
    })

    for (const project of finalHomePage.portfolioSection?.projects || []) {
      if (project.heroImage && typeof project.heroImage === 'object') {
        const filename = project.heroImage.filename || 'unknown'
        const url = project.heroImage.url || 'no url'
        console.log(`   ✅ ${project.title}: ${filename}`)
        console.log(`      URL: ${url}`)
      } else {
        console.log(`   ❌ ${project.title}: NO IMAGE`)
      }
    }

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error fixing portfolio images:', error.message || error)
    console.error(error.stack)
    process.exit(1)
  }
}

fixPortfolioImages()


