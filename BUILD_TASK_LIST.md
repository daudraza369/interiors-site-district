# District Interiors - Build Task List

## ✅ COMPLETED

### Setup & Configuration
- [x] Payload CMS setup
- [x] Next.js configuration for Coolify deployment
- [x] Tailwind CSS setup (exact match with remix-of-district-35)
- [x] Fonts and assets copied
- [x] CSS/globals.css created and working
- [x] **FONT SIZES FIXED** - Using Tailwind classes (NOT clamp):
  - **h1**: `text-5xl md:text-6xl lg:text-7xl xl:text-8xl`
  - **h2**: `text-3xl md:text-4xl lg:text-5xl`
  - **h3**: `text-2xl md:text-3xl lg:text-4xl`
  - **h4**: `text-xl md:text-2xl`
  - **Hero subtitle**: `text-sm md:text-base`
  - **Hero description**: `text-xl md:text-2xl`
- [x] **REUSABLE PATTERN CREATED** - Section normalization and guards
  - Created `src/lib/cmsDefaults.ts` with `withDefaultsHomePage()`
  - Created `src/components/sections/SectionGuard.tsx`
  - Refactored TestimonialsSection and OurApproachSection as examples
  - Updated page.tsx to use normalization pattern
  - See `REUSABLE_PATTERN_RULES.md` for guidelines

### Backend (Payload CMS)
- [x] Header Global - Can edit navigation, logos, CTA from admin
- [x] Footer Global - Can edit contact info, social links, navigation from admin
- [x] HomePage Global - Structure created with all 13 sections

### Frontend Components
- [x] Header component (exact match with remix-of-district-35)
- [x] Footer component (exact match with remix-of-district-35)
- [x] **All Home Page Sections COMPLETED:**
  - [x] Hero Section (hardcoded for now)
  - [x] Client Logos Section ✅
  - [x] Problem Framing Section ✅
  - [x] Section Divider ✅
  - [x] Expert Quotes Carousel ✅
  - [x] Our Approach Section ✅ (refactored with SectionGuard)
  - [x] Why Choose Us Section ✅
  - [x] Stats Section ✅
  - [x] Portfolio Section ✅
  - [x] Differentiation Section ✅
  - [x] Tree Consultation Preview ✅
  - [x] Testimonials Section ✅ (refactored with SectionGuard)
  - [x] Contact Section ✅

---

## 🎯 NEXT STEPS - HOME PAGE (Priority 1)

### Phase 1: Home Page Sections (Build Frontend Components First)

#### Section 1: Hero Section
- [ ] **Frontend**: Build `HeroSection.tsx` component
  - Image carousel/slides
  - Title, eyebrow, subtitle, description
  - CTA buttons
  - Animations (framer-motion)
- [ ] **Backend**: Already in HomePage global (`heroSection` field)
- [ ] **Integration**: Connect frontend to Payload API

#### Section 2: Client Logos Section ✅ COMPLETED
- [x] **Backend**: Create `ClientLogos` collection
  - Fields: logo image, company name, link (optional), display order
- [x] **Frontend**: Build `ClientLogosSection.tsx` component
  - Logo marquee/carousel with seamless loop
  - Smooth animations (framer-motion)
  - Hover effects (grayscale to color)
- [ ] **Integration**: Connect frontend to Payload API (will do after all sections built)

#### Section 3: Problem Framing Section
- [ ] **Frontend**: Build `ProblemFramingSection.tsx` component
  - Headline, content, images
  - Layout matching remix-of-district-35
- [ ] **Backend**: Already in HomePage global (`problemFramingSection` field)
- [ ] **Integration**: Connect frontend to Payload API

#### Section 4: Section Divider
- [ ] **Frontend**: Build `SectionDivider.tsx` component
  - Transition text animation
  - Visual divider line
- [ ] **Backend**: Already in HomePage global (`sectionDivider` field)
- [ ] **Integration**: Connect frontend to Payload API

#### Section 5: Expert Quotes Carousel
- [ ] **Frontend**: Build `ExpertQuotesCarousel.tsx` component
  - Carousel with quotes
  - Author info, images
  - Auto-play and manual navigation
- [ ] **Backend**: Already in HomePage global (`expertQuotesCarousel` field)
- [ ] **Integration**: Connect frontend to Payload API

#### Section 6: Our Approach Section
- [ ] **Frontend**: Build `OurApproachSection.tsx` component
  - Headline, subheadline
  - Approach points grid
  - Images
- [ ] **Backend**: Already in HomePage global (`ourApproachSection` field)
- [ ] **Integration**: Connect frontend to Payload API

#### Section 7: Why Choose Us Section
- [ ] **Frontend**: Build `WhyChooseUsSection.tsx` component
  - Benefits grid
  - Icons/images
  - Animations
- [ ] **Backend**: Already in HomePage global (`whyChooseUsSection` field)
- [ ] **Integration**: Connect frontend to Payload API

#### Section 8: Stats Section
- [ ] **Backend**: Create `Stats` collection
  - Fields: number, label, description, icon (optional), display order
- [ ] **Frontend**: Build `StatsSection.tsx` component
  - Animated counters
  - Grid layout
- [ ] **Integration**: Connect to Payload API

#### Section 9: Portfolio Section
- [ ] **Backend**: Create `Projects` collection
  - Fields: title, project_type, location, description, hero_image, video_url, gallery_images, display_order, featured
- [ ] **Frontend**: Build `PortfolioSection.tsx` component
  - Project grid with hover effects
  - Filter by category
  - "View All Projects" CTA
- [ ] **Integration**: Connect to Payload API

#### Section 10: Differentiation Section ✅
- [x] **Frontend**: Build `DifferentiationSection.tsx` component
  - Comparison points table with District vs Others
  - Animated background gradients
  - Layout matching remix-of-district-35
- [x] **Backend**: Updated HomePage global (`differentiationSection` field) with default values
- [x] **Integration**: Connected frontend to Payload API
- [x] **Seed Script**: Created `seed-differentiation.ts` and added to `seed-all-data.ts`

#### Section 11: Tree Consultation Preview
- [ ] **Frontend**: Build `TreeConsultationPreview.tsx` component
  - Background image
  - Headline, description
  - CTA button
- [ ] **Backend**: Already in HomePage global (`treeConsultationPreview` field)
- [ ] **Integration**: Connect frontend to Payload API

#### Section 12: Testimonials Section
- [ ] **Backend**: Create `Testimonials` collection
  - Fields: quote, author name, author title, author image, company (optional), rating (optional), display order
- [ ] **Frontend**: Build `TestimonialsSection.tsx` component
  - Testimonial cards/carousel
  - Author info with images
- [ ] **Integration**: Connect to Payload API

#### Section 13: Contact Section
- [ ] **Frontend**: Build `ContactSection.tsx` component
  - Headline, subheadline
  - CTA button
  - Form (optional) or link to contact page
- [ ] **Backend**: Already in HomePage global (`contactSection` field)
- [ ] **Integration**: Connect frontend to Payload API

#### Home Page Assembly ✅ COMPLETED
- [x] Update `src/app/(frontend)/page.tsx` to include all sections
- [x] All 13 sections integrated and working
- [x] Reusable pattern implemented (SectionGuard + withDefaultsHomePage)
- [ ] Add WhatsApp button component (if needed - check reference repo)
- [x] Test all sections load correctly
- [x] Verify responsive design

---

## 📄 OTHER PAGES (Priority 2)

### Routes from Reference Repo (remix-of-district-35):
Based on `src/App.tsx`, the reference repo has these routes:
- `/` → Index (Home) ✅ COMPLETED
- `/tree-solutions` → TreeSolutions page
- `/services` → Services page (with subroutes: `/services/plantscaping`, `/services/tree-customization`, `/services/tree-restoration`, `/services/green-walls`, `/services/planters`, `/services/maintenance`)
- `/collection` → Collection page
- `/projects` → Projects page
- `/about` → About page
- `/contact` → Contact page
- `/hospitality` → Hospitality page
- `/flowers` → Flowers page
- `/styling` → Styling page

### Services Page ✅ COMPLETED
- [x] **Backend**: Create `Services` collection
  - Fields: title, slug, description, image, link, display order, isPublished
- [x] **Frontend**: Build Services page (`/services`)
  - Hero section with background image
  - Services grid with 6 services
  - CTA section with pattern overlay
- [x] **Routing**: Create Next.js route `/services`

### Collection Page
- [ ] **Backend**: Create `CollectionItems` collection
  - Fields: name, category, image, price, description, specifications, display order, featured
- [ ] **Frontend**: Build Collection page (`/collection`)
  - Filterable grid
  - Category filters
  - Item detail modal/page
- [ ] **Routing**: Create Next.js route `/collection`

### Projects Page ✅ COMPLETED
- [x] **Backend**: Create `Projects` collection
  - Fields: title, project_type, location, description, hero_image, video_url, gallery_images, display_order, featured
- [x] **Frontend**: Build Projects page (`/projects`)
  - Full project gallery
  - Filter by category
  - Video support with play button overlay
  - Virtual Showroom section
- [x] **Routing**: Create Next.js route `/projects`

### About Page
- [ ] **Backend**: Create `AboutPage` global
  - Fields: hero section, story sections, team members (optional), values
- [ ] **Frontend**: Build About page (`/about`)
  - Story sections
  - Team section (if applicable)
- [ ] **Routing**: Create Next.js route `/about`

### Contact Page ✅ COMPLETED
- [x] **Backend**: Create `ContactPage` global
  - Fields: headline, form fields, project types, office locations
- [x] **Frontend**: Build Contact page (`/contact`)
  - Contact form with dropdown options
  - Office info
- [x] **Routing**: Create Next.js route `/contact`

### Flowers Page
- [ ] **Frontend**: Build Flowers page (`/flowers`)
  - Flower collection display
  - Categories
- [ ] **Backend**: Uses `CollectionItems` with category filter
- [ ] **Routing**: Create Next.js route `/flowers`

### Hospitality Page
- [ ] **Frontend**: Build Hospitality page (`/hospitality`)
  - Hospitality-specific content
  - Project showcase
- [ ] **Backend**: Uses `Projects` collection with filter or create `HospitalityPage` global
- [ ] **Routing**: Create Next.js route `/hospitality`

### Styling Page
- [ ] **Frontend**: Build Styling page (`/styling`)
  - Styling services/content
- [ ] **Backend**: Create `StylingPage` global or use Services collection
- [ ] **Routing**: Create Next.js route `/styling`

### Tree Solutions Page ✅ COMPLETED
- [x] **Backend**: Create `TreeSolutionsPage` global
  - Hero section with background image
  - Process section (5-step timeline)
  - Materials section with features
  - Maintenance section
  - Consultation form with editable dropdown options
- [x] **Frontend**: Build Tree Solutions page (`/tree-solutions`)
  - All sections with animations
  - Consultation form with dynamic dropdowns
- [x] **Routing**: Create Next.js route `/tree-solutions`

---

## 🔧 ADDITIONAL COMPONENTS

### Shared Components
- [ ] WhatsApp Button component
- [ ] Scroll to Top component
- [ ] Loading states
- [ ] Error boundaries
- [ ] SEO components (metadata)

### Utilities
- [ ] API utility functions for Payload
- [ ] Image optimization helpers
- [ ] Form validation
- [ ] Animation hooks

---

## 🗄️ BACKEND COLLECTIONS SUMMARY

### Collections to Create:
1. **ClientLogos** - For client logos section
2. **Stats** - For stats section
3. **Projects** - For portfolio/projects (may already exist)
4. **Testimonials** - For testimonials section
5. **Services** - For services page (may already exist)
6. **CollectionItems** - For collection page

### Globals Already Created:
- ✅ Header
- ✅ Footer
- ✅ HomePage (structure ready, needs frontend integration)

### Globals to Create (for other pages):
- AboutPage
- ContactPage
- StylingPage (optional)
- TreeSolutionsPage (optional)

---

## 📋 RECOMMENDED BUILD ORDER

1. **Home Page Sections** (One by one, in order):
   - Hero Section
   - Client Logos Section
   - Problem Framing Section
   - Section Divider
   - Expert Quotes Carousel
   - Our Approach Section
   - Why Choose Us Section
   - Stats Section
   - Portfolio Section
   - Differentiation Section
   - Tree Consultation Preview
   - Testimonials Section
   - Contact Section

2. **Other Pages** (After Home Page is complete):
   - Services Page
   - Collection Page
   - Projects Page
   - About Page
   - Contact Page
   - Flowers, Hospitality, Styling, Tree Solutions

3. **Polish & Optimization**:
   - SEO optimization
   - Performance optimization
   - Mobile responsiveness
   - Accessibility
   - Testing

---

## ✅ ADMIN ACCESS CONFIRMATION

**YES, you can edit Header and Footer from Payload Admin!**

- Go to: `http://localhost:3003/admin`
- Navigate to: **Globals** → **Header** or **Footer**
- Edit all content, links, logos, contact info, etc.
- Changes will reflect on the frontend immediately

---

## 📝 NOTES

- Build one section at a time
- Test each section before moving to next
- Match remix-of-district-35 design exactly
- Ensure all animations work
- Make sure responsive design is perfect
- Connect to Payload API for dynamic content

