// Load environment variables FIRST, before importing anything
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')
const envPath = path.join(rootDir, '.env')

// Load .env file BEFORE importing anything that uses env vars
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log(`✅ Loaded .env from: ${envPath}`)
} else {
  dotenv.config()
  console.log(`⚠️  .env not found at ${envPath}, using process.env`)
}

// Ensure PAYLOAD_SECRET is set
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function seedFlowersPageDefaults() {
  console.log('🌸 Seeding Flowers Page defaults...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Find the catalog preview image in media collection
    let previewImageId: string | number | null = null
    try {
      const previewImageResult = await payload.find({
        collection: 'media',
        where: {
          filename: {
            equals: 'flowers-catalog-preview.png',
          },
        },
        limit: 1,
      })

      if (previewImageResult.docs.length > 0) {
        previewImageId = previewImageResult.docs[0].id
        console.log(`✅ Found catalog preview image (ID: ${previewImageId})`)
      } else {
        console.log(`⚠️  Catalog preview image not found in media collection`)
        console.log(`   Please run: npm run seed:media (or npx tsx src/scripts/seed-media.ts)`)
        console.log(`   Then run this script again to link the image`)
      }
    } catch (error: any) {
      console.log(`⚠️  Could not search for preview image: ${error.message}`)
    }

    const defaultData: any = {
      heroSection: {
        enabled: true,
        headline: 'Premium Wholesale Flowers,\nFresh from Source',
        subheadline:
          'Direct imports from Holland & Kenya • Weekly shipments • Trusted supplier to Fairmont Hotels',
        badges: [
          { icon: 'Plane', text: 'Holland & Kenya Direct Imports' },
          { icon: 'CalendarClock', text: 'Fresh Weekly Arrivals' },
          { icon: 'Building2', text: 'Fairmont Hotel Partner' },
        ],
      },
      catalogSection: {
        enabled: true,
        eyebrow: 'Download Now',
        headline: "This Week's Wholesale Pricelist",
        catalogUrl:
          'https://download1588.mediafire.com/qvunnvifx7ig90xjG3uF2EGBhSEvkIToAlTZkZTYwMAMpjcW9fIlb72B9BqVsQ2ovqC_EPkGuy6Wmkvgd--M-EzrkTr0AEN335sgo2_05pTiuGo_Bzv_K5f1RWDesQlsj5YWF6ARu9ShXTa5lQc67hHQk_tLqnMrPotvFL9ElP6f/488cgm2x4it6hit/DF — Dec 31 2025 — Wholesale Catalog.pdf',
        buttonText: 'Download the Full Catalogue for Latest Arrivals',
      },
      benefitsSection: {
        enabled: true,
        eyebrow: 'The District Difference',
        headline: 'Why Choose District Flowers',
        benefits: [
          {
            icon: 'Truck',
            title: 'Reliable Supply',
            description:
              'Weekly shipments plus emergency backup stock ensure you never run short.',
          },
          {
            icon: 'Award',
            title: 'Premium Quality',
            description:
              'Hotel-grade flowers at wholesale prices, sourced from specialty farms.',
          },
          {
            icon: 'Flower2',
            title: 'Wide Selection',
            description:
              "Extensive variety from Holland and Kenya's finest specialty farms.",
          },
        ],
      },
    }

    // Add preview image if found
    if (previewImageId) {
      defaultData.catalogSection.previewImage = previewImageId
    }

    // Update global
    await payload.updateGlobal({
      slug: 'flowers-page',
      data: defaultData,
    })

    console.log('✅ Flowers Page defaults seeded successfully!')
    console.log('   All sections enabled with default content')
    if (previewImageId) {
      console.log(`   ✅ Catalog preview image linked (ID: ${previewImageId})`)
    } else {
      console.log(`   ⚠️  Catalog preview image not linked - upload it manually in admin or run seed:media first`)
    }
  } catch (error: any) {
    console.error('❌ Error seeding Flowers Page:', error.message)
    process.exit(1)
  }
}

seedFlowersPageDefaults()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))


