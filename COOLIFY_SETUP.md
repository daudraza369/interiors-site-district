# 🚀 Coolify Deployment - Quick Start

## 📋 Pre-Deployment Checklist

- [x] ✅ Code is ready
- [x] ✅ Dockerfile exists
- [x] ✅ `next.config.mjs` has `output: 'standalone'`
- [ ] ⏭️ Push to GitHub
- [ ] ⏭️ Set up Coolify resource
- [ ] ⏭️ Configure environment variables
- [ ] ⏭️ Set up database (SQLite or PostgreSQL)

---

## 🔄 Deployment Workflow (Using Cursor)

### The Answer to Your Question:

**Yes, GitHub → Coolify is the standard and recommended way**, but here's the complete picture:

### Option 1: GitHub → Coolify (Recommended) ✅

**Workflow:**
```
1. Make changes in Cursor (local)
   ↓
2. Test locally: npm run dev
   ↓
3. Commit: git add . && git commit -m "Description"
   ↓
4. Push: git push origin main
   ↓
5. Coolify auto-detects and deploys
   ↓
6. Site updates in 2-5 minutes
```

**Why this is best:**
- ✅ Version control (can rollback)
- ✅ Automatic deployments
- ✅ Works perfectly with Cursor
- ✅ Can review changes before deploying
- ✅ Industry standard

### Option 2: Direct Git (Alternative)

Coolify can connect directly to Git, but GitHub is still recommended for better workflow.

---

## 🗄️ Database Answer

### Current: SQLite (File-based)

**You're using:** `@payloadcms/db-sqlite`
- Database file: `district-interiors.db` (in your project)
- **Problem:** File-based, not ideal for production

### Options for Coolify:

#### Option A: Keep SQLite (Quick Start) ⚡

**Pros:**
- ✅ No setup needed
- ✅ Works immediately
- ✅ Good for single-instance deployment

**Cons:**
- ❌ Can't scale to multiple instances
- ❌ File system dependency
- ❌ Not ideal for production

**For Coolify:**
- SQLite file needs to be in a persistent volume
- Or use SQLite in the Docker container (data lost on restart)

#### Option B: PostgreSQL (Recommended) 🎯

**Pros:**
- ✅ Production-ready
- ✅ Can scale
- ✅ Better performance
- ✅ Coolify can provide managed PostgreSQL
- ✅ Proper backups

**Cons:**
- ⚠️ Requires migration from SQLite
- ⚠️ Slightly more setup

**For Coolify:**
- Add PostgreSQL service in Coolify
- Or use external PostgreSQL (Supabase, Railway, etc.)

---

## 📝 Step-by-Step Deployment

### Step 1: Prepare GitHub Repository

```bash
cd district-interiors

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Add remote (replace with your GitHub repo)
git remote add origin https://github.com/yourusername/district-interiors.git

# Push
git push -u origin main
```

### Step 2: Set Up Coolify

1. **Create New Resource:**
   - Type: `Application`
   - Source: `GitHub`
   - Repository: Your repo
   - Branch: `main`

2. **Build Settings:**
   - Build Pack: `Dockerfile` (you have one)
   - Port: `3000` (or what Coolify assigns)

3. **Environment Variables:**
   Add these in Coolify dashboard:
   ```
   PAYLOAD_SECRET=your-production-secret-key
   DATABASE_URL=file:./district-interiors.db  # For SQLite
   # OR
   DATABASE_URL=postgresql://user:pass@host:5432/dbname  # For PostgreSQL
   
   NODE_ENV=production
   NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
   ```

### Step 3: Database Setup

#### For SQLite (Quick):
- Database file will be in container
- **Issue:** Data lost if container restarts
- **Solution:** Use persistent volume in Coolify

#### For PostgreSQL (Recommended):
1. In Coolify, add `PostgreSQL` service
2. Coolify provides `DATABASE_URL` automatically
3. Update `payload.config.ts` to use PostgreSQL adapter
4. Run migration scripts

### Step 4: Deploy!

Coolify will:
1. Clone your GitHub repo
2. Build Docker image
3. Start container
4. Your site is live! 🎉

---

## 🔄 Making Updates (While Site is Live)

### Workflow:

1. **Edit in Cursor** (local)
2. **Test locally:**
   ```bash
   npm run dev
   ```
3. **Commit:**
   ```bash
   git add .
   git commit -m "Update: Description"
   ```
4. **Push:**
   ```bash
   git push origin main
   ```
5. **Coolify auto-deploys** (if enabled)
6. **Site updates** in 2-5 minutes

**That's it!** You can keep using Cursor normally, just push to GitHub when ready.

---

## 🗄️ Database Migration (SQLite → PostgreSQL)

### When Ready to Migrate:

1. **Export current data:**
   ```bash
   npx tsx src/scripts/export-sqlite-data.ts
   ```

2. **Set up PostgreSQL in Coolify**

3. **Update `payload.config.ts`** to use PostgreSQL

4. **Import data:**
   ```bash
   npx tsx src/scripts/import-to-postgres.ts
   ```

5. **Update `DATABASE_URL` in Coolify**

6. **Redeploy**

---

## ⚠️ Important Notes

### Environment Variables:

**Never commit `.env` file!** It's already in `.gitignore`.

**Local (.env):**
```
PAYLOAD_SECRET=local-secret
DATABASE_URL=file:./district-interiors.db
NEXT_PUBLIC_SERVER_URL=http://localhost:3003
```

**Production (Coolify):**
```
PAYLOAD_SECRET=production-secret (different!)
DATABASE_URL=postgresql://... (or file:./district-interiors.db)
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
NODE_ENV=production
```

### Media Files:

- Currently in `media/` directory
- For production, consider:
  - Cloud storage (S3, Cloudflare R2)
  - Or persistent volume in Coolify

---

## ✅ Summary

**Deployment Workflow:**
- ✅ Cursor → Git → GitHub → Coolify (Recommended)
- ✅ Works perfectly with Cursor
- ✅ Automatic deployments on push

**Database:**
- ✅ Can start with SQLite (quick)
- ✅ Migrate to PostgreSQL later (recommended)
- ✅ Migration scripts provided

**Updates:**
- ✅ Edit in Cursor
- ✅ Push to GitHub
- ✅ Coolify auto-deploys
- ✅ Site updates in minutes

---

## 🎯 Next Steps

1. Push code to GitHub
2. Set up Coolify resource
3. Configure environment variables
4. Deploy!
5. (Optional) Migrate to PostgreSQL when ready

**Ready to deploy?** Let me know if you need help with any step!



