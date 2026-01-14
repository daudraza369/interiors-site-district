# Video Upload Guide for Projects

## ✅ **Video Support Added**

The Projects collection now supports **two ways** to add videos:

1. **Upload Video File** - Upload MP4, WebM, or other video files directly
2. **Video URL** - Use external links (YouTube, Vimeo, direct video URLs)

---

## 📋 **How to Add Videos in Payload Admin**

### **Option 1: Upload Video File**

1. Go to **Admin → Projects**
2. Create or edit a project
3. Scroll to **"Video File"** field
4. Click **"Choose File"** or drag & drop a video file
5. Supported formats: **MP4, WebM, OGG, MOV, AVI, WMV, FLV, MKV**
6. The video will be uploaded to the Media collection
7. Save the project

### **Option 2: Use External Video URL**

1. Go to **Admin → Projects**
2. Create or edit a project
3. Scroll to **"Video URL (External)"** field
4. Enter the video URL:
   - Direct video link: `https://example.com/video.mp4`
   - YouTube: `https://youtube.com/watch?v=VIDEO_ID`
   - Vimeo: `https://vimeo.com/VIDEO_ID`
   - Any other video hosting service
5. Save the project

---

## 🎬 **How Videos Work on Frontend**

### **Uploaded Videos:**
- Videos are stored in the `/media` directory
- Served through `/api/media/file/[filename]` route
- Play on hover in project cards
- Open in full-screen modal when play button is clicked

### **External Video URLs:**
- Kept as-is (not modified)
- Can be YouTube, Vimeo, or direct video links
- Play on hover in project cards
- Open in full-screen modal when play button is clicked

---

## 🔧 **Technical Details**

### **Backend (Payload CMS):**

**Projects Collection Fields:**
- `video` (upload) - Relation to Media collection
- `videoUrl` (text) - External video URL

**Media Collection:**
- Accepts video MIME types:
  - `video/mp4`
  - `video/webm`
  - `video/ogg`
  - `video/quicktime` (MOV)
  - `video/x-msvideo` (AVI)
  - `video/x-ms-wmv` (WMV)
  - `video/x-flv` (FLV)
  - `video/x-matroska` (MKV)

**Media API Route:**
- Serves video files with correct MIME types
- Handles versioned filenames (e.g., `video-34.mp4`)
- Supports range requests for video streaming

### **Frontend:**

**Data Transformation:**
- Uploaded videos: Normalized to `/api/media/file/[filename]`
- External URLs: Kept as-is (no modification)

**ProjectCard Component:**
- Detects if video exists (`hasVideo = !!project.videoUrl`)
- Plays video on hover
- Shows play button overlay
- Opens VideoModal on click

**VideoModal Component:**
- Full-screen video player
- Supports both uploaded and external videos
- Escape key to close
- Proper video controls

---

## 📝 **Example Usage**

### **Example 1: Upload Video File**

```
Project Title: "Corporate HQ Transformation"
Video File: [Upload] project-video.mp4
Video URL: (leave empty)
```

**Result:** Video plays from `/api/media/file/project-video.mp4`

### **Example 2: Use External URL**

```
Project Title: "Corporate HQ Transformation"
Video File: (leave empty)
Video URL: https://example.com/videos/corporate-hq.mp4
```

**Result:** Video plays from `https://example.com/videos/corporate-hq.mp4`

### **Example 3: YouTube Video**

```
Project Title: "Corporate HQ Transformation"
Video File: (leave empty)
Video URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Result:** Video plays from YouTube (if browser supports it)

---

## ⚠️ **Important Notes**

1. **File Size:** Large video files may take time to upload. Consider compressing videos before upload.

2. **External URLs:** 
   - YouTube/Vimeo URLs may require embedding iframes instead of direct video playback
   - Direct video links (`.mp4`, `.webm`, etc.) work best

3. **Video Format:** 
   - **MP4 (H.264)** is the most widely supported format
   - **WebM** is good for modern browsers
   - **MOV** works on Apple devices

4. **Storage:**
   - Uploaded videos are stored in `/media` directory
   - Videos are excluded from Git (`.gitignore`)
   - Videos persist on Coolify after deployment

5. **Performance:**
   - Videos play on hover (muted, looped)
   - Full video plays in modal when clicked
   - Consider video compression for faster loading

---

## 🚀 **After Deployment on Coolify**

1. **Upload videos** through Payload admin panel
2. Videos are automatically saved to `/app/media` directory
3. Videos are served through `/api/media/file/[filename]` route
4. No additional configuration needed!

---

**Last Updated**: 2026-01-12


