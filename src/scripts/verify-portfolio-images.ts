// Load environment variables FIRST, before importing anything
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
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function findMediaByFilename(payload: any, filename: string): Promise<string | null> {
  try {
    const baseName = filename.replace(/\.[^/.]+$/, '')
    const pattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(-\\d+)?\\.`, 'i')
    
    const result = await payload.find({ collection: 'media', limit: 200 })
    const matches = result.docs.filter((doc: any) => 
      doc.filename && pattern.test(doc.filename)
    )
    
    if (matches.length === 0) return null
    
    matches.sort((a: any, b: any) => {
      const numA = parseInt((a.filename.match(/-(\d+)\./) || [0, 0])[1])
      const numB = parseInt((b.filename.match(/-(\d+)\./) || [0, 0])[1])
      return numB - numA
    })
    
    return matches[0].id
  } catch (error: any) {
    return null
  }
}

async function verifyPortfolioImages() {
  console.log('🔍 Verifying portfolio images...\n')

  try {
    const payload = await getPayload({ config: config.default })
    const homePage = await payload.findGlobal({ slug: 'home-page', depth: 2 })
    const projects = homePage.portfolioSection?.projects || []
    
    console.log(`📊 Found ${projects.length} portfolio projects:\n`)
    
    let needsFix = false
    const projectsToUpdate: any[] = []
    
    const projectImages = [
      { title: 'Modern Corporate Lobby', filename: 'portfolio-corporate-lobby.jpg' },
      { title: 'Fine Dining Restaurant', filename: 'portfolio-restaurant.jpg' },
      { title: 'Private Villa Garden', filename: 'portfolio-villa.jpg' },
      { title: 'Co-Working Space', filename: 'portfolio-coworking.jpg' },
    ]
    
    for (const project of projects) {
      console.log(`📸 ${project.title}:`)
      
      if (project.heroImage) {
        if (typeof project.heroImage === 'object' && project.heroImage.url) {
          console.log(`   ✅ Image linked: ${project.heroImage.filename || project.heroImage.url}`)
        } else if (typeof project.heroImage === 'number') {
          console.log(`   ⚠️  Image ID found: ${project.heroImage} (should be populated with depth: 2)`)
          needsFix = true
        }
      } else {
        console.log(`   ❌ NO IMAGE - Need to find and link`)
        const matchingImage = projectImages.find(p => p.title === project.title)
        if (matchingImage) {
          const imageId = await findMediaByFilename(payload, matchingImage.filename)
          if (imageId) {
            console.log(`   🔗 Found image in media collection, will link: ${matchingImage.filename}`)
            projectsToUpdate.push({
              ...project,
              heroImage: imageId,
            })
            needsFix = true
          } else {
            console.log(`   ⚠️  Image not found in media collection: ${matchingImage.filename}`)
          }
        }
      }
      console.log('')
    }
    
    if (needsFix && projectsToUpdate.length > 0) {
      console.log('🔧 Fixing portfolio images...\n')
      
      // Update projects with images
      const updatedProjects = projects.map((p: any) => {
        const update = projectsToUpdate.find(u => u.title === p.title)
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
      
      console.log('✅ Portfolio images fixed!\n')
    } else if (!needsFix) {
      console.log('✅ All portfolio images are properly linked!\n')
    } else {
      console.log('⚠️  Some images could not be found. Upload them to media collection first.\n')
    }
    
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error verifying portfolio images:', error.message || error)
    process.exit(1)
  }
}

verifyPortfolioImages()


