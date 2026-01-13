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
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function fixHomePageImages() {
  const payload = await getPayload({ config: config.default })
  
  const homePage = await payload.findGlobal({
    slug: 'home-page',
  })
  
  // Clear invalid image references
  const fixedData: any = { ...homePage }
  
  // Clear hero slides images if invalid
  if (fixedData.heroSection?.heroSlides) {
    fixedData.heroSection.heroSlides = fixedData.heroSection.heroSlides.map((slide: any) => ({
      ...slide,
      backgroundImage: slide.backgroundImage && typeof slide.backgroundImage === 'object' ? slide.backgroundImage.id : null,
    }))
  }
  
  // Clear portfolio project images if invalid
  if (fixedData.portfolioSection?.projects) {
    fixedData.portfolioSection.projects = fixedData.portfolioSection.projects.map((project: any) => ({
      ...project,
      heroImage: project.heroImage && typeof project.heroImage === 'object' ? project.heroImage.id : null,
    }))
  }
  
  // Update with cleared references
  await payload.updateGlobal({
    slug: 'home-page',
    data: fixedData,
  })
  
  console.log('✅ Fixed invalid image references')
}

fixHomePageImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error.message)
    process.exit(1)
  })




