# Detailed Migration Task List: remix-of-district-55 → district-interiors

## 🎯 **CRITICAL: Current State on Coolify (DO NOT BREAK)**

### What's Currently Working on Coolify:
1. ✅ **Header Navigation**: DISTRICT | FLOWERS | GREENERY | STYLING | COLLECTION
2. ✅ **Pages**: All pages functional with CMS integration
3. ✅ **Client Logos Section**: Working with current structure
4. ✅ **Media Files**: All images serving correctly
5. ✅ **CMS Collections**: All Payload collections configured
6. ✅ **Database**: SQLite with all content

### ⚠️ **DO NOT TOUCH (Keep as-is):**
- Database structure
- Existing CMS collections/globals
- Media files
- Page routes (except renaming styling → design)
- Existing component functionality

---

## 📋 **Changes Required (New Repo vs Current Coolify)**

### **1. HEADER NAVIGATION CHANGES**

#### Current (Coolify):
```typescript
const navItems = [
  { label: 'DISTRICT', href: '/' },
  { label: 'FLOWERS', href: '/flowers' },
  { label: 'GREENERY', href: '/services', children: [...] },
  { label: 'STYLING', href: '/styling' },  // ← CHANGE THIS
  { label: 'COLLECTION', href: '/collection' },
]
```

#### New (remix-of-district-55):
```typescript
const navItems = [
  { label: 'DISTRICT', href: '/' },
  { label: 'FLOWERS', href: '/flowers' },
  { label: 'GREENERY', href: '/services', children: [...] },
  { label: 'DESIGN', href: '/design' },  // ← NEW
  { label: 'COLLECTION', href: '/collection' },
]
```

**Task 1.1: Update Header Navigation**
- [ ] Change `STYLING` → `DESIGN` in `src/components/layout/Header.tsx`
- [ ] Update route from `/styling` → `/design`
- [ ] Update `HERO_PAGES` array to include `/design` instead of `/styling`
- [ ] Keep all other header functionality intact

**Task 1.2: Rename Styling Page to Design**
- [ ] Rename `src/app/(frontend)/styling/` → `src/app/(frontend)/design/`
- [ ] Rename `StylingPageClient.tsx` → `DesignPageClient.tsx`
- [ ] Update all imports referencing styling page
- [ ] Update Payload global: `StylingPage` → `DesignPage` (or keep name, just update route)
- [ ] **IMPORTANT**: Update CMS global slug OR keep it as `styling-page` but route to `/design`

---

### **2. CLIENT LOGOS SECTION UPDATE**

#### Current Structure (Coolify):
- Uses `ClientLogosSection` component
- Props: `enabled`, `headline`, `maxLogos`, `logos[]`
- Styling: grayscale with hover effects
- Animation: logo-scroll with 35s duration

#### New Structure (remix-of-district-55):
- Same component structure
- **Key Differences**:
  1. Header text: "TRUSTED BY GLOBAL LEADERS" + "Transforming the Region's Premier Work Spaces"
  2. Logo styling: Uses `brightness-0` instead of `grayscale`
  3. Animation: 40s duration instead of 35s
  4. Logo item height: `h-12 md:h-14` instead of `h-16`
  5. Logo max width: `max-w-[160px] md:max-w-[200px]` instead of `w-32 md:w-40`

**Task 2.1: Update ClientLogosSection Component**
- [ ] Update header text structure to match new version
- [ ] Change `grayscale` → `brightness-0` for logo styling
- [ ] Update animation duration: 35s → 40s
- [ ] Update logo container height: `h-16` → `h-12 md:h-14`
- [ ] Update logo max width: `w-32 md:w-40` → `max-w-[160px] md:max-w-[200px]`
- [ ] Keep all CMS integration intact (props, data fetching)

**Task 2.2: Verify HomePage Global**
- [ ] Check `HomePage` global has `clientLogosSection` configured
- [ ] Ensure headline matches new version or is editable in CMS
- [ ] Test that logos still load from CMS

---

### **3. FLOWERS PAGE UPDATE**

#### Current (Coolify):
- Has `FlowersPage` global
- Uses `FlowersPageClient` component
- Route: `/flowers`

#### New (remix-of-district-55):
- New Flowers page structure
- Different sections/layout
- Header has special styling for flowers page (ivory/lavender theme)

**Task 3.1: Analyze New Flowers Page**
- [ ] Read `remix-of-district-55/src/pages/Flowers.tsx`
- [ ] Compare with current `district-interiors/src/app/(frontend)/flowers/FlowersPageClient.tsx`
- [ ] Document all section differences
- [ ] Create task list for Flowers page updates (separate task)

**Task 3.2: Update Header for Flowers Page**
- [ ] Add flowers page special styling (ivory/lavender theme)
- [ ] Update logo variants for flowers page
- [ ] Update CTA button text: "BUY FLOWERS IN BULK" on flowers page
- [ ] Keep all other header functionality

---

### **4. DESIGN PAGE (Formerly Styling)**

#### Current (Coolify):
- Route: `/styling`
- Global: `StylingPage`
- Component: `StylingPageClient`

#### New (remix-of-district-55):
- Route: `/design`
- Same structure (likely, need to verify)

**Task 4.1: Verify Design Page Structure**
- [ ] Check if new repo has Design page (might be same as Styling)
- [ ] Compare structure if exists
- [ ] Update route and component names
- [ ] Update CMS global if needed

---

### **5. HEADER ENHANCEMENTS (New Repo)**

#### New Features in Header:
1. **Flowers Page Special Styling**:
   - Ivory/lavender theme
   - Different logo variants
   - Special CTA button text

2. **Enhanced Dropdown Animations**:
   - Better AnimatePresence usage
   - Improved motion transitions

3. **Mobile Menu Improvements**:
   - Better scroll handling
   - Fixed header with scrollable content

**Task 5.1: Implement Header Enhancements**
- [ ] Add flowers page detection and special styling
- [ ] Update logo variants for flowers page
- [ ] Improve dropdown animations
- [ ] Enhance mobile menu scroll handling
- [ ] Keep all existing functionality

---

## 🔄 **IMPLEMENTATION ORDER (Critical - Follow This)**

### **Phase 1: Header Navigation (Low Risk)**
1. Update header navItems: STYLING → DESIGN
2. Update route: /styling → /design
3. Rename page directory and component
4. Test header navigation

### **Phase 2: Client Logos Section (Medium Risk)**
1. Update ClientLogosSection component styling
2. Update animation duration
3. Update header text structure
4. Test with existing CMS data

### **Phase 3: Header Enhancements (Medium Risk)**
1. Add flowers page special styling
2. Update logo variants
3. Enhance dropdown animations
4. Test all pages

### **Phase 4: Flowers Page (High Risk - Do Last)**
1. Analyze new Flowers page structure
2. Create detailed comparison
3. Update Flowers page (separate task list)
4. Test thoroughly

---

## ✅ **PRE-DEPLOYMENT CHECKLIST**

Before deploying to Coolify, verify:

- [ ] All routes work: `/`, `/flowers`, `/services`, `/design`, `/collection`
- [ ] Header navigation works on all pages
- [ ] Client logos section displays correctly
- [ ] No broken links or 404 errors
- [ ] CMS admin still works (all globals accessible)
- [ ] Media files still load correctly
- [ ] Database schema unchanged (no migrations needed)
- [ ] All existing content still visible
- [ ] Mobile menu works correctly
- [ ] No console errors

---

## 📝 **FILES TO UPDATE**

### **Must Update:**
1. `src/components/layout/Header.tsx` - Navigation items, flowers page styling
2. `src/components/sections/ClientLogosSection.tsx` - Styling updates
3. `src/app/(frontend)/styling/` → Rename to `design/`
4. `src/globals/StylingPage.ts` → May need to update or keep as-is

### **May Need Updates:**
1. `src/app/(frontend)/flowers/FlowersPageClient.tsx` - If structure changed
2. Route configuration files
3. Any imports referencing `/styling` route

### **DO NOT TOUCH:**
1. Database files
2. Media files
3. CMS collection schemas (unless adding new fields)
4. Existing component logic (only styling/structure)

---

## 🚨 **CRITICAL WARNINGS**

1. **DO NOT** delete or rename CMS globals/collections without migration plan
2. **DO NOT** change database schema
3. **DO NOT** remove existing functionality
4. **DO NOT** break existing routes
5. **DO NOT** update all at once - follow phase order
6. **ALWAYS** test locally before deploying
7. **ALWAYS** backup database before major changes

---

## 📊 **COMPARISON SUMMARY**

| Feature | Current (Coolify) | New (remix-of-district-55) | Action |
|---------|------------------|---------------------------|--------|
| Header: STYLING | ✅ `/styling` | ❌ → DESIGN `/design` | Rename route & nav |
| Client Logos | ✅ Current styling | ⚠️ Updated styling | Update component |
| Flowers Page | ✅ Current structure | ⚠️ New structure | Analyze & update |
| Header Flowers Theme | ❌ None | ✅ Ivory/lavender | Add special styling |
| Design Page | ❌ Doesn't exist | ✅ `/design` route | Rename from Styling |

---

## 🎯 **NEXT STEPS**

1. **Start with Phase 1**: Header navigation (safest, least risk)
2. **Then Phase 2**: Client logos section
3. **Then Phase 3**: Header enhancements
4. **Finally Phase 4**: Flowers page (most complex)

**DO NOT PROCEED** until you've reviewed this entire document and understand the scope.

