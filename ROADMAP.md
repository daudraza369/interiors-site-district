# District Interiors - Payload CMS Implementation Roadmap

## 🎯 Project Overview
Build Payload CMS backend for District Interiors website, maintaining **EXACT** frontend design, fonts, content, and assets. No single change is acceptable.

---

## 📋 Implementation Checklist

### Phase 1: Setup & Configuration ✅
- [x] Install Payload CMS
- [x] Configure SQLite database (local development)
- [ ] Update Next.js config for standalone output (Docker/Coolify)
- [ ] Copy all fonts from remix-of-district-35 to Payload project
- [ ] Copy all assets/images from remix-of-district-35 to Payload project
- [ ] Setup Tailwind CSS with exact same config
- [ ] Setup environment variables

### Phase 2: Header & Footer (START HERE) 🎯
#### Header Global ✅
- [x] Create `Header` Global
  - Navigation items (DISTRICT, FLOWERS, GREENERY with dropdown, STYLING, COLLECTION)
  - Logo variants (brandmark, brandmark-night-green, brandmark-pear, logo-lockup, logo-lockup-night-green)
  - CTA button text ("VIEW OUR PORTFOLIO")
  - Mobile menu configuration
  - Transparent header logic for hero pages
  - Group: "Site Settings"

#### Footer Global ✅
- [x] Create `Footer` Global
  - Logo
  - Description text
  - Contact information:
    - Email: Sales@district.sa
    - Phone: +966 056 228 8177
    - WhatsApp: +966 50 060 6506
    - Address: Al Zoubair Ibn Al Awwam, Ar Rawabi, Riyadh 14214
    - Google Maps link
  - Social links (Instagram, TikTok, Snapchat)
  - Quick links section
  - Services links section
  - Copyright text
  - Privacy Policy & Terms links
  - Group: "Site Settings"

---

### Phase 3: Core Collections

#### 3.1 Projects Collection
- [ ] Create `Projects` collection
  - Fields:
    - `title` (text, required)
    - `slug` (text, unique, required)
    - `project_type` (select: Office, Hospitality, F&B, Villa)
    - `location` (text)
    - `description` (textarea)
    - `hero_image` (upload, relationship to Media)
    - `video_url` (text, optional)
    - `gallery` (array of uploads, relationship to Media)
    - `highlights` (array of text)
    - `services_used` (array of text)
    - `client_name` (text, optional)
    - `display_order` (number)
    - `is_published` (checkbox)

#### 3.2 Services Collection
- [ ] Create `Services` collection
  - Fields:
    - `title` (text, required)
    - `slug` (text, unique, required)
    - `short_description` (textarea)
    - `long_description` (rich text)
    - `hero_image` (upload, relationship to Media)
    - `icon` (text, optional)
    - `key_benefits` (array of objects: title, description)
    - `process_steps` (array of objects: step_number, title, description)
    - `display_order` (number)
    - `is_published` (checkbox)

#### 3.3 Collection Items Collection
- [ ] Create `CollectionItems` collection
  - Fields:
    - `name` (text, required)
    - `slug` (text, unique, required)
    - `category` (select: Trees, Flowers, Leaves/Foliage, Green Walls, Trunks & Branches, Planters)
    - `short_description` (textarea)
    - `images` (array of uploads, relationship to Media)
    - `price` (text, optional - e.g., "Price on Request", "From SAR 850")
    - `dimensions` (text, optional)
    - `materials` (text, optional)
    - `application` (text, optional)
    - `display_order` (number)
    - `is_published` (checkbox)

#### 3.4 Testimonials Collection
- [ ] Create `Testimonials` collection
  - Fields:
    - `client_name` (text, required)
    - `company` (text, optional)
    - `role` (text, optional)
    - `quote` (textarea, required)
    - `client_logo` (upload, relationship to Media, optional)
    - `display_order` (number)
    - `is_published` (checkbox)

#### 3.5 Client Logos Collection
- [ ] Create `ClientLogos` collection
  - Fields:
    - `client_name` (text, required)
    - `logo_url` (upload, relationship to Media, required)
    - `website_url` (text, optional)
    - `display_order` (number)
    - `is_published` (checkbox)

#### 3.6 Stats Collection
- [ ] Create `Stats` collection
  - Fields:
    - `label` (text, required)
    - `value` (text, required)
    - `unit` (text, optional - e.g., "+", "%", "Years")
    - `display_order` (number)

#### 3.7 Section Content Collection (Page Builder)
- [ ] Create `SectionContent` collection
  - Fields:
    - `page` (select: index, about, services, projects, collection, contact, hospitality, flowers, styling, tree-solutions)
    - `section_key` (text, required - unique identifier)
    - `section_name` (text, required)
    - `content` (JSON field for flexible content)
    - `is_published` (checkbox)

---

### Phase 4: Page-Specific Globals (ORGANIZED BY PAGE) 🎯

**IMPORTANT:** Each page gets its own Global with ALL sections organized within it. This keeps the admin very organized - one page = one admin section.

#### 4.1 Home Page Global ✅
- [x] Create `HomePage` Global (Group: "Pages")
  - [x] Hero Section (with slides array)
  - [x] Client Logos Section (references ClientLogos collection)
  - [x] Problem Framing Section
  - [x] Section Divider
  - [x] Expert Quotes Carousel
  - [x] Our Approach Section
  - [x] Why Choose Us Section
  - [x] Stats Section (references Stats collection)
  - [x] Portfolio Section (references Projects collection)
  - [x] Differentiation Section
  - [x] Tree Consultation Preview
  - [x] Testimonials Section (references Testimonials collection)
  - [x] Contact Section

#### 4.2 About Page Global
- [ ] Create `AboutPage` Global (Group: "Pages")
  - Hero Section
  - Story Section
  - Values Section
  - Team Section

#### 4.3 Services Page Global
- [ ] Create `ServicesPage` Global (Group: "Pages")
  - Hero Section
  - Services Grid (references Services collection)
  - CTA Section

#### 4.4 Projects Page Global
- [ ] Create `ProjectsPage` Global (Group: "Pages")
  - Hero Section
  - Category Filter Configuration
  - Projects Grid (references Projects collection)
  - Video Modal Settings

#### 4.5 Collection Page Global
- [ ] Create `CollectionPage` Global (Group: "Pages")
  - Hero Section
  - Category Filter Configuration
  - Collection Grid (references CollectionItems collection)

#### 4.6 Contact Page Global
- [ ] Create `ContactPage` Global (Group: "Pages")
  - Hero Section
  - Contact Form Configuration
  - Contact Information
  - Map Settings

#### 4.7 Hospitality Page Global
- [ ] Create `HospitalityPage` Global (Group: "Pages")
  - Hero Section
  - Coming Soon Content
  - CTA Buttons

#### 4.8 Flowers Page Global
- [ ] Create `FlowersPage` Global (Group: "Pages")
  - All sections (to be analyzed from Flowers.tsx)

#### 4.9 Styling Page Global
- [ ] Create `StylingPage` Global (Group: "Pages")
  - All sections (to be analyzed from Styling.tsx)

#### 4.10 Tree Solutions Page Global
- [ ] Create `TreeSolutionsPage` Global (Group: "Pages")
  - All sections (to be analyzed from TreeSolutions.tsx)

#### 4.2 Services Page
- [ ] Hero section
- [ ] Services grid (relationship to Services collection)
- [ ] CTA section

#### 4.3 Projects Page
- [ ] Hero section
- [ ] Category filter
- [ ] Projects grid (relationship to Projects collection)
- [ ] Video modal support

#### 4.4 Collection Page
- [ ] Hero section
- [ ] Category filter
- [ ] Collection grid (relationship to CollectionItems collection)

#### 4.5 About Page
- [ ] All sections (to be analyzed from About.tsx)

#### 4.6 Contact Page
- [ ] Contact form
- [ ] Map integration
- [ ] Contact information

#### 4.7 Hospitality Page
- [ ] All sections (to be analyzed from Hospitality.tsx)

#### 4.8 Flowers Page
- [ ] All sections (to be analyzed from Flowers.tsx)

#### 4.9 Styling Page
- [ ] All sections (to be analyzed from Styling.tsx)

#### 4.10 Tree Solutions Page
- [ ] All sections (to be analyzed from TreeSolutions.tsx)

---

### Phase 5: Frontend Integration

#### 5.1 Copy Frontend Components
- [ ] Copy all components from remix-of-district-35/src/components to Payload project
- [ ] Copy all pages from remix-of-district-35/src/pages to Payload project
- [ ] Copy hooks from remix-of-district-35/src/hooks
- [ ] Copy lib/utils.ts
- [ ] Copy index.css with all custom styles
- [ ] Copy tailwind.config.ts exactly

#### 5.2 Setup Routing
- [ ] Configure Next.js App Router
- [ ] Setup all routes matching remix-of-district-35 exactly:
  - `/` → Index
  - `/tree-solutions` → TreeSolutions
  - `/services` → Services
  - `/services/plantscaping` → Services
  - `/services/tree-customization` → Services
  - `/services/tree-restoration` → Services
  - `/services/green-walls` → Services
  - `/services/planters` → Services
  - `/services/maintenance` → Services
  - `/collection` → Collection
  - `/projects` → Projects
  - `/about` → About
  - `/contact` → Contact
  - `/hospitality` → Hospitality
  - `/flowers` → Flowers
  - `/styling` → Styling

#### 5.3 Data Fetching
- [ ] Replace Supabase calls with Payload API calls
- [ ] Create API utility functions
- [ ] Update all components to use Payload data
- [ ] Maintain exact same data structure

#### 5.4 Assets & Fonts
- [ ] Copy all fonts to public/fonts
- [ ] Copy all images to public/assets
- [ ] Update all image imports
- [ ] Verify all assets load correctly

---

### Phase 6: Database Migration Preparation

#### 6.1 PostgreSQL Setup (for Coolify)
- [ ] Install PostgreSQL adapter for Payload
- [ ] Create migration script from SQLite to PostgreSQL
- [ ] Test migration locally
- [ ] Document migration process

#### 6.2 Environment Configuration
- [ ] Setup .env.example with all required variables
- [ ] Configure database connection strings
- [ ] Setup media storage (local for now, S3 for production)
- [ ] Configure Payload secret

---

### Phase 7: Coolify Deployment Preparation

#### 7.1 Docker Configuration
- [ ] Verify Dockerfile is correct
- [ ] Update next.config.mjs for standalone output
- [ ] Test Docker build locally
- [ ] Create docker-compose.yml for local testing

#### 7.2 Environment Variables for Production
- [ ] Document all required env vars
- [ ] Setup production database connection
- [ ] Configure media storage (S3 or local volume)
- [ ] Setup domain configuration

#### 7.3 Build & Deploy Scripts
- [ ] Create build script
- [ ] Create deployment documentation
- [ ] Test production build locally

---

## 📝 Notes & Requirements

### Critical Rules:
1. **NO CHANGES** to frontend design, fonts, colors, or layout
2. **EXACT** same routing structure
3. **EXACT** same component structure
4. **EXACT** same assets and fonts
5. All content must be manageable through Payload CMS
6. Database must be easily migratable from SQLite to PostgreSQL

### Fonts to Copy:
- Kalice-Regular.woff / .woff2
- PPFragment-TextBold.woff / .woff2
- PPNeueMontrealArabic-Regular.woff / .woff2
- PPNeueMontrealArabic-SemiBold.woff / .woff2
- Santana.ttf
- Santana-Bold.ttf

### Assets to Copy:
All images from `remix-of-district-35/src/assets/` and `remix-of-district-35/public/`

### Database Tables Mapping:
- `projects` → Projects collection
- `services` → Services collection
- `collection_items` → CollectionItems collection
- `testimonials` → Testimonials collection
- `client_logos` → ClientLogos collection
- `stats` → Stats collection
- `section_content` → SectionContent collection
- `media_assets` → Media collection (built-in)

---

## 🚀 Next Steps

1. **START WITH HEADER** - Build Header Global in Payload
2. **THEN FOOTER** - Build Footer Global in Payload
3. **THEN DECIDE** which page to build first
4. Build collections one by one
5. Integrate frontend components
6. Test everything matches exactly
7. Prepare for Coolify deployment

---

## ✅ Progress Tracking

**Current Phase:** Phase 2 - Header & Footer
**Status:** Ready to start
**Next Action:** Create Header Global in Payload CMS

