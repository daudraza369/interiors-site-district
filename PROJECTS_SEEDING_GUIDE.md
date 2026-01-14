# Projects Seeding Guide

## ✅ **Default Projects Created**

A seed script has been created to populate the Projects collection with default content matching the new repo (`remix-of-district-55`).

---

## 📋 **Default Projects**

The script creates **6 default projects**:

1. **Corporate HQ Transformation** (Office, Riyadh, KSA)
2. **Five-Star Hotel Atrium** (Hospitality, Jeddah, KSA)
3. **Fine Dining Restaurant** (F&B, Dubai, UAE)
4. **Private Villa Garden** (Villa, Al Khobar, KSA)
5. **Tech Campus Renovation** (Office, Riyadh, KSA)
6. **Boutique Hotel Lobby** (Hospitality, Riyadh, KSA)

Each project includes:
- ✅ Title
- ✅ Project Type (Office, Hospitality, F&B, Villa)
- ✅ Location
- ✅ Description
- ✅ Hero Image (automatically linked if available)
- ✅ Display Order
- ✅ Published status

---

## 🚀 **How to Run**

### **Local Development:**

```bash
npm run seed:projects-complete
```

### **On Coolify (after deployment):**

```bash
npm run seed:projects-complete
```

---

## 🎬 **Adding Videos**

After seeding, you can add videos to projects in two ways:

### **Option 1: Upload Video File**

1. Go to **Admin → Projects**
2. Click on a project to edit
3. Scroll to **"Video File"** field
4. Click **"Choose File"** or drag & drop a video
5. Supported formats: **MP4, WebM, MOV, AVI, WMV, FLV, MKV**
6. Save

### **Option 2: Add External Video URL**

1. Go to **Admin → Projects**
2. Click on a project to edit
3. Scroll to **"Video URL (External)"** field
4. Enter video URL:
   - Direct video: `https://example.com/video.mp4`
   - YouTube: `https://youtube.com/watch?v=VIDEO_ID`
   - Vimeo: `https://vimeo.com/VIDEO_ID`
5. Save

---

## 📊 **What the Script Does**

1. **Checks existing projects** - Won't duplicate if projects already exist
2. **Links hero images** - Automatically finds and links images from Media collection
3. **Creates missing projects** - Only creates projects that don't exist
4. **Updates existing projects** - Links missing images to existing projects
5. **Verification** - Shows final status of all projects with images and videos

---

## 🔍 **Script Output Example**

```
🌱 Seeding Projects Collection (with video support)...

📊 Found 0 existing project(s)

📝 Creating default projects...

🔍 Creating: Corporate HQ Transformation
   ✅ Linked image: hero-interior (ID: 123)
   ✅ Created successfully!

🔍 Creating: Five-Star Hotel Atrium
   ✅ Linked image: hotel-atrium (ID: 124)
   ✅ Created successfully!

...

✅ Created 6 project(s)!

🔍 Final verification:

📊 Total projects: 6

   ✅ Corporate HQ Transformation
      📷 hero-interior-34.jpg
      🎬 NO VIDEO
      📍 Riyadh, KSA
      🏷️  Office
      ✅ Published

...

✨ Done!

💡 Next steps:
   1. Go to Admin → Projects to view/edit projects
   2. Upload videos via "Video File" field or add "Video URL" for external links
   3. Videos will play on hover and open in full-screen modal when clicked
```

---

## ⚠️ **Important Notes**

1. **Images Required**: The script tries to link hero images automatically. If images are not found:
   - Projects will still be created (without images)
   - You can add images manually in the admin panel
   - Run `npm run seed:media` first to ensure images exist

2. **Videos Optional**: Videos are not included by default. You can add them:
   - Via admin panel after seeding
   - By uploading video files
   - By adding external video URLs

3. **No Duplicates**: The script won't create duplicate projects. If a project with the same title exists, it will be skipped.

4. **Image Matching**: The script matches images by base name (e.g., `hero-interior` matches `hero-interior-34.jpg`), handling version numbers automatically.

---

## 🎯 **After Seeding**

1. ✅ **6 default projects** will be created
2. ✅ **Hero images** will be linked (if available in Media collection)
3. ✅ **Projects** will be published and visible on frontend
4. ✅ **Video fields** will be empty (ready for you to add videos)

---

## 📝 **Next Steps**

1. **Run the seed script**: `npm run seed:projects-complete`
2. **Verify in admin**: Go to Admin → Projects to see all projects
3. **Add videos**: Upload video files or add video URLs for projects that need videos
4. **Check frontend**: Visit `/projects` page to see projects displayed

---

**Last Updated**: 2026-01-12

