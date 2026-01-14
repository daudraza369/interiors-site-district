# Current Repository Structure - district-interiors

## 📄 Pages (Frontend Routes)

### Main Pages
1. **Home** (`/`) - `src/app/(frontend)/page.tsx`
   - Hero Section (carousel with slides)
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
   - Virtual Showroom Section

2. **About** (`/about`) - `src/app/(frontend)/about/page.tsx`
   - AboutPageClient.tsx

3. **Services** (`/services`) - `src/app/(frontend)/services/page.tsx`
   - ServicesPageClient.tsx
   - Service Sub-pages: `/services/[slug]` - ServiceSubPageClient.tsx

4. **Projects** (`/projects`) - `src/app/(frontend)/projects/page.tsx`

5. **Collection** (`/collection`) - `src/app/(frontend)/collection/page.tsx`
   - CollectionPageClient.tsx

6. **Flowers** (`/flowers`) - `src/app/(frontend)/flowers/page.tsx`
   - FlowersPageClient.tsx

7. **Tree Solutions** (`/tree-solutions`) - `src/app/(frontend)/tree-solutions/page.tsx`
   - TreeSolutionsPageClient.tsx

8. **Contact** (`/contact`) - `src/app/(frontend)/contact/page.tsx`
   - ContactPageClient.tsx

9. **Hospitality** (`/hospitality`) - `src/app/(frontend)/hospitality/page.tsx`
   - HospitalityPageClient.tsx

10. **Styling** (`/styling`) - `src/app/(frontend)/styling/page.tsx`
    - StylingPageClient.tsx

## 🧩 Components

### Layout Components
- `Header.tsx` - Main navigation header with dropdown menus
- `Footer.tsx` - Site footer

### Section Components
- `HeroSection.tsx` - Hero carousel with slides
- `ClientLogosSection.tsx` - Client logos marquee
- `ProblemFramingSection.tsx` - Problem cards with stats
- `SectionDivider.tsx` - Transition divider
- `ExpertQuotesCarousel.tsx` - Expert quotes carousel
- `OurApproachSection.tsx` - Approach points section
- `WhyChooseUsSection.tsx` - Benefits section
- `StatsSection.tsx` - Statistics display
- `PortfolioSection.tsx` - Portfolio projects grid
- `DifferentiationSection.tsx` - Comparison section
- `TreeConsultationPreview.tsx` - Tree solutions preview
- `TestimonialsSection.tsx` - Testimonials display
- `ContactSection.tsx` - Contact form section
- `VirtualShowroomSection.tsx` - 360° showroom section
- `ProjectsGallerySection.tsx` - Projects gallery
- `ProjectsHeroSection.tsx` - Projects page hero
- `ProjectCard.tsx` - Individual project card
- `VideoModal.tsx` - Video modal component
- `SectionGuard.tsx` - Conditional section wrapper

### UI Components
- `button.tsx` - Button component
- `input.tsx` - Input field
- `textarea.tsx` - Textarea field
- `select.tsx` - Select dropdown
- `toast.tsx` / `toaster.tsx` - Toast notifications
- `ScrollToTop.tsx` - Scroll to top button
- `WhatsAppButton.tsx` - WhatsApp floating button
- `LoadingSpinner.tsx` - Loading spinner
- `ErrorBoundary.tsx` - Error boundary

## 🗄️ Payload CMS Collections

1. **Media** - Media/upload collection
2. **Users** - User authentication
3. **ClientLogos** - Client logo entries
4. **Services** - Service entries
5. **Projects** - Project entries
6. **CollectionItems** - Collection item entries
7. **Testimonials** - Testimonial entries
8. **Stats** - Statistics entries
9. **VirtualShowrooms** - Virtual showroom entries

## 🌐 Payload CMS Globals

1. **HomePage** - Home page content (all sections)
2. **Header** - Header navigation and logos
3. **Footer** - Footer content
4. **AboutPage** - About page content
5. **ServicesPage** - Services page content
6. **ProjectsPage** - Projects page content
7. **CollectionPage** - Collection page content
8. **FlowersPage** - Flowers page content
9. **TreeSolutionsPage** - Tree solutions page content
10. **ContactPage** - Contact page content
11. **HospitalityPage** - Hospitality page content
12. **StylingPage** - Styling page content

## 🎨 Styling

- Tailwind CSS configuration
- Custom fonts: Kalice, Santana, PP Fragment, PP Neue Montreal
- Brand colors: night-green, slate-moss, stone, ivory, pear, etc.
- Custom CSS in `styles.css`

## 🔧 Key Features

- Next.js 15 with App Router
- Payload CMS 3.0 for content management
- SQLite database (with PostgreSQL migration support)
- Dynamic rendering for CMS content
- Media file serving via custom API route
- Image optimization with Next.js Image
- Responsive design
- Animations with Framer Motion
- WhatsApp integration
- Virtual showroom support (360°)

## 📁 Directory Structure

```
src/
├── app/
│   ├── (frontend)/          # Public-facing pages
│   │   ├── page.tsx         # Home page
│   │   ├── about/
│   │   ├── services/
│   │   ├── projects/
│   │   ├── collection/
│   │   ├── flowers/
│   │   ├── tree-solutions/
│   │   ├── contact/
│   │   ├── hospitality/
│   │   └── styling/
│   └── (payload)/           # Payload admin
│       └── admin/
├── components/
│   ├── layout/              # Header, Footer
│   ├── sections/            # Page sections
│   └── ui/                  # UI components
├── collections/             # Payload collections
├── globals/                 # Payload globals
├── lib/                     # Utilities
└── assets/                  # Static assets
```

## 🚀 Navigation Structure

From Header.tsx:
- DISTRICT (Home) - `/`
- FLOWERS - `/flowers`
- GREENERY (dropdown):
  - PLANTSCAPING - `/services/plantscaping`
  - TREE SOLUTIONS - `/tree-solutions`
  - PLANT MAINTENANCE - `/services/maintenance`
  - CUSTOM PLANTERS - `/services/planters`
  - GREEN WALLS - `/services/green-walls`
- STYLING - `/styling`
- COLLECTION - `/collection`

## 📝 Notes

- All pages use dynamic rendering (`export const dynamic = 'force-dynamic'`)
- Media URLs are normalized via `getMediaUrl()` utility
- Custom media API route at `/api/media/file/[filename]`
- Server-side rendering for SEO
- CMS-driven content throughout



