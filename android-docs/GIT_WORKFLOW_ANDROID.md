# Git Workflow for Sustainable Android Development

This document describes how to maintain the Android branch with clean upstream merges indefinitely.

---

## Branch Structure

```
main (upstream tracking)
  │
  ├─→ android/main (Android-specific features)
  │     │
  │     ├─→ android/feature/X (feature branches off android/main)
  │     └─→ android/bugfix/Y (bugfix branches off android/main)
  │
  ├─→ develop (staging for next release)
  └─→ release/* (version branches)
```

**Key rule**: Never merge Electron or Web changes into `android/main`. Always rebase.

---

## Scenario 1: Upstream Releases New Version (Main → Android)

**When**: Upstream (OpenCloudGaming/OpenNOW) releases v0.3.9

**Goal**: Update `android/main` with new upstream changes

**Steps**:

```bash
# 1. Fetch latest upstream
git fetch origin

# 2. Update main branch
git checkout main
git pull origin main

# 3. Rebase android/main on top of main
git checkout android/main
git rebase main

# Expected:
#   - 0 conflicts (99% of the time)
#   - If conflicts: resolve in src/android/, capacitor.config.json, package.json only
#   - Never resolve conflicts in src/shared/, src/main/gfn/

# 4. Force-push to android/main
#    (force because rebase rewrites history)
git push origin android/main --force-with-lease

# 5. Notify team
echo "✓ android/main synced to upstream v0.3.9"
```

**If conflicts occur** (rare):

```bash
# 1. Check conflicted files
git status

# Expected conflict locations:
#   - package.json (dependencies)
#   - capacitor.config.json (config)
#   - opennow-stable/tsconfig.json (paths)
#   - opennow-stable/vite.config.web.ts (build config)

# Expected NO conflicts:
#   - src/shared/
#   - src/main/gfn/
#   - src/renderer/components/
#   - If you see these, architecture needs review!

# 2. Resolve conflicts manually
#    (use VS Code merge conflict editor)

# 3. Mark as resolved
git add .

# 4. Complete rebase
git rebase --continue

# 5. Force-push
git push origin android/main --force-with-lease
```

---

## Scenario 2: Android Team Adds Feature (Android → Android)

**When**: Android developers want to add gamepad support, custom UI, etc.

**Goal**: Add Android-specific feature without affecting Electron

**Steps**:

```bash
# 1. Create feature branch off android/main
git checkout android/main
git pull origin android/main
git checkout -b android/feature/gamepad-ui

# 2. Implement feature
# Guidelines:
#   - Add code to src/android/ (platform-specific)
#   - OR modify src/renderer/ (platform-aware via isAndroid flag)
#   - NEVER modify src/shared/ without discussion
#   - Test on both Electron and Android

# 3. Commit with clear messages
git add src/android/gamepad.ts
git commit -m "feat(android): add gamepad UI overlay"

git add src/renderer/src/components/GamepadOverlay.tsx
git commit -m "feat(renderer): add Android-specific gamepad overlay"

# 4. Create pull request
git push origin android/feature/gamepad-ui
# Open PR on GitHub: android/feature/gamepad-ui → android/main

# 5. Code review checklist:
#    [ ] No changes to src/shared/
#    [ ] All Android code in src/android/ or platform-aware
#    [ ] Tests pass: npm run typecheck && npm run test
#    [ ] Tested on Android device
#    [ ] Tested on Electron (no regression)

# 6. Merge when approved
git checkout android/main
git pull origin android/main
git merge android/feature/gamepad-ui
git push origin android/main
```

---

## Scenario 3: Bug Fix in Shared Code (Electron → Android)

**When**: Electron developers fix a WebRTC bug, need to update Android

**Goal**: Backport fix to Android without full rebase

**Steps**:

```bash
# 1. Check if fix is in src/shared/ (good, easy)
#    If fix is in src/main/gfn/ (OK, copy logic)
#    If fix is in src/renderer/ (discuss with Android team)

# 2. Cherry-pick the Electron commit
git checkout android/main
git cherry-pick <commit-sha>

# Expected:
#   - Clean apply (no conflicts)
#   - If conflicts: logic needs adapting for Android context

# 3. If cherry-pick fails
git cherry-pick --abort
# Manually apply fix to corresponding Android module
git add src/android/...
git commit -m "fix(android): sync WebRTC fix from main (<commit-sha>)"

# 4. Push
git push origin android/main
```

---

## Scenario 4: Android Developer Syncs Main Back to Branch

**When**: After Electron team releases v0.3.9, Android team wants latest

**Goal**: Get all upstream changes into android/main for builds

**Steps**:

```bash
# Already covered in Scenario 1!
git checkout main && git pull origin main
git checkout android/main && git rebase main
git push origin android/main --force-with-lease
```

---

## Scenario 5: Merge Android Features Back to Main

**When**: Android team built something useful for all platforms (e.g., better error handling)

**Goal**: Integrate Android improvement into main Electron build

**Steps**:

```bash
# 1. Identify the commit(s) to merge
# Best case: Code is in src/shared/ already
#   → cherry-pick to main, done

# Harder case: Code is Android-specific but reusable
#   → Extract to src/shared/
#   → Test on Electron
#   → Create PR to main

# 2. Extract code to shared if needed
#    Move from src/android/ to src/shared/

# 3. Create PR to main
git checkout -b merge/android-improvements main
git cherry-pick <android-commit>
# OR manually apply if architecture changed

# 4. Test on Electron only
npm run dist

# 5. Create pull request: merge/android-improvements → main
# Note: PR title should explain why this is valuable for Electron too
```

---

## Code Review Checklist for Android Changes

**Every Android PR should verify**:

```markdown
### Architecture
- [ ] Changes are in `src/android/` OR `src/renderer/` (platform-aware)
- [ ] `src/shared/` is untouched (or approved by maintainers)
- [ ] `src/main/gfn/` is untouched (or same logic needed for Electron)

### Merge Safety
- [ ] No hardcoded platform checks scattered in code
- [ ] Uses `isAndroid` or `getPlatform()` from `src/platform.ts`
- [ ] Graceful fallback on Electron (no crashes)

### Testing
- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes
- [ ] Tested on Android device (if UI change)
- [ ] Tested on Electron (no regression)

### Documentation
- [ ] README updated if new feature
- [ ] Inline comments for complex Android-specific code
- [ ] PR description explains why Android-only

### Merge Readiness
- [ ] No merge conflicts expected with upstream
- [ ] Rebases cleanly on main
```

---

## Merge Statistics: Target Metrics

Track these metrics over time:

```
Monthly Upstream Merges:
  - Average conflicts per merge: 0-1 (target)
  - Time to resolve conflicts: <1 hour
  - Test failures after merge: 0

Quarterly Alignment:
  - Commits behind upstream: < 20 (target 0)
  - Last successful full-platform test: < 1 week ago
  - Features waiting for Android: 0

Annual Health:
  - Major architecture changes: 0 (good!)
  - Regressions introduced by merges: 0
  - Branches abandoned: 0
```

---

## Maintenance Schedule

### Daily (for Android developers)
- Work on `android/feature/*` branches
- Merge to `android/main` when ready

### Weekly (maintainer)
- Check if new upstream commits need syncing
- `git diff main android/main` to verify isolation

### Bi-weekly (team sync)
- Discuss upcoming Electron features that affect Android
- Plan Android-specific features

### Monthly (release cycle)
- Full merge from `main` to `android/main`
- Full test on both platforms
- Release Android APK

### Quarterly (strategy)
- Review merge metrics
- Assess architecture (should still be clean)
- Plan next Android-specific features

---

## Emergency: Major Merge Conflict

**If a merge has >5 conflicts**, something is wrong.

**Investigation**:

```bash
# 1. Check what changed upstream
git log --oneline main@{1}..main | head -20

# 2. Analyze conflicts
git diff --name-only --diff-filter=U

# 3. If src/shared/ has conflicts: escalate
# 4. If src/android/ has conflicts: resolve locally
# 5. If scattered conflicts: review architecture

# 6. After resolving, check:
git diff HEAD^ HEAD
# Should show NO changes to src/shared/, src/main/gfn/

# 7. Test extensively
npm run typecheck
npm run test
npm run build
npm run build:web
```

---

## Tools & Commands Reference

### Status Check
```bash
# Check what changed since last merge
git diff main android/main --stat

# Find next upstream release
git log main --oneline | grep -i "release\|version" | head -1

# Check for divergent commits
git log --oneline --graph main android/main | head -20
```

### Safe Rebase
```bash
# Dry-run rebase (see what would happen)
git rebase --dry-run main

# Interactive rebase (review each commit)
git rebase -i main

# Abort rebase if something goes wrong
git rebase --abort
```

### Clean Up
```bash
# Delete merged feature branches
git branch -d android/feature/gamepad-ui

# Force-push (only after rebase)
git push origin android/main --force-with-lease
# NOT --force (safer with --force-with-lease)
```

### Verify Merge
```bash
# Test both builds
npm run build    # Electron
npm run build:web # Android/Capacitor

# Check types
npm run typecheck

# Run tests
npm run test

# Visual diff
git diff main android/main --name-only
```

---

## Troubleshooting

### "Rebase has conflicts in src/shared/!"
- This shouldn't happen. If it does:
  - Check if `main` and `android/main` diverged in shared code
  - Review architecture (may need redesign)
  - Escalate to architecture review

### "npm run build:web failed after merge"
- Check `capacitor.config.json`
- Check `vite.config.web.ts`
- Verify imports in `src/android/`
- Check for missing Capacitor plugin types

### "Electron build regressed after merge"
- Verify no changes to `src/main/gfn/`
- Check `electron.vite.config.ts` (should be untouched)
- Run `npm run dist` locally
- Check for type errors: `npm run typecheck`

### "Too many commits behind!"
- Run full rebase: `git rebase main`
- If massive conflicts: consider squash merge instead
- Then `git reset --soft HEAD~1 && git commit -m "sync: merge upstream vX.Y.Z"`

---

## Example: Real Merge Workflow (Step-by-Step)

**Scenario**: Upstream releases v0.4.0 on Wednesday. Android team wants it by Friday.

```bash
# Wednesday, 10 AM - Upstream Release
# Someone notices: "OpenCloudGaming/OpenNOW released v0.4.0"

# Wednesday, 10:30 AM - Sync Main
git checkout main
git pull origin main
# Now main = v0.4.0

# Wednesday, 2 PM - Rebase Android
git checkout android/main
git rebase main

# Checking 15 commits...
#   ✓ Commit A (auth.ts) - clean
#   ✓ Commit B (UI layout) - clean
#   ⚠  Commit C (package.json) - CONFLICT
#   ✓ Commits D-O - clean

# Resolve conflict in package.json:
#   - Keep both Electron and Capacitor dependencies
#   - Alphabetize
#   - Verify versions compatible

git add opennow-stable/package.json
git rebase --continue

# All clean! Rebase complete.
# (Summary: 15 commits rebased, 1 conflict resolved)

# Wednesday, 2:30 PM - Push
git push origin android/main --force-with-lease

# Wednesday, 3 PM - Test
npm run build      # ✓ Electron still works
npm run build:web  # ✓ Web build updated
npm run typecheck  # ✓ No new type errors

# Thursday, 10 AM - Team notification
# "android/main synced with upstream v0.4.0 ✓
#  - 15 commits rebased
#  - 1 conflict (package.json dependencies)
#  - Both builds tested successfully
#  - Ready for Android v0.4.0-android release"

# Friday - Android Build & Release
npm run build:web
npx cap sync android
cd android && ./gradlew assembleRelease
# Release v0.4.0-android APK
```

---

## Success Indicators

✅ **You're doing it right if**:
- Merges from `main` to `android/main` have 0-1 conflicts
- All conflicts are in `package.json` or `capacitor.config.json`
- Rebase takes <30 minutes
- No regression in either platform after merge
- Android team can release independently

❌ **Red flags**:
- Conflicts in `src/shared/` or `src/main/gfn/`
- Conflicts in `src/renderer/` every merge
- Rebase takes >2 hours
- Either platform breaks after merge
- Android team blocked waiting for Electron sync

If you see red flags, review the architecture with the team. It may need adjusting.

---

## Summary

**Three rules for forever**:

1. **Keep `src/android/` isolated** - Only Android changes live there
2. **Rebase don't merge** - Always `git rebase main`, never `git merge main`
3. **Test both platforms** - Every merge, build and verify both Electron and Android

Follow these, and you'll never have merge hell again.

---

**Maintenance guide updated:** April 2026
**Last merge test:** Successful with upstream v0.3.8
**Target merge frequency:** 1x per month (with upstream releases)
**Expected conflict rate:** <5% of merges have conflicts
