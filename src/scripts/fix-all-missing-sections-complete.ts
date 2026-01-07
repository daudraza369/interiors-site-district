// Complete fix script - seeds ALL missing sections properly
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

async function findMediaByFilename(payload: any, searchName: string): Promise<string | null> {
  try {
    const justFilename = searchName.includes('/') ? searchName.split('/').pop()! : searchName
    const baseName = justFilename.replace(/\.[^/.]+$/, '')
    
    const result = await payload.find({ collection: 'media', limit: 200 })
    
    const matches = result.docs.filter((doc: any) => {
      const filename = (doc.filename || '').toLowerCase()
      return filename.includes(baseName.toLowerCase())
    })
    
    if (matches.length === 0) return null
    
    matches.sort((a: any, b: any) => {
      const numA = parseInt((a.filename.match(/-(\d+)\./) || [0, 0])[1])
      const numB = parseInt((b.filename.match(/-(\d+)\./) || [0, 0])[1])
      return numB - numA
    })
    
    return matches[0].id
  } catch {
    return null
  }
}

// Expert quotes data - using correct field names from schema
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

// Our approach points data - using correct field names from schema
const approachPointsData = [
  {
    number: '01',
    icon: 'Lightbulb',
    title: 'Discovery',
    description: 'We analyze your space, brand identity, and objectives to understand what success looks like for you.',
    accent: 'Understand',
  },
  {
    number: '02',
    icon: 'Ruler',
    title: 'Design',
    description: 'Our designers create custom concepts that balance aesthetics, functionality, and maintenance requirements.',
    accent: 'Envision',
  },
  {
    number: '03',
    icon: 'Wrench',
    title: 'Installation',
    description: 'Expert craftsmen bring designs to life with precision, ensuring minimal disruption to your operations.',
    accent: 'Transform',
  },
  {
    number: '04',
    icon: 'Sparkles',
    title: 'Ongoing Care',
    description: 'Regular maintenance keeps your greenery thriving, with responsive support whenever you need it.',
    accent: 'Sustain',
  },
]

async function fixAllSections() {
  console.log('🔧 Fixing ALL missing sections...\n')
  
  const payload = await getPayload({ config: config.default })
  const homePage = await payload.findGlobal({ slug: 'home-page', depth: 2 })
  
  // Step 0: Ensure media is uploaded
  console.log('📦 Step 0: Checking media...')
  const allMedia = await payload.find({ collection: 'media', limit: 200 })
  console.log(`   Found ${allMedia.docs.length} media files`)
  
  if (allMedia.docs.length === 0) {
    console.log('   ⚠️  No media found. Run: npm run seed:media first')
  }
  
  // Step 1: Fix Client Logos
  console.log('\n📦 Step 1: Fixing Client Logos...')
  
  const logoMap: Record<string, string> = {}
  const logoNames = ['amazon', 'linklaters', 'pepsico', 'simah', 'tahakom']
  
  for (const media of allMedia.docs) {
    const filename = (media.filename || '').toLowerCase()
    for (const logoName of logoNames) {
      if (filename.includes(logoName.toLowerCase()) && !logoMap[logoName]) {
        logoMap[logoName] = media.id
      }
    }
  }
  
  const logos = []
  const logoData = [
    { name: 'Amazon', key: 'amazon', url: 'https://amazon.com', order: 0 },
    { name: 'Linklaters', key: 'linklaters', url: 'https://linklaters.com', order: 1 },
    { name: 'PepsiCo', key: 'pepsico', url: 'https://pepsico.com', order: 2 },
    { name: 'SIMAH', key: 'simah', url: null, order: 3 },
    { name: 'Tahakom', key: 'tahakom', url: null, order: 4 },
  ]
  
  for (const logo of logoData) {
    if (logoMap[logo.key]) {
      logos.push({
        clientName: logo.name,
        logo: logoMap[logo.key],
        websiteUrl: logo.url,
        displayOrder: logo.order,
      })
    }
  }
  
  console.log(`   ✅ Found ${logos.length} logos`)
  
  // Step 2: Fix Expert Quotes
  console.log('\n📦 Step 2: Fixing Expert Quotes...')
  const existingQuotes = homePage.expertQuotesCarousel?.quotes || []
  const newQuotes = [...existingQuotes]
  
  for (const quoteData of expertQuotesData) {
    const exists = existingQuotes.find((q: any) => q.author === quoteData.author)
    if (!exists) {
      newQuotes.push({
        quote: quoteData.quote,
        author: quoteData.author,
        authorTitle: quoteData.authorTitle || '',
        type: quoteData.type,
      })
    }
  }
  
  console.log(`   ✅ Added ${newQuotes.length - existingQuotes.length} quotes`)
  
  // Step 3: Fix Our Approach
  console.log('\n📦 Step 3: Fixing Our Approach...')
  const existingPoints = homePage.ourApproachSection?.approachPoints || []
  const newPoints = [...existingPoints]
  
  for (const pointData of approachPointsData) {
    const exists = existingPoints.find((p: any) => p.number === pointData.number)
    if (!exists) {
      newPoints.push({
        number: pointData.number,
        icon: pointData.icon,
        title: pointData.title,
        description: pointData.description,
        accent: pointData.accent,
      })
    }
  }
  
  console.log(`   ✅ Added ${newPoints.length - existingPoints.length} approach points`)
  
  // Step 4: Fix Portfolio Images
  console.log('\n📦 Step 4: Fixing Portfolio Images...')
  const portfolioProjectsData = [
    { title: 'Modern Corporate Lobby', imageFilename: 'portfolio-corporate-lobby.jpg', projectType: 'Offices', description: 'Custom planters, preserved wall, and focal tree installation.', order: 0 },
    { title: 'Fine Dining Restaurant', imageFilename: 'portfolio-restaurant.jpg', projectType: 'F&B', description: 'Living green wall with preserved moss accents.', order: 1 },
    { title: 'Private Villa Garden', imageFilename: 'portfolio-villa.jpg', projectType: 'Private Villa', description: 'Custom olive trees and Mediterranean plantscaping.', order: 2 },
    { title: 'Co-Working Space', imageFilename: 'portfolio-coworking.jpg', projectType: 'Offices', description: 'Biophilic design with desk planters and partition walls.', order: 3 },
  ]
  
  const existingProjects = homePage.portfolioSection?.projects || []
  const fixedProjects: any[] = []
  
  for (const projectData of portfolioProjectsData) {
    const existing = existingProjects.find((p: any) => p.title === projectData.title)
    let heroImageId = existing?.heroImage
    
    // Extract ID if it's an object
    if (typeof heroImageId === 'object' && heroImageId) {
      heroImageId = heroImageId.id || heroImageId
    }
    
    // If image is missing or invalid, find it
    if (!heroImageId || (typeof heroImageId === 'number' && heroImageId <= 0)) {
      const foundId = await findMediaByFilename(payload, projectData.imageFilename)
      if (foundId) {
        heroImageId = foundId
        console.log(`   ✅ Fixed image for: ${projectData.title}`)
      } else {
        console.log(`   ⚠️  Image not found: ${projectData.imageFilename} for ${projectData.title}`)
      }
    }
    
    if (heroImageId) {
      if (existing) {
        fixedProjects.push({
          ...existing,
          heroImage: heroImageId,
        })
      } else {
        fixedProjects.push({
          title: projectData.title,
          description: projectData.description,
          projectType: projectData.projectType,
          displayOrder: projectData.order,
          heroImage: heroImageId,
        })
      }
    } else if (existing) {
      // Keep existing even without image (don't lose data)
      fixedProjects.push(existing)
    }
  }
  
  console.log(`   ✅ Fixed ${fixedProjects.length} portfolio projects`)
  
  // Step 5: Update HomePage with all fixes
  console.log('\n📦 Step 5: Updating HomePage...')
  
  const updateData: any = {
    clientLogosSection: {
      ...homePage.clientLogosSection,
      logos: logos,
    },
    expertQuotesCarousel: {
      ...homePage.expertQuotesCarousel,
      quotes: newQuotes,
    },
    ourApproachSection: {
      ...homePage.ourApproachSection,
      approachPoints: newPoints,
    },
    portfolioSection: {
      ...homePage.portfolioSection,
      projects: fixedProjects,
    },
  }
  
  await payload.updateGlobal({
    slug: 'home-page',
    data: updateData,
  })
  
  // Verify
  const updated = await payload.findGlobal({ slug: 'home-page', depth: 2 })
  
  console.log('\n✨ All sections fixed!')
  console.log('\n📊 Final Status:')
  console.log(`   ✅ Client Logos: ${updated.clientLogosSection?.logos?.length || 0} logos`)
  console.log(`   ✅ Expert Quotes: ${updated.expertQuotesCarousel?.quotes?.length || 0} quotes`)
  console.log(`   ✅ Our Approach: ${updated.ourApproachSection?.approachPoints?.length || 0} points`)
  console.log(`   ✅ Why Choose Us: ${updated.whyChooseUsSection?.benefits?.length || 0} benefits`)
  console.log(`   ✅ Stats: ${updated.statsSection?.stats?.length || 0} stats`)
  console.log(`   ✅ Portfolio: ${updated.portfolioSection?.projects?.length || 0} projects`)
  const portfolioWithImages = (updated.portfolioSection?.projects || []).filter((p: any) => 
    p.heroImage && (typeof p.heroImage === 'object' ? p.heroImage.id : p.heroImage)
  ).length
  console.log(`      └─ ${portfolioWithImages} projects with images`)
  console.log(`   ✅ Differentiation: ${updated.differentiationSection?.comparisonPoints?.length || 0} points`)
  console.log(`   ⚠️  Hero Section: ${updated.heroSection?.slides?.length || 0} slides (add in admin)`)
  
  console.log('\n✅ All fixes complete! Refresh your frontend to see the sections.')
}

fixAllSections()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error('\n❌ Error:', error.message || error)
    if (error.message?.includes('invalid')) {
      console.error('\n💡 Tip: Make sure your dev server is running and database is stable')
    }
    process.exit(1)
  })

