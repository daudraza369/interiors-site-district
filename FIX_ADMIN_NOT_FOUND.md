# Fix "Not Found" Error in Admin

## Problem
The admin panel shows "Not Found" for the Home Page global after schema changes.

## Cause
The database schema is out of sync with the Payload configuration. We added new fields to `treeConsultationPreview` section, but the database hasn't been migrated yet.

## Solution

### Option 1: Restart Dev Server (Recommended)
1. **Stop your dev server** (Ctrl+C in the terminal where it's running)
2. **Start it again**: `npm run dev`
3. **When prompted**, type: `yes` (to accept migrations)
4. **Wait** for the server to start
5. **Refresh** the admin panel - the Home Page should now be accessible

### Option 2: Use Migration Fix Script (If Option 1 doesn't work)
1. **Stop your dev server** (Ctrl+C)
2. **Run**: `npm run fix:migration`
3. **Start dev server**: `npm run dev`
4. **When prompted**, type: `yes`
5. **Refresh** the admin panel

## Why This Happens
When you add new fields to Payload schemas (globals or collections), Payload needs to:
- Create new database columns
- Update the schema structure
- Migrate existing data

This is done automatically when you restart the dev server and accept migrations.

## Prevention
- Always restart the dev server after schema changes
- Accept migrations when prompted
- Backups are automatically created (check BACKUP_LOG.md)




