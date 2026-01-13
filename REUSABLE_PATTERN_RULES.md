# Reusable Pattern Rules for New Pages

## Overview

To prevent sections from "vanishing" when data is empty or schema changes, we use a standardized pattern:

1. **Normalize CMS data at fetch boundary** using `withDefaultsHomePage()`
2. **Guard sections with `SectionGuard`** component
3. **Never early-return null on empty arrays** in components

---

## Rules Checklist

### ✅ Rule 1: Normalize Data at Fetch Boundary
- **Always** use `withDefaultsHomePage(homePageData)` after fetching from Payload
- Ensures every section object exists
- Ensures every array becomes `[]` if missing
- Ensures `enabled` defaults to `true` unless explicitly `false`

### ✅ Rule 2: Use SectionGuard Component
- **Always** wrap section content in `<SectionGuard>` component
- Pass `enabled={section?.enabled ?? true}`
- Pass `hasData={array?.length > 0}` or appropriate data check
- **Never** use conditional rendering like `{section?.enabled !== false && <Section />}` in page.tsx

### ✅ Rule 3: No Early Returns on Empty Data
- **Never** do: `if (!items || items.length === 0) return null`
- **Never** do: `if (!enabled || items.length === 0) return null`
- **Only** return null if `enabled === false` (SectionGuard handles this)
- Let SectionGuard handle empty state

### ✅ Rule 4: Always Provide Safe Defaults
- Use fallback data inside components if needed (e.g., `const displayData = items || fallbackItems`)
- But still pass `hasData` to SectionGuard based on actual data
- Components should gracefully handle empty arrays

---

## File Structure

```
src/
├── lib/
│   └── cmsDefaults.ts          # Normalization functions
├── components/
│   └── sections/
│       ├── SectionGuard.tsx    # Reusable guard component
│       └── YourSection.tsx     # Section components
└── app/
    └── (frontend)/
        └── page.tsx            # Page using the pattern
```

---

## Implementation Pattern

### 1. In page.tsx (Fetch Boundary)

```typescript
import { withDefaultsHomePage } from '@/lib/cmsDefaults'

// After fetching from Payload
const homePage = await payload.findGlobal({ slug: 'home-page' })
const normalizedHomePage = withDefaultsHomePage(homePage)

// In component render
<YourSection
  enabled={normalizedHomePage.yourSection?.enabled ?? true}
  items={normalizedHomePage.yourSection?.items || []}
/>
```

### 2. In Section Component

```typescript
import { SectionGuard } from './SectionGuard'

export function YourSection({
  enabled = true,
  items = [],
}: YourSectionProps) {
  const hasData = items.length > 0
  
  // REMOVED: if (!enabled || items.length === 0) return null
  
  return (
    <SectionGuard enabled={enabled} hasData={hasData}>
      <section>
        {/* Your content */}
        {items.map(...)}
      </section>
    </SectionGuard>
  )
}
```

### 3. Creating Normalization Functions for New Pages

```typescript
// src/lib/cmsDefaults.ts

export function withDefaultsYourPage(pageData: YourPageData | null | undefined): YourPageData {
  if (!pageData) {
    return getDefaultYourPage()
  }

  return {
    section1: {
      enabled: pageData.section1?.enabled ?? true,
      items: pageData.section1?.items || [],
      ...pageData.section1,
    },
    section2: {
      enabled: pageData.section2?.enabled ?? true,
      data: pageData.section2?.data || [],
      ...pageData.section2,
    },
    // ... all sections
  }
}
```

---

## Example: Refactored Section

### Before (BAD):
```typescript
export function TestimonialsSection({ enabled, testimonials }) {
  const display = testimonials || fallback
  
  if (!enabled || display.length === 0) {
    return null  // ❌ Section vanishes
  }
  
  return <section>...</section>
}

// In page.tsx
{homePage.testimonialsSection?.enabled !== false && (
  <TestimonialsSection ... />
)}
```

### After (GOOD):
```typescript
export function TestimonialsSection({ enabled, testimonials }) {
  const display = testimonials || fallback
  const hasData = display.length > 0
  
  return (
    <SectionGuard enabled={enabled} hasData={hasData}>
      <section>...</section>
    </SectionGuard>
  )
}

// In page.tsx
<TestimonialsSection
  enabled={normalizedHomePage.testimonialsSection?.enabled ?? true}
  testimonials={testimonials}
/>
```

---

## Benefits

1. **Sections never vanish unexpectedly** - Only hide when explicitly `enabled: false`
2. **Schema changes are safe** - Defaults prevent crashes
3. **Consistent behavior** - All pages follow same pattern
4. **Easy debugging** - Empty state is handled consistently
5. **Better UX** - Sections can show placeholders/fallbacks instead of disappearing

---

## Migration Checklist for New Pages

- [ ] Create `withDefaultsYourPage()` function in `cmsDefaults.ts`
- [ ] Use normalization at fetch boundary in page.tsx
- [ ] Wrap all sections in `<SectionGuard>`
- [ ] Remove all `if (enabled !== false && <Section>)` conditionals from page.tsx
- [ ] Remove all `if (!items || items.length === 0) return null` from components
- [ ] Test with empty data
- [ ] Test with `enabled: false`
- [ ] Test with schema changes




