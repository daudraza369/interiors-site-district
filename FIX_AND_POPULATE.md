# Fix Migration and Populate Why Choose Us

## Steps to Fix:

1. **Stop your dev server** (press `Ctrl+C` in the terminal where `npm run dev` is running)

2. **Run the fix script:**
   ```bash
   npm run fix-and-populate
   ```

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

4. **After the server starts, run the update script:**
   ```bash
   npm run update:why-choose-us
   ```

The fix script will:
- Backup your database
- Delete the old database (to fix migration errors)
- Try to populate Why Choose Us data (if server is ready)

If the auto-population doesn't work, just run `npm run update:why-choose-us` after the server starts.


