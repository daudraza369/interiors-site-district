# 🚀 Deployment Guide - Coolify

## 📋 Overview

This guide covers:
1. **Deployment Workflow** - How to deploy and update while using Cursor
2. **Database Options** - SQLite vs PostgreSQL for production
3. **Migration Strategy** - Moving from SQLite to PostgreSQL
4. **Update Process** - Making changes while site is live

---

## 🔄 Deployment Workflow

### Option 1: GitHub → Coolify (Recommended)

**This is the standard and most reliable approach:**

```
Cursor (Local Development) 
    ↓
Git Commit & Push
    ↓
GitHub Repository
    ↓
Coolify (Auto-deploy on push)
    ↓
Live Site
```

**Advantages:**
- ✅ Version control (Git history)
- ✅ Easy rollback if something breaks
- ✅ Automatic deployments on push
- ✅ Can review changes before deploying
- ✅ Works perfectly with Cursor

**Workflow:**
1. Make changes in Cursor (local)
2. Test locally
3. Commit to Git: `git add . && git commit -m "Description"`
4. Push to GitHub: `git push origin main`
5. Coolify automatically detects changes and deploys
6. Site updates in ~2-5 minutes

### Option 2: Direct Git Integration (Alternative)

Coolify can also connect directly to your Git repository without GitHub, but GitHub is recommended for better workflow.

---

## 🗄️ Database Options

### Current Setup: SQLite

You're currently using **SQLite** (`@payloadcms/db-sqlite`):
- ✅ Simple, no setup needed
- ✅ File-based database (`district-interiors.db`)
- ❌ **Not ideal for production** (especially with multiple instances)
- ❌ Can't scale horizontally
- ❌ File system dependency

### Recommended: PostgreSQL (Production)

For production on Coolify, **PostgreSQL** is recommended:

**Advantages:**
- ✅ Production-ready
- ✅ Can handle multiple instances
- ✅ Better performance
- ✅ Coolify can provide managed PostgreSQL
- ✅ Proper database backups
- ✅ Concurrent access support

---

## 🔧 Database Migration Strategy

### Step 1: Switch to PostgreSQL Adapter

1. **Install PostgreSQL adapter:**
```bash
cd district-interiors
pnpm add @payloadcms/db-postgres
```

2. **Update `payload.config.ts`:**
```typescript
// Change from:
import { sqliteAdapter } from '@payloadcms/db-sqlite'

// To:
import { postgresAdapter } from '@payloadcms/db-postgres'
```

3. **Update database config:**
```typescript
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL,
  },
}),
```

### Step 2: Export Data from SQLite

Before switching, export your current data:

```bash
# Create export script (we'll create this)
npx tsx src/scripts/export-sqlite-data.ts
```

### Step 3: Import to PostgreSQL

After setting up PostgreSQL on Coolify, import the data:

```bash
npx tsx src/scripts/import-to-postgres.ts
```

---

## 📦 Coolify Setup Steps

### 1. Prepare Repository

**Create `.gitignore` (if not exists):**
```
node_modules
.next
.env
.env.local
*.db
*.db-journal
.DS_Store
```

**Important:** Don't commit:
- `.env` file (secrets)
- `*.db` files (database)
- `node_modules`

### 2. Push to GitHub

```bash
cd district-interiors

# Initialize git if not done
git init

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/district-interiors.git

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Push
git push -u origin main
```

### 3. Configure Coolify

1. **Create New Resource in Coolify:**
   - Type: `Application`
   - Source: `GitHub`
   - Repository: Your GitHub repo
   - Branch: `main`

2. **Build Settings:**
   - Build Pack: `Dockerfile` (you already have one)
   - Or: `Nixpacks` (auto-detects Next.js)

3. **Environment Variables:**
   Add these in Coolify:
   ```
   PAYLOAD_SECRET=your-secret-key-here
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   NODE_ENV=production
   NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
   ```

4. **Database Service (PostgreSQL):**
   - In Coolify, add a PostgreSQL service
   - It will provide `DATABASE_URL` automatically
   - Or use external PostgreSQL (Supabase, Railway, etc.)

### 4. Update Dockerfile (if needed)

Your Dockerfile looks good, but ensure `next.config.mjs` has:
```javascript
output: 'standalone',
```

---

## 🔄 Making Updates While Live

### Workflow for Updates:

1. **Make changes in Cursor** (local development)
2. **Test locally:**
   ```bash
   npm run dev
   ```
3. **Commit changes:**
   ```bash
   git add .
   git commit -m "Update: Description of changes"
   ```
4. **Push to GitHub:**
   ```bash
   git push origin main
   ```
5. **Coolify auto-deploys** (if auto-deploy enabled)
   - Or manually trigger deployment in Coolify dashboard
6. **Site updates** in 2-5 minutes

### Best Practices:

- ✅ Always test locally first
- ✅ Use meaningful commit messages
- ✅ Consider feature branches for major changes
- ✅ Keep `.env` variables in sync between local and Coolify
- ✅ Backup database before major updates

---

## 🗄️ Database Setup on Coolify

### Option A: Coolify Managed PostgreSQL (Easiest)

1. In Coolify dashboard
2. Add new resource → `PostgreSQL`
3. Coolify creates database automatically
4. Get connection string from Coolify
5. Add to environment variables as `DATABASE_URL`

### Option B: External PostgreSQL

**Services:**
- Supabase (free tier available)
- Railway (easy setup)
- Neon (serverless PostgreSQL)
- AWS RDS
- DigitalOcean

**Steps:**
1. Create PostgreSQL database on service
2. Get connection string
3. Add to Coolify environment variables

---

## 📝 Migration Scripts Needed

I'll create these scripts for you:
1. `export-sqlite-data.ts` - Export all data from SQLite
2. `import-to-postgres.ts` - Import data to PostgreSQL
3. `migrate-database.ts` - Full migration script

---

## ⚠️ Important Notes

### Environment Variables

**Local (.env):**
```
PAYLOAD_SECRET=your-local-secret
DATABASE_URL=file:./district-interiors.db
NEXT_PUBLIC_SERVER_URL=http://localhost:3003
```

**Production (Coolify):**
```
PAYLOAD_SECRET=your-production-secret (different from local!)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
NODE_ENV=production
```

### Database Files

- **SQLite:** `district-interiors.db` (file in project)
- **PostgreSQL:** Managed by database service (not in project)

### Media Files

- Media files are stored in `media/` directory
- These need to be in the Docker image or use cloud storage
- Consider using S3/Cloudflare R2 for production

---

## 🎯 Recommended Approach

1. **For Now (Quick Deploy):**
   - Keep SQLite for initial deployment
   - Works fine for single-instance deployment
   - Easy to migrate later

2. **For Production (Recommended):**
   - Switch to PostgreSQL
   - Use Coolify managed PostgreSQL
   - Better for scaling and reliability

---

## 📋 Next Steps

1. ✅ Push code to GitHub
2. ✅ Set up Coolify resource
3. ✅ Configure environment variables
4. ✅ Deploy!
5. ⏭️ Migrate to PostgreSQL (when ready)

Would you like me to:
1. Create the migration scripts?
2. Update the config for PostgreSQL?
3. Create a `.env.example` file?
4. Set up the GitHub repository structure?


