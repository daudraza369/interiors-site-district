# 🔧 Fix Migration Error

## Problem
The database has old schema columns (`title`, `description`, `image`) but the new schema expects (`label`, `us`, `them`, `displayOrder`). The migration fails because it can't copy data from columns that don't exist.

## Solution

### Step 1: Stop Dev Server ⚠️ IMPORTANT
**You MUST stop your dev server first!** Press `Ctrl+C` in the terminal where your dev server is running.

### Step 2: Delete Database
Run this command:
```bash
npm run reset:database
```

Or manually delete:
```powershell
# Windows PowerShell
Remove-Item .payload/payload.db
```

### Step 3: Restart Dev Server
```bash
npm run dev
```

When prompted about migrations, type `yes` to accept.

### Step 4: Seed All Data
```bash
npm run seed:all-sections
```

This will populate all sections with default data.

## Quick Fix (All in One)
```bash
# 1. Stop dev server (Ctrl+C)
# 2. Run:
npm run reset:database
npm run dev
# (Accept migrations when prompted)
# 3. In another terminal:
npm run seed:all-sections
```

## Why This Happens
When we change the schema structure (field names/types), Payload tries to migrate existing data. If the old structure is incompatible, we need a fresh database.

## After Fixing
All sections should now be visible on the frontend:
- ✅ Client Logos
- ✅ Expert Quotes  
- ✅ Our Approach
- ✅ Why Choose Us
- ✅ Stats
- ✅ Portfolio
- ✅ Differentiation

