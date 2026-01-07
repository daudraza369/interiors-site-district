import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import fs from 'fs'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Testimonials } from './collections/Testimonials'
import { Projects } from './collections/Projects'
import { VirtualShowrooms } from './collections/VirtualShowrooms'
import { Services } from './collections/Services'
import { CollectionItems } from './collections/CollectionItems'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { HomePage } from './globals/HomePage'
import { ProjectsPage } from './globals/ProjectsPage'
import { ContactPage } from './globals/ContactPage'
import { ServicesPage } from './globals/ServicesPage'
import { TreeSolutionsPage } from './globals/TreeSolutionsPage'
import { AboutPage } from './globals/AboutPage'
import { CollectionPage } from './globals/CollectionPage'
import { FlowersPage } from './globals/FlowersPage'
import { HospitalityPage } from './globals/HospitalityPage'
import { StylingPage } from './globals/StylingPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Ensure database directory exists in production
const dbPath = process.env.DATABASE_URL?.replace('file:', '')
if (dbPath && process.env.NODE_ENV === 'production') {
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Testimonials, Projects, VirtualShowrooms, Services, CollectionItems],
  globals: [Header, Footer, HomePage, ProjectsPage, ContactPage, ServicesPage, TreeSolutionsPage, AboutPage, CollectionPage, FlowersPage, HospitalityPage, StylingPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
