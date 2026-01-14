# Migration Task List: remix-of-district-55 → district-interiors

## 📋 Analysis Summary

### Tech Stack Differences
- **New Repo**: Vite + React + Supabase + React Router
- **Current Repo**: Next.js 15 + Payload CMS + SQLite
- **Migration Strategy**: Convert React Router pages to Next.js App Router, keep Payload CMS

### Key Differences Found

#### 1. New Section Components (Need to Create)
- ✅ `AboutSnapshotSection.tsx` - About page snapshot section
- ✅ `DualCTASection.tsx` - Dual CTA section (Interior Plantscaping / Tree Customization)
- ✅ `GallerySection.tsx` - Gallery grid with video/image items
- ✅ `MaintenanceSection.tsx` - Maintenance service section
- ✅ `ServicesSection.tsx` - Services grid component
- ✅ `CollectionPreviewSection.tsx` - Collection preview section

#### 2. Page Structure Updates Needed

**About Page:**
- Current: Uses AboutPageClient with CMS data
- New: Hero + Story + Values + Team sections (hardcoded)
- Action: Update to match new structure, make CMS-driven

**Services Page:**
- Current: Uses ServicesPageClient with CMS data
- New: Simple Hero + Services Grid + CTA (hardcoded services array)
- Action: Update to match new simpler structure

**Projects Page:**
- Current: Basic projects gallery
- New: Enhanced with GallerySection, better video modal, magnetic hover effects
- Action: Update Projects page with new GallerySection

**Collection Page:**
- Current: Uses CollectionPageClient
- New: Enhanced masonry grid with image modal, better animations
- Action: Update Collection page with new features

**Home Page:**
- Current: Same sections, different order
- New: Same sections, same order (verified)
- Action: Verify order matches

## 🎯 Implementation Plan

### Phase 1: Create New Section Components
1. Create `AboutSnapshotSection.tsx`
2. Create `DualCTASection.tsx`
3. Create `GallerySection.tsx`
4. Create `MaintenanceSection.tsx`
5. Create `ServicesSection.tsx`
6. Create `CollectionPreviewSection.tsx`

### Phase 2: Update Pages
1. Update About page structure
2. Update Services page structure
3. Update Projects page with GallerySection
4. Update Collection page enhancements
5. Verify Home page order

### Phase 3: CMS Integration
1. Add Payload globals/fields for new sections if needed
2. Update page clients to use CMS data
3. Test all pages

### Phase 4: Testing
1. Test all updated pages
2. Verify CMS integration works
3. Check responsive design
4. Verify animations work

## 🚀 Starting Point

**I'll start with Phase 1: Creating the new section components**, as these are reusable and will be needed by multiple pages.



