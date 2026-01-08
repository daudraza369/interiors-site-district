# 🔧 Required Environment Variables for Production

## Critical Variables (MUST SET)

### 1. `PAYLOAD_SECRET`
- **Required:** Yes
- **Description:** Secret key for Payload CMS encryption
- **Example:** `bd23d3440f67632202c10cac653388e60b9badc8e4692b380de211eca4c05056`
- **How to generate:** Use any random long string (32+ characters)
- **Where to set:** Coolify → Your App → Environment Variables

### 2. `NEXT_PUBLIC_SERVER_URL`
- **Required:** Yes (for media URLs to work)
- **Description:** Your production domain URL
- **Example:** `https://bcgwo8c8s0gkk0s80scw4cs4.districtflowers.com`
- **Important:** Must include `https://` or `http://` prefix
- **Where to set:** Coolify → Your App → Environment Variables

### 3. `DATABASE_URL`
- **Required:** Yes (usually auto-set by Coolify)
- **Description:** SQLite database file path
- **Example:** `file:/app/data/district-interiors.db`
- **Note:** Coolify should set this automatically based on persistent storage

---

## How to Set in Coolify

1. Go to **Coolify Dashboard**
2. Click on your application
3. Go to **Environment Variables** section
4. Add each variable:
   - Click **"Add Variable"**
   - Enter variable name (e.g., `NEXT_PUBLIC_SERVER_URL`)
   - Enter variable value (e.g., `https://your-domain.com`)
   - Click **Save**
5. **Redeploy** the application for changes to take effect

---

## Verification

After setting variables, verify in Coolify terminal:

```bash
echo $PAYLOAD_SECRET
echo $NEXT_PUBLIC_SERVER_URL
echo $DATABASE_URL
```

All should show values (not empty).

---

## Troubleshooting

**Media files not loading:**
- ✅ Check `NEXT_PUBLIC_SERVER_URL` is set correctly
- ✅ Verify it matches your actual domain
- ✅ Must include protocol (`https://` or `http://`)

**Sections not showing:**
- ✅ Check `PAYLOAD_SECRET` is set
- ✅ Run seed scripts: `pnpm run seed:client-logos` etc.
- ✅ Check database has data via admin panel (`/admin`)

**Database errors:**
- ✅ Check `DATABASE_URL` points to correct path
- ✅ Verify persistent storage is mounted in Coolify
- ✅ Check database file exists: `ls -la /app/data/*.db`

