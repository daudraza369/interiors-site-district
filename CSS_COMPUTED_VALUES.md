# Computed CSS Values Analysis

## CSS Class Definitions & File Paths

### 1. `.section-padding`

**Definition Location:**
- **File**: `district-interiors/src/app/(frontend)/styles.css`
- **Line**: 195-197
- **Definition**:
```css
.section-padding {
  @apply py-20 md:py-28 lg:py-36 px-6 md:px-12 lg:px-20;
}
```

**Computed Values (Tailwind → CSS):**
- `py-20` = `padding-top: 5rem` (80px) / `padding-bottom: 5rem` (80px)
- `md:py-28` = `@media (min-width: 768px) { padding-top: 7rem` (112px) / `padding-bottom: 7rem` (112px) }
- `lg:py-36` = `@media (min-width: 1024px) { padding-top: 9rem` (144px) / `padding-bottom: 9rem` (144px) }
- `px-6` = `padding-left: 1.5rem` (24px) / `padding-right: 1.5rem` (24px)
- `md:px-12` = `@media (min-width: 768px) { padding-left: 3rem` (48px) / `padding-right: 3rem` (48px) }
- `lg:px-20` = `@media (min-width: 1024px) { padding-left: 5rem` (80px) / `padding-right: 5rem` (80px) }

**Import Path:**
- Imported in: `district-interiors/src/app/(frontend)/layout.tsx` (line 2: `import '../globals.css'`)
- Note: `styles.css` is NOT directly imported. Only `globals.css` is imported in the layout.

**Reference Repo:**
- **File**: `remix-of-district-51/src/index.css`
- **Line**: 195-197
- **Definition**: Same as above

---

### 2. `.container-luxury`

**Definition Location:**
- **File**: `district-interiors/src/app/(frontend)/styles.css`
- **Line**: 199-201
- **Definition**:
```css
.container-luxury {
  @apply max-w-7xl mx-auto;
}
```

**Computed Values (Tailwind → CSS):**
- `max-w-7xl` = `max-width: 80rem` (1280px)
- `mx-auto` = `margin-left: auto` / `margin-right: auto`

**Alternative Definition (in globals.css):**
- **File**: `district-interiors/src/app/globals.css`
- **Line**: 342-347
- **Definition**:
```css
.container-luxury {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: 80rem; /* max-w-7xl = 1280px */
}
```

**Import Path:**
- `globals.css` imported in: `district-interiors/src/app/(frontend)/layout.tsx` (line 2)
- `styles.css` is NOT imported anywhere (orphaned file)

**Reference Repo:**
- **File**: `remix-of-district-51/src/index.css`
- **Line**: 199-201
- **Definition**: Same as `styles.css` version

---

### 3. Hero `h1` Typography

**Definition Location:**
- **File**: `district-interiors/src/app/(frontend)/styles.css`
- **Line**: 168-171
- **Definition**:
```css
h1 {
  font-size: clamp(2.5rem, 5vw + 1rem, 6rem);
  @apply uppercase tracking-tight leading-none;
}
```

**Alternative Definition (in globals.css):**
- **File**: `district-interiors/src/app/globals.css`
- **Line**: 212-214
- **Definition**:
```css
h1 {
  @apply text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase tracking-tight leading-none;
}
```

**Computed Values:**

**From `styles.css` (clamp version):**
- `font-size: clamp(2.5rem, 5vw + 1rem, 6rem)`
  - Minimum: `2.5rem` (40px)
  - Preferred: `5vw + 1rem` (scales with viewport)
  - Maximum: `6rem` (96px)
- `text-transform: uppercase`
- `letter-spacing: -0.025em` (tracking-tight)
- `line-height: 1` (leading-none)

**From `globals.css` (Tailwind classes version):**
- `text-5xl` = `font-size: 3rem` (48px)
- `md:text-6xl` = `@media (min-width: 768px) { font-size: 3.75rem` (60px) }
- `lg:text-7xl` = `@media (min-width: 1024px) { font-size: 4.5rem` (72px) }
- `xl:text-8xl` = `@media (min-width: 1280px) { font-size: 6rem` (96px) }
- `text-transform: uppercase`
- `letter-spacing: -0.025em` (tracking-tight)
- `line-height: 1` (leading-none)

**Import Path:**
- `globals.css` imported in: `district-interiors/src/app/(frontend)/layout.tsx` (line 2)
- `styles.css` is NOT imported (orphaned file)

**Reference Repo:**
- **File**: `remix-of-district-51/src/index.css`
- **Line**: 195-197 (section-padding), 199-201 (container-luxury)
- **h1 Definition**: Uses clamp version (same as `styles.css`)

---

## Critical Issue: CSS File Import Mismatch

### Problem:
1. **`styles.css`** defines `.section-padding`, `.container-luxury`, and `h1` with `clamp()` for responsive typography
2. **`globals.css`** also defines `.container-luxury` and `h1` but with Tailwind classes
3. **Only `globals.css` is imported** in `layout.tsx`
4. **`styles.css` is NOT imported anywhere** - it's an orphaned file!

### Which CSS is Actually Applied?

**Currently Active (imported):**
- `district-interiors/src/app/globals.css` (imported in `layout.tsx`)
  - `.container-luxury`: `max-width: 80rem` (1280px)
  - `h1`: Tailwind responsive classes (`text-5xl md:text-6xl lg:text-7xl xl:text-8xl`)

**Not Active (orphaned):**
- `district-interiors/src/app/(frontend)/styles.css` (NOT imported)
  - `.section-padding`: `py-20 md:py-28 lg:py-36 px-6 md:px-12 lg:px-20`
  - `.container-luxury`: `max-w-7xl mx-auto`
  - `h1`: `clamp(2.5rem, 5vw + 1rem, 6rem)`

### Reference Repo Comparison:

**Reference Repo (`remix-of-district-51`):**
- Uses `index.css` which has:
  - `.section-padding`: `py-20 md:py-28 lg:py-36 px-6 md:px-12 lg:px-20` ✅
  - `.container-luxury`: `max-w-7xl mx-auto` ✅
  - `h1`: `clamp(2.5rem, 5vw + 1rem, 6rem)` ✅

**Our Implementation:**
- Uses `globals.css` which has:
  - `.section-padding`: **MISSING** ❌ (not defined in globals.css!)
  - `.container-luxury`: `max-width: 80rem` ✅ (but different definition style)
  - `h1`: Tailwind classes ❌ (different from reference)

---

## Solution Required:

1. **Import `styles.css`** OR **move `.section-padding` definition to `globals.css`**
2. **Ensure `h1` uses `clamp()`** to match reference repo
3. **Ensure `.container-luxury` matches reference** (both are `max-w-7xl` = 1280px, so this is fine)


