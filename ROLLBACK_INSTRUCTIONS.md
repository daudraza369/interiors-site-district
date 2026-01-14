# Rollback Instructions (if needed)

## 🚨 **Quick Rollback Guide**

If portfolio images fix causes any issues after deployment:

### **Option 1: Revert Code Changes (Recommended)**

```bash
# In Coolify terminal or local git
git log --oneline -10  # Find commit before portfolio fix
git revert <commit-hash>
# Or manually restore these files:
# - src/lib/mediaUrl.ts
# - src/components/sections/PortfolioSection.tsx
```

### **Option 2: Restore Database Backup**

```bash
# Stop the application first
# Then restore backup:
cp district-interiors.db.backup-pre-portfolio-fix-20260112-183431 district-interiors.db
# Restart application
```

### **Option 3: Manual URL Revert**

If only the URL format is causing issues, you can temporarily revert just the URL normalization:

**File: `src/lib/mediaUrl.ts`**
```typescript
// Revert to old version:
// If it's already /media/ or /api/media/file/, return as-is
if (path.startsWith('/media/') || path.startsWith('/api/media/file/')) {
  return path
}
```

---

## ✅ **Why Rollback Shouldn't Be Needed**

1. **Backward Compatible**: Changes don't break existing functionality
2. **No Database Changes**: Only frontend code changed
3. **Graceful Fallbacks**: API route handles both URL formats
4. **Tested Locally**: All changes verified before deployment

---

**Last Updated**: 2026-01-12


