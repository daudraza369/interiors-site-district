# Media Files Clarification - What's in Git vs What's Not

## ✅ **What IS in Git (Committed)**

### **1. Logo Source Files** ✅
**Location**: `src/assets/logos/`

All logo source files ARE committed to git:
- ✅ `uber.svg`
- ✅ `google.svg`
- ✅ `pepsico.webp`
- ✅ `bain.svg`
- ✅ `pretamanger.svg`
- ✅ `bnp-paribas.svg`
- ✅ `boehringer-ingelheim.svg`
- ✅ `savvy-games.svg`
- ✅ Plus other logos (abunayyan, avilease, tharawat, etc.)

**These will be available on Coolify after deployment!**

### **2. Logo Assets** ✅
**Location**: `src/assets/district-brandmark-*.png`

- ✅ `district-brandmark-ivory.png`
- ✅ `district-brandmark-lavender.png`
- ✅ `district-brandmark-lavender-transparent.png`

**These will be available on Coolify after deployment!**

### **3. Upload Scripts** ✅
- ✅ `src/scripts/upload-logo-media.ts` - Script to upload logos to Payload
- ✅ `src/scripts/seed-client-logos.ts` - Script to seed logos in CMS

---

## ❌ **What is NOT in Git (Excluded by .gitignore)**

### **1. Media Directory** ❌
**Location**: `/media`

This is where Payload CMS stores uploaded media files. This directory is excluded because:
- It contains large files
- It's generated content (not source code)
- It's specific to each environment

**On Coolify**: The `/media` directory already exists with your current media files. They will remain unchanged.

### **2. Database Files** ❌
**Location**: `*.db`, `*.db-journal`, etc.

- ❌ `district-interiors.db`
- ❌ `district-interiors.db.backup-*`

**On Coolify**: Your database already exists and will remain unchanged.

### **3. Environment Files** ❌
- ❌ `.env` files

**On Coolify**: Your environment variables are already configured.

---

## 🔄 **What Happens After Deployment**

### **Step 1: Source Files Available** ✅
After deployment, the logo source files will be available at:
- `src/assets/logos/*` (all logo SVG/WebP files)
- `src/assets/district-brandmark-*.png` (brandmark files)

### **Step 2: Upload Logos to Payload** ⚠️
**You need to run the upload script** to add the logos to Payload's media collection:

```bash
npm run upload:logo-media
```

This script will:
1. Read logo files from `src/assets/logos/`
2. Upload them to Payload's media collection
3. Store them in the `/media` directory (which is on Coolify, not in git)

### **Step 3: Seed Logos in CMS** ⚠️
After uploading, seed them in the HomePage global:

```bash
npm run seed:client-logos
```

This script will:
1. Link the uploaded logos to the client logos section
2. Update the HomePage global with the logo references

---

## 📋 **Post-Deployment Checklist**

After redeploying on Coolify:

1. ✅ **Verify source files are present**:
   - Check that `src/assets/logos/` contains all logo files
   - Check that `src/assets/district-brandmark-*.png` files exist

2. ⚠️ **Upload logos to Payload**:
   ```bash
   npm run upload:logo-media
   ```

3. ⚠️ **Seed logos in CMS**:
   ```bash
   npm run seed:client-logos
   ```

4. ✅ **Verify logos display**:
   - Check the homepage client logos section
   - Verify all 8 logos are visible

---

## 🎯 **Summary**

| Item | In Git? | On Coolify? | Action Needed? |
|------|---------|-------------|----------------|
| Logo source files (`src/assets/logos/*`) | ✅ YES | ✅ YES (after deploy) | Run upload script |
| Brandmark files (`src/assets/district-brandmark-*.png`) | ✅ YES | ✅ YES (after deploy) | None (used directly) |
| Uploaded media (`/media/*`) | ❌ NO | ✅ YES (existing) | Run upload script to add new logos |
| Database (`*.db`) | ❌ NO | ✅ YES (existing) | Run seed script |
| Environment (`.env`) | ❌ NO | ✅ YES (existing) | None |

---

## ✅ **Bottom Line**

**The logo source files ARE in git and will be available on Coolify after deployment.**

**You just need to:**
1. Run `npm run upload:logo-media` to upload them to Payload
2. Run `npm run seed:client-logos` to link them in the CMS

The `/media` directory exclusion only means that the **uploaded** media files (after they're processed by Payload) aren't in git - but the **source** logo files are!

---

**Last Updated**: 2026-01-12


