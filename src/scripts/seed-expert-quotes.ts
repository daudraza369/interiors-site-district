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

// Now dynamically import Payload after .env is loaded
const { getPayload } = await import('payload')
const config = await import('@payload-config')

// Default expert quotes data
const expertQuotesData = [
  {
    quote: "It is a misconception that a 'clean' desk equals a focused mind. We found that simply enriching a sterile space with plants increased productivity by 15%.",
    author: 'Dr. Chris Knight',
    authorTitle: 'University of Exeter',
    type: 'Scientific',
  },
  {
    quote: "We have exiled nature from our daily lives, and it is costing us our health and happiness. The absence of nature is not a neutral condition. It is a deprivation.",
    author: 'Stephen R. Kellert',
    authorTitle: 'Pioneer of Biophilic Design, Yale Professor',
    type: 'Visionary',
  },
  {
    quote: "No one creates their best work in a beige box. If you want your team to thrive, you have to build a habitat, not just an office.",
    author: 'Biophilic Design Principles',
    authorTitle: '',
    type: 'Modern Business',
  },
]

async function seedExpertQuotes() {
  console.log('🌱 Starting expert quotes seed...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Fetch the current HomePage global
    const homePage = await payload.findGlobal({
      slug: 'home-page',
      depth: 0,
    })

    const currentQuotes = homePage.expertQuotesCarousel?.quotes || []
    const newQuotesToAdd: any[] = []

    for (const quoteData of expertQuotesData) {
      // Check if quote already exists (by author name)
      const exists = currentQuotes.some(
        (quote: any) => quote.author === quoteData.author
      )

      if (exists) {
        console.log(`⏭️  Already exists: ${quoteData.author}`)
        continue
      }

      newQuotesToAdd.push({
        quote: quoteData.quote,
        author: quoteData.author,
        authorTitle: quoteData.authorTitle || '',
        type: quoteData.type,
      })
    }

    if (newQuotesToAdd.length > 0) {
      try {
        const updatedHomePage = await payload.updateGlobal({
          slug: 'home-page',
          data: {
            expertQuotesCarousel: {
              ...homePage.expertQuotesCarousel,
              enabled: homePage.expertQuotesCarousel?.enabled ?? true,
              quotes: [...currentQuotes, ...newQuotesToAdd],
            },
          },
        })
        console.log(`✅ Added ${newQuotesToAdd.length} new quotes to HomePage global.`)
      } catch (error: any) {
        console.error(`❌ Error updating HomePage global with expert quotes:`, error.message || error)
      }
    } else {
      console.log('✅ All quotes already exist in the database.')
    }

    console.log(`\n✨ Seed complete!`)
    console.log(`   📦 Total quotes in global: ${(currentQuotes.length + newQuotesToAdd.length)}`)
  } catch (error: any) {
    console.error('❌ Error during expert quotes seed:', error.message)
    throw error
  }
}

seedExpertQuotes()
  .then(() => {
    console.log('\n🎉 Expert quotes seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })




