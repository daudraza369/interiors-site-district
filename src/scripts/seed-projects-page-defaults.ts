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
  console.log(`✅ Loaded .env`)
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function seedProjectsPageDefaults() {
  console.log('🌱 Seeding Projects Page defaults...\n')

  const payload = await getPayload({ config: config.default })

  // Get current ProjectsPage
  console.log('📝 Fetching current ProjectsPage...')
  const projectsPage = await payload.findGlobal({
    slug: 'projects-page',
    depth: 0,
  })

  // Prepare update data - merge with existing to preserve other fields
  const updateData = {
    heroSection: {
      enabled: projectsPage.heroSection?.enabled ?? true,
      badgeText: projectsPage.heroSection?.badgeText || 'Portfolio',
      headline: projectsPage.heroSection?.headline || 'Our Projects',
      description: projectsPage.heroSection?.description || 'Spaces transformed through green design. A showcase of curated interiors and custom installations.',
    },
    gallerySection: {
      enabled: projectsPage.gallerySection?.enabled ?? true,
      headline: projectsPage.gallerySection?.headline || null,
      categories: projectsPage.gallerySection?.categories || [
        { label: 'All', value: 'All' },
        { label: 'Office', value: 'Office' },
        { label: 'Hospitality', value: 'Hospitality' },
        { label: 'F&B', value: 'F&B' },
        { label: 'Villa', value: 'Villa' },
      ],
    },
  }

  // Update the ProjectsPage global
  console.log('📝 Updating Projects Page with defaults...')
  try {
    await payload.updateGlobal({
      slug: 'projects-page',
      data: updateData,
    })
    console.log(`✅ Projects Page defaults set!`)
    console.log('\n📋 Updated sections:')
    console.log(`   ✅ Hero Section: enabled=${updateData.heroSection.enabled}`)
    console.log(`   ✅ Gallery Section: enabled=${updateData.gallerySection.enabled}`)
    console.log('\n💡 Refresh the admin panel to see the updated values!')
  } catch (error: any) {
    console.error('❌ Error updating Projects Page defaults:', error.message || error)
    process.exit(1)
  }

  console.log('\n✨ Done!')
}

seedProjectsPageDefaults()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))





