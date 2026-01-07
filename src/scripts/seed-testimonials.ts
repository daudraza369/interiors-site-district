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

// Default testimonials matching reference repo
const defaultTestimonials = [
  {
    quote: "District transformed our corporate headquarters into a space that employees genuinely want to come to. The attention to detail and understanding of our brand was remarkable.",
    clientName: "Sarah Al-Rashid",
    role: "Facilities Director",
    company: "Aramco",
    displayOrder: 0,
    isPublished: true,
  },
  {
    quote: "From the initial consultation to the final installation, the professionalism was outstanding. Our hotel lobby has become a talking point for every guest.",
    clientName: "Mohammed Al-Faisal",
    role: "General Manager",
    company: "Four Seasons Riyadh",
    displayOrder: 1,
    isPublished: true,
  },
  {
    quote: "They didn't just add plants, they created an atmosphere. Our restaurant feels completely transformed, and customers notice the difference.",
    clientName: "Layla Hassan",
    role: "Owner",
    company: "Naya Restaurant",
    displayOrder: 2,
    isPublished: true,
  },
]

async function seedTestimonials() {
  console.log('🌱 Seeding Testimonials...\n')

  const payload = await getPayload({ config: config.default })

  // Check if testimonials already exist
  const existing = await payload.find({
    collection: 'testimonials',
    limit: 100,
  })

  if (existing.docs.length > 0) {
    console.log(`✅ ${existing.docs.length} testimonial(s) already exist. Skipping seed.`)
    console.log('💡 To add more, create them in Payload Admin → Testimonials')
    process.exit(0)
  }

  console.log('📝 Creating default testimonials...\n')

  for (const testimonial of defaultTestimonials) {
    try {
      const created = await payload.create({
        collection: 'testimonials',
        data: testimonial,
      })
      console.log(`   ✅ Created: ${created.clientName} (${created.company || 'No company'})`)
    } catch (error: any) {
      console.error(`   ❌ Error creating testimonial for ${testimonial.clientName}:`, error.message || error)
    }
  }

  console.log(`\n✨ Seed complete!`)
  console.log(`   📦 Created ${defaultTestimonials.length} testimonial(s)`)
  console.log('\n💡 Testimonials are now available in Payload Admin → Testimonials')
}

seedTestimonials()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))


