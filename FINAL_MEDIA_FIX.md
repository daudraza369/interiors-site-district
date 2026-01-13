# Final Media Fix - Run This

## Copy and paste this ENTIRE block into Coolify Terminal:

```bash
cd /app && cat > fix-media-now.ts << 'ENDOFFILE'
import path from 'path'
import fs from 'fs'

// Read .env manually (no dotenv dependency needed)
const rootDir = '/app'
const envPath = path.join(rootDir, '.env')
const env: Record<string, string> = {}
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8')
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      env[key] = value
      process.env[key] = value
    }
  })
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET not set')
  process.exit(1)
}

const sourceMap: Record<string, string> = {
  'amazon': 'logos/amazon.png', 'linklaters': 'logos/linklaters.png',
  'pepsico': 'logos/pepsico.png', 'simah': 'logos/simah.png',
  'tahakom': 'logos/tahakom.svg', 'hero-interior': 'hero-interior.jpg',
  'hotel-atrium': 'hotel-atrium.jpg', 'restaurant-plants': 'restaurant-plants.jpg',
  'district-brandmark': 'district-brandmark.png',
  'district-brandmark-night-green': 'district-brandmark-night-green.png',
  'district-brandmark-pear': 'district-brandmark-pear.png',
  'district-logo-lockup': 'district-logo-lockup.png',
  'district-logo-lockup-night-green': 'district-logo-lockup-night-green.png',
  'district-logo': 'district-logo.png',
  'portfolio-corporate-lobby': 'portfolio-corporate-lobby.jpg',
  'portfolio-coworking': 'portfolio-coworking.jpg',
  'portfolio-hotel-atrium': 'portfolio-hotel-atrium.jpg',
  'portfolio-mall': 'portfolio-mall.jpg', 'portfolio-restaurant': 'portfolio-restaurant.jpg',
  'portfolio-villa': 'portfolio-villa.jpg', 'plantscaping-service': 'plantscaping-service.jpg',
  'tree-customization-service': 'tree-customization-service.jpg',
  'tree-restoration-service': 'tree-restoration-service.jpg',
  'custom-planter-service': 'custom-planter-service.jpg',
  'maintenance-service': 'maintenance-service.jpg', 'maintenance-tech': 'maintenance-tech.jpg',
  'green-wall': 'green-wall.jpg', 'collection-ficus-tree': 'collection-ficus-tree.jpg',
  'collection-olive-tree': 'collection-olive-tree.jpg',
  'collection-palm-tree': 'collection-palm-tree.jpg',
  'flowers-collection': 'flowers-collection.jpg',
  'flowers-catalog-preview': 'flowers-catalog-preview.png',
  'olive-tree': 'olive-tree.jpg', 'planters': 'planters.jpg',
  'tree-detail': 'tree-detail.jpg', 'showroom-kahwet-azmi': 'showroom-kahwet-azmi.png',
  'showroom-cilicia': 'showroom-cilicia.png', 'showroom-bayaz': 'showroom-bayaz.png',
}

function getBaseName(f: string) { return f.replace(/\.[^.]+$/, '').replace(/-\d+$/, '') }
function findSource(f: string, assetsDir: string) {
  const base = getBaseName(f)
  const src = sourceMap[base]
  if (!src) return null
  const p1 = path.join(assetsDir, src)
  if (fs.existsSync(p1)) return p1
  const p2 = path.join(assetsDir, path.basename(src))
  return fs.existsSync(p2) ? p2 : null
}

(async () => {
  const { getPayload } = await import('payload')
  const config = await import('@payload-config')
  const assetsDir = path.join(rootDir, 'src', 'assets')
  const mediaDir = path.join(rootDir, 'media')
  
  console.log('🔧 Fixing media filenames...\n')
  const payload = await getPayload({ config: config.default })
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true })
  const { docs } = await payload.find({ collection: 'media', limit: 1000 })
  console.log(`📦 Found ${docs.length} media entries\n`)
  
  let c = 0, s = 0, n = 0
  for (const m of docs) {
    if (!m.filename) { s++; continue }
    const src = findSource(m.filename, assetsDir)
    if (!src) { n++; continue }
    const dest = path.join(mediaDir, m.filename)
    if (fs.existsSync(dest)) {
      if (fs.statSync(src).size === fs.statSync(dest).size) { s++; continue }
    }
    try {
      const dir = path.dirname(dest)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      fs.copyFileSync(src, dest)
      console.log(`✅ ${path.basename(src)} → ${m.filename}`)
      c++
    } catch (e: any) {
      console.error(`❌ ${m.filename}: ${e.message}`)
      n++
    }
  }
  console.log(`\n✨ Done! Copied: ${c}, Skipped: ${s}, Not found: ${n}`)
})().then(() => process.exit(0)).catch(e => { console.error('💥', e); process.exit(1) })
ENDOFFILE
npx tsx fix-media-now.ts
```

## After it completes:

1. **Restart the app** in Coolify
2. **Verify files:**
   ```bash
   ls -la /app/media | head -20
   ```

You should see files like `amazon-33.png`, `linklaters-33.png`, etc.



