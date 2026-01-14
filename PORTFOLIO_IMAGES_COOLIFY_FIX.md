# Portfolio Images Not Visible on Coolify - Fix Guide

## 🔍 **Problem**

Portfolio section images are not visible on Coolify deployment. This is likely due to:
1. Images not linked in the database (heroImage field is empty)
2. Filename version mismatches (e.g., `portfolio-corporate-lobby-34.jpg` vs `portfolio-corporate-lobby.jpg`)
3. Media files not uploaded to Payload's media collection

---

## ✅ **Solution: Run Fix Script**

### **Step 1: Access Coolify Terminal**

1. Go to your Coolify dashboard
2. Find the `district-interiors` application
3. Click on the application
4. Go to the **Terminal** or **Console** tab
5. Open a shell session

### **Step 2: Run the Fix Script**

```bash
npm run fix:portfolio-images
```

This script will:
- ✅ Check if portfolio images are linked in the database
- ✅ Find missing images by base name (handles version mismatches)
- ✅ Link images to portfolio projects
- ✅ Verify files exist on disk
- ✅ Update the HomePage global with correct image links

### **Step 3: Verify Results**

The script will output:
- ✅ Which projects have images linked
- ✅ Which images were found and linked
- ✅ Which files exist on disk
- ✅ Final verification of all portfolio projects

---

## 🔧 **Alternative: Manual Fix via Admin Panel**

If the script doesn't work, you can fix manually:

### **Step 1: Check Media Collection**

1. Go to **Admin → Media**
2. Search for portfolio images:
   - `portfolio-corporate-lobby`
   - `portfolio-restaurant`
   - `portfolio-villa`
   - `portfolio-coworking`
3. Note the exact filenames (including version numbers like `-34`)

### **Step 2: Update Portfolio Projects**

1. Go to **Admin → Home Page → Portfolio tab**
2. For each project:
   - Click on the project
   - Find the **Hero Image** field
   - Click **Select Media**
   - Search for the corresponding image
   - Select and save

### **Step 3: Verify**

1. Go to the homepage
2. Scroll to the Portfolio section
3. Verify images are visible

---

## 🔍 **Diagnostic: Check What's Wrong**

Run the verification script first to see what's missing:

```bash
npm run verify:portfolio-images
```

This will show:
- ✅ Which projects have images
- ❌ Which projects are missing images
- 📁 Which images exist in the media collection
- 📁 Which files exist on disk

---

## 📋 **Expected Portfolio Images**

The portfolio section should have 4 projects with these images:

1. **Modern Corporate Lobby**
   - Image: `portfolio-corporate-lobby.jpg` (or `portfolio-corporate-lobby-34.jpg`, etc.)

2. **Fine Dining Restaurant**
   - Image: `portfolio-restaurant.jpg` (or `portfolio-restaurant-2.jpg`, etc.)

3. **Private Villa Garden**
   - Image: `portfolio-villa.jpg` (or `portfolio-villa-1.jpg`, etc.)

4. **Co-Working Space**
   - Image: `portfolio-coworking.jpg` (or `portfolio-coworking-3.jpg`, etc.)

---

## ⚠️ **Common Issues**

### **Issue 1: Images Not in Media Collection**

**Symptom**: Script says "Not found in database"

**Solution**: Upload images to Payload:
1. Go to **Admin → Media**
2. Click **Upload**
3. Upload the portfolio images
4. Run the fix script again

### **Issue 2: Filename Version Mismatch**

**Symptom**: Script finds image but file doesn't exist on disk

**Solution**: The script handles this automatically by:
- Finding images by base name (ignores version numbers)
- Matching the latest version
- Using the actual filename from the database

### **Issue 3: Media Directory Path Wrong**

**Symptom**: Script says "File NOT found on disk"

**Solution**: Check the media directory path:
- Production: `/app/media`
- The script automatically detects the correct path

---

## 🚀 **Quick Fix Command**

If you just want to run the fix without reading all this:

```bash
npm run fix:portfolio-images
```

That's it! The script will handle everything automatically.

---

## 📝 **Script Output Example**

```
🔧 Fixing portfolio images for Coolify...

📊 Found 4 portfolio projects

📁 Media directory: /app/media
📁 Directory exists: true
📁 Files in media directory: 45
📁 Sample files: portfolio-corporate-lobby-34.jpg, portfolio-restaurant-2.jpg, ...

📸 Project: Modern Corporate Lobby
   🔍 Searching for image: portfolio-corporate-lobby...
   ✅ Found in database: portfolio-corporate-lobby-34.jpg (ID: 123)
   ✅ File exists on disk: portfolio-corporate-lobby-34.jpg

📸 Project: Fine Dining Restaurant
   ✅ Image already linked (ID: 124)
   ✅ File exists on disk: portfolio-restaurant-2.jpg

...

🔧 Updating portfolio projects with images...

✅ Portfolio images updated!

🔍 Final verification:

   ✅ Modern Corporate Lobby: portfolio-corporate-lobby-34.jpg
      URL: /api/media/file/portfolio-corporate-lobby-34.jpg
   ✅ Fine Dining Restaurant: portfolio-restaurant-2.jpg
      URL: /api/media/file/portfolio-restaurant-2.jpg
   ✅ Private Villa Garden: portfolio-villa-1.jpg
      URL: /api/media/file/portfolio-villa-1.jpg
   ✅ Co-Working Space: portfolio-coworking-3.jpg
      URL: /api/media/file/portfolio-coworking-3.jpg
```

---

## ✅ **After Running the Script**

1. **Refresh the homepage** on your site
2. **Check the Portfolio section** - images should now be visible
3. **If still not visible**, check browser console for errors
4. **Verify the image URLs** - they should be `/api/media/file/filename.jpg`

---

**Last Updated**: 2026-01-12


