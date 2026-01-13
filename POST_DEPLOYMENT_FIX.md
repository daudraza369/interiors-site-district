# 🔧 Post-Deployment Fix Guide

## Problem
After deployment, sections and media aren't showing because:
1. Database tables don't exist (migrations haven't run)
2. Database is empty (no data seeded)
3. Media files might not be accessible

## ✅ Solution: Run These Commands in Coolify Terminal

### Step 1: Initialize Database (Run Migrations)

Payload will auto-migrate on first connection, but we can force it:

```bash
cd /app
pnpm run ensure:database
```

This will:
- Initialize Payload
- Run all migrations automatically
- Create all missing tables

### Step 2: Seed All Data

After migrations, seed all content:

```bash
# Run the production seed script (if available)
pnpm run seed:production

# OR run individual seeds:
pnpm run seed:admin
pnpm run seed:media
pnpm run seed:default-images
pnpm run seed:client-logos
pnpm run seed:expert-quotes
pnpm run seed:our-approach
pnpm run populate:why-choose-us
pnpm run seed:stats
pnpm run seed:portfolio
pnpm run seed:differentiation
pnpm run seed:testimonials
pnpm run seed:virtual-showrooms
pnpm run seed:services
pnpm run seed:services-page-defaults
pnpm run seed:projects-page-defaults
pnpm run seed:contact-defaults
pnpm run seed:about-page-defaults
pnpm run seed:collection-page-defaults
pnpm run seed:flowers-page-defaults
pnpm run seed:tree-solutions-page-defaults
pnpm run seed:styling-page-defaults
```

### Step 3: Verify Data

Check if data exists:

```bash
# Check database file
ls -la /app/data/*.db

# Check media files
ls -la /app/media/ | head -10
```

### Step 4: Restart the App

After seeding, restart the app in Coolify to ensure everything loads:

1. Go to Coolify → Your App
2. Click **"Restart"**
3. Wait for it to start
4. Visit your site

---

## 🔍 Verify It Worked

1. **Visit your site** - sections should appear
2. **Check `/admin`** - verify data exists in CMS
3. **Check browser console** - no errors
4. **Check media** - images should load

---

## ⚠️ If Still Not Working

### Check Database Tables

```bash
cd /app
sqlite3 /app/data/district-interiors.db ".tables" | grep -E "(home_page|services_page|contact_page)"
```

Should show tables like:
- `home_page`
- `services_page`
- `contact_page`
- etc.

### Check Media Directory

```bash
ls -la /app/media/ | wc -l
```

Should show 30+ files.

### Check Environment Variables

```bash
echo $NEXT_PUBLIC_SERVER_URL
echo $PAYLOAD_SECRET
echo $DATABASE_URL
```

All should have values.

---

## 🚀 Quick One-Liner (After First Deployment)

```bash
cd /app && pnpm run ensure:database && pnpm run seed:client-logos && pnpm run seed:media && echo "✅ Done! Restart app in Coolify."
```

Then restart the app in Coolify dashboard.



