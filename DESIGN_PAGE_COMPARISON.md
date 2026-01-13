# Design Page Comparison - New Repo vs Current Implementation

## 🔍 **Key Differences**

### **1. Structure**
**New Repo:**
- Has a full **Hero Section** with dark green background
- Has a separate **Content Section** below

**Current:**
- Only has the "coming soon" content section
- Missing the hero section entirely

### **2. Hero Section (NEW - Missing in Current)**
**New Repo:**
- Background: `bg-night-green` with gradient overlay
- Decorative blur elements (pear/slate-moss)
- Container: `container-luxury px-6 md:px-12 lg:px-20 pt-32 pb-20`
- Eyebrow: "Interior Design" - `text-pear` (not text-slate-moss)
- Headline: "Design" - `text-ivory` (not text-night-green), includes `xl:text-7xl`
- Description: "Bespoke interior design solutions that seamlessly integrate living greenery into your architectural vision." - `text-ivory/70`

**Current:**
- ❌ Hero section is missing

### **3. Content Section**
**New Repo:**
- Separate `<main>` section with `py-20`
- Uses `whileInView` animation (not `animate`)
- Container: `container-luxury px-6 md:px-12 lg:px-20`
- Text: `text-slate-moss`

**Current:**
- Has the content section but wrong styling
- Text colors are wrong (text-slate-moss on eyebrow, text-night-green on headline)
- No separate hero section

### **4. Text Content**
**New Repo Hero:**
- Eyebrow: "Interior Design"
- Headline: "Design"
- Description: "Bespoke interior design solutions that seamlessly integrate living greenery into your architectural vision."

**New Repo Content:**
- "Content coming soon. We're crafting something beautiful for this page."

**Current:**
- Uses CMS data (comingSoonSection) but missing hero section structure

---

## 📋 **What Needs to Be Updated**

1. ✅ **Add Hero Section** with:
   - Dark green background (`bg-night-green`)
   - Gradient overlay
   - Decorative blur elements
   - Proper text colors (pear/ivory)
   - Larger headline size
   - New description text

2. ✅ **Restructure Component** to have:
   - Hero section first
   - Content section second (as separate `<main>`)

3. ✅ **Update Text Colors**:
   - Hero eyebrow: `text-pear` (not text-slate-moss)
   - Hero headline: `text-ivory` (not text-night-green)
   - Hero description: `text-ivory/70`

4. ✅ **Update Animations**:
   - Hero uses `animate` with delays
   - Content section uses `whileInView`

5. ✅ **Update Default Values** in CMS to match new repo

---

## 🎯 **Implementation Plan**

1. Update `DesignPageClient.tsx` to match new repo structure
2. Update default values in `StylingPage.ts` (CMS config)
3. Test that CMS data still works correctly
4. Verify styling matches new repo exactly
