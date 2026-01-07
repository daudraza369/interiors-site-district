# Automatic Schema Fix

## Quick Fix (One Command)

**When you see a database schema error:**

1. **Stop your dev server** (Ctrl+C)
2. **Run this command:**
   ```bash
   npm run fix:schema && npm run dev
   ```
3. **After server starts, in a new terminal, run:**
   ```bash
   npm run reseed
   ```

That's it! The database will be recreated with the correct schema and all data will be restored.

## What Happens

- ✅ Database is automatically backed up
- ✅ Old database is deleted
- ✅ Payload recreates database with correct schema
- ✅ All media and content is automatically reseeded

## Manual Steps (if needed)

If the automatic fix doesn't work:

```bash
# 1. Stop dev server
# 2. Fix schema
npm run fix:schema

# 3. Start dev server
npm run dev

# 4. In new terminal, reseed data
npm run reseed
```



