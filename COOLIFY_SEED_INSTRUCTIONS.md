# 🌱 How to Seed Data on Coolify Production Server

Your production database is empty, so you need to run seed scripts to populate it with all the content (client logos, sections, media, etc.).

## 🚀 Quick Method: Run Master Seed Script

### Step 1: Access Coolify Terminal

1. Go to your Coolify dashboard
2. Click on your application (`interiors-site-district`)
3. Find the **"Terminal"** or **"Execute Command"** button/tab
4. This opens a terminal inside your running container

### Step 2: Run the Production Seed Script

In the Coolify terminal, run this **single command**:

```bash
pnpm run seed:production
```

This will automatically seed:
- ✅ Admin user
- ✅ All media files
- ✅ Client logos section
- ✅ Expert quotes section
- ✅ Our approach section
- ✅ Why choose us section
- ✅ Stats section
- ✅ Portfolio section
- ✅ Differentiation section
- ✅ Testimonials
- ✅ Virtual showrooms
- ✅ Services
- ✅ All page defaults

**Expected time:** 2-5 minutes depending on media file sizes

---

## 📋 Alternative: Run Individual Seeds (if master script fails)

If the master script fails, you can run seeds individually:

```bash
# 1. Seed admin user (if not exists)
pnpm run seed:admin

# 2. Seed all media files
pnpm run seed:media

# 3. Seed default images
pnpm run seed:default-images

# 4. Seed client logos
pnpm run seed:client-logos

# 5. Seed expert quotes
pnpm run seed:expert-quotes

# 6. Seed our approach
pnpm run seed:our-approach

# 7. Seed why choose us
pnpm run populate:why-choose-us

# 8. Seed stats
pnpm run seed:stats

# 9. Seed portfolio
pnpm run seed:portfolio

# 10. Seed differentiation
pnpm run seed:differentiation

# 11. Seed testimonials
pnpm run seed:testimonials

# 12. Seed virtual showrooms
pnpm run seed:virtual-showrooms

# 13. Seed services
pnpm run seed:services

# 14. Seed page defaults
pnpm run seed:services-page-defaults
pnpm run seed:projects-page-defaults
pnpm run seed:contact-defaults
pnpm run seed:about-page-defaults
pnpm run seed:collection-page-defaults
pnpm run seed:flowers-page-defaults
pnpm run seed:tree-solutions-page-defaults
pnpm run seed:styling-page-defaults
```

---

## ⚠️ Important Notes

1. **Environment Variables**: Make sure these are set in Coolify:
   - `PAYLOAD_SECRET` (required)
   - `DATABASE_URL` (should be set automatically)
   - `NEXT_PUBLIC_SERVER_URL` (your production domain)

2. **Media Files**: The seed script expects media files to be in `/app/media` directory (which should be there from your Git repo)

3. **Database**: The database file is stored in persistent storage (configured in Coolify)

4. **After Seeding**: 
   - Refresh your frontend site
   - Check `/admin` to verify data was seeded
   - All sections should now be visible on the homepage

---

## 🔍 Verify Seeding Worked

After running seeds, check:

1. **Frontend**: Visit your site - you should see:
   - Client logos section
   - Expert quotes carousel
   - Stats section
   - Portfolio section
   - All other sections

2. **Admin Panel**: Visit `/admin` and check:
   - Media collection has files
   - Home Page global has data in all sections
   - Services collection has items
   - Testimonials collection has items

---

## 🆘 Troubleshooting

**Error: "PAYLOAD_SECRET is not set"**
- Go to Coolify → Your App → Environment Variables
- Add `PAYLOAD_SECRET` with a random string value
- Redeploy

**Error: "Cannot find module"**
- Make sure you're in the `/app` directory
- Run: `cd /app && pnpm run seed:production`

**Sections still not showing:**
- Check if sections are enabled in CMS admin (`/admin`)
- Verify data exists in the database via admin panel
- Check browser console for errors

**Media files not loading:**
- Verify media files exist in `/app/media` directory
- Check that `staticDir` in `Media.ts` is correct (should use `process.cwd()`)
- Verify `staticURL` is set to `/media`

---

## 📞 Need Help?

If seeds fail, check the error message and:
1. Verify all environment variables are set
2. Check that media files are in the container
3. Ensure database is writable
4. Check Coolify logs for more details


