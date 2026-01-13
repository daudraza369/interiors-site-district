# ✅ Pre-Seed Checklist for Coolify

Before running `pnpm run seed:production`, verify these:

## Step 1: Check Current Directory
```bash
pwd
```
**Expected:** Should show `/app` (or similar app directory)

If not, navigate there:
```bash
cd /app
```

## Step 2: Verify Environment Variables
```bash
echo $PAYLOAD_SECRET
echo $DATABASE_URL
echo $NEXT_PUBLIC_SERVER_URL
```
**Required:**
- `PAYLOAD_SECRET` should show a value (not empty)
- `DATABASE_URL` should show a path (usually `file:./district-interiors.db` or similar)
- `NEXT_PUBLIC_SERVER_URL` should show your production domain

## Step 3: Check if Media Directory Exists
```bash
ls -la media/ | head -10
```
**Expected:** Should show media files (images, etc.)

## Step 4: Verify Database File Location
```bash
ls -la *.db 2>/dev/null || echo "Database file not in current directory"
```
**Note:** Database might be in a different location based on your Coolify persistent storage config.

## Step 5: Check Node/Pnpm Version
```bash
node --version
pnpm --version
```
**Expected:** Node 18+ or 20+, pnpm 9+

---

## ✅ If All Checks Pass, Then Run:

```bash
pnpm run seed:production
```

---

## ⚠️ If PAYLOAD_SECRET is Missing:

1. Go to Coolify Dashboard → Your App → **Environment Variables**
2. Add: `PAYLOAD_SECRET` = `your-random-secret-key-here` (generate a random string)
3. **Redeploy** the app
4. Then run the seed script

---

## ⚠️ If Media Directory is Empty:

The media files should be in your Git repo. If they're missing:
1. Check that your `.gitignore` doesn't exclude `media/` folder
2. Verify media files are committed to GitHub
3. Pull latest code or redeploy

---

## 🚀 Quick One-Liner to Check Everything:

```bash
cd /app && pwd && echo "PAYLOAD_SECRET: ${PAYLOAD_SECRET:0:10}..." && echo "DATABASE_URL: $DATABASE_URL" && ls -la media/ | head -5 && echo "✅ Ready to seed!" || echo "❌ Issues found"
```



