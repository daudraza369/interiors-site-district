# Portfolio Section - No Projects Found - Fix Guide

## 🔍 **Problem**

When running `npm run fix:portfolio-images`, you see:
```
📊 Found 0 portfolio projects
```

This means the portfolio section exists but has no projects in it.

---

## ✅ **Solution: Run Complete Seeding Script**

### **On Coolify Terminal:**

```bash
npm run seed:portfolio-complete
```

This script will:
1. ✅ **Create portfolio projects** if they don't exist
2. ✅ **Link images** to projects automatically
3. ✅ **Handle version mismatches** in filenames
4. ✅ **Verify everything** at the end

---

## 📋 **What the Script Does**

### **If No Projects Exist:**
- Creates 4 default portfolio projects:
  1. Modern Corporate Lobby
  2. Fine Dining Restaurant
  3. Private Villa Garden
  4. Co-Working Space
- Tries to find and link images for each project
- Creates projects even if images aren't found (you can add images later)

### **If Projects Exist But No Images:**
- Finds images by base name (e.g., `portfolio-corporate-lobby`)
- Handles version numbers (e.g., `portfolio-corporate-lobby-34.jpg`)
- Links images to projects automatically

---

## 🚀 **Quick Fix Command**

Just run this one command:

```bash
npm run seed:portfolio-complete
```

That's it! The script handles everything.

---

## 📝 **Expected Output**

```
🌱 Seeding Portfolio Section (projects + images)...

📊 Found 0 existing project(s)

📝 Creating portfolio projects...

🔍 Creating: Modern Corporate Lobby
   ✅ Linked image: portfolio-corporate-lobby (ID: 123)
🔍 Creating: Fine Dining Restaurant
   ✅ Linked image: portfolio-restaurant (ID: 124)
🔍 Creating: Private Villa Garden
   ✅ Linked image: portfolio-villa (ID: 125)
🔍 Creating: Co-Working Space
   ✅ Linked image: portfolio-coworking (ID: 126)

✅ Created 4 portfolio project(s)!

🔍 Final verification:

📊 Total projects: 4

   ✅ Modern Corporate Lobby: portfolio-corporate-lobby-34.jpg
   ✅ Fine Dining Restaurant: portfolio-restaurant-2.jpg
   ✅ Private Villa Garden: portfolio-villa-1.jpg
   ✅ Co-Working Space: portfolio-coworking-3.jpg

✨ Done!
```

---

## ⚠️ **If Images Are Not Found**

If the script says "Image not found" for some projects:

1. **Check if images exist in media collection:**
   - Go to **Admin → Media**
   - Search for: `portfolio-corporate-lobby`, `portfolio-restaurant`, etc.

2. **If images don't exist, upload them:**
   - Go to **Admin → Media → Upload**
   - Upload the portfolio images
   - Run the script again: `npm run seed:portfolio-complete`

3. **Or add images manually:**
   - Go to **Admin → Home Page → Portfolio tab**
   - Click on each project
   - Select the Hero Image
   - Save

---

## 🔄 **Alternative: Step-by-Step**

If you prefer to do it step by step:

### **Step 1: Create Projects**
```bash
npm run seed:portfolio
```

### **Step 2: Link Images**
```bash
npm run seed:portfolio-images
```

**OR** use the combined script:
```bash
npm run seed:portfolio-complete
```

---

## ✅ **After Running the Script**

1. **Refresh the homepage** on your site
2. **Check the Portfolio section** - you should see 4 projects with images
3. **If images still don't show**, check browser console for errors
4. **Verify in admin panel**: Go to Admin → Home Page → Portfolio tab

---

## 📋 **Portfolio Projects Created**

The script creates these 4 projects:

1. **Modern Corporate Lobby**
   - Type: Offices
   - Image: `portfolio-corporate-lobby.jpg` (or with version number)

2. **Fine Dining Restaurant**
   - Type: F&B
   - Image: `portfolio-restaurant.jpg` (or with version number)

3. **Private Villa Garden**
   - Type: Private Villa
   - Image: `portfolio-villa.jpg` (or with version number)

4. **Co-Working Space**
   - Type: Offices
   - Image: `portfolio-coworking.jpg` (or with version number)

---

**Last Updated**: 2026-01-12


