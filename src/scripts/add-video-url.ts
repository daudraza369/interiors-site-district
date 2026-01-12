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

// Get video URL from command line argument or environment variable
const videoUrl = process.argv[2] || process.env.PROJECT_SUN_VIDEO_URL

if (!videoUrl) {
  console.error('❌ Video URL is required!')
  console.error('')
  console.error('Usage:')
  console.error('  npm run add:video-url "https://example.com/video.mp4"')
  console.error('')
  console.error('Or set PROJECT_SUN_VIDEO_URL in your .env file:')
  console.error('  PROJECT_SUN_VIDEO_URL=https://example.com/video.mp4')
  console.error('  npm run add:video-url')
  process.exit(1)
}

// Now dynamically import Payload after .env is loaded
const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function addVideoUrl() {
  console.log('🎬 Adding video URL to "sun" project...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Find the "sun" project
    const result = await payload.find({
      collection: 'projects',
      where: {
        title: {
          equals: 'sun',
        },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      console.error('❌ Project "sun" not found!')
      console.error('   Run: npm run seed:projects first')
      process.exit(1)
    }

    const project = result.docs[0]
    console.log(`✅ Found project: "${project.title}" (ID: ${project.id})`)
    console.log(`   Current video URL: ${project.videoUrl || '(none)'}`)
    console.log(`   New video URL: ${videoUrl}\n`)

    // Update the project with the video URL
    await payload.update({
      collection: 'projects',
      id: project.id,
      data: {
        videoUrl: videoUrl,
      },
    })

    console.log(`✅ Successfully updated "sun" project with video URL!`)
    console.log(`   Video URL: ${videoUrl}`)
    console.log(`\n✨ You can now see the video play button on the Projects page!`)
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  }
}

addVideoUrl()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))



