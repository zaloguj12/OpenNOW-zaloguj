# Android Client Rebuild - Complete Documentation Index

## 📚 Documentation Suite

This is a **complete, ready-to-implement rebuild plan** for the Android client with **clean upstream mergeability**.

All documents are in the repository root. Read them in this order:

### 1. **START HERE** → [README_ANDROID_REBUILD.md](README_ANDROID_REBUILD.md)
   - **5-10 minute read**
   - Quick summary of problem, solution, timeline
   - Before/after comparison
   - FAQ section
   - **For**: Everyone (product managers, developers, leads)

### 2. **Understand the Architecture** → [ANDROID_REBUILD_STRATEGY.md](ANDROID_REBUILD_STRATEGY.md)
   - **20-30 minute read**
   - Full strategic architecture
   - Design principles
   - Why certain decisions were made
   - Comparison: current state vs. proposed
   - **For**: Tech leads, senior developers, architects

### 3. **Implement It** → [ANDROID_IMPLEMENTATION_GUIDE.md](ANDROID_IMPLEMENTATION_GUIDE.md)
   - **Implementation reference**
   - 5 phases with specific tasks
   - Code examples for each module
   - Commands to run
   - Verification checklist
   - **For**: Developers (read as you implement)

### 4. **Maintain It Forever** → [GIT_WORKFLOW_ANDROID.md](GIT_WORKFLOW_ANDROID.md)
   - **Operational guide**
   - Merge workflows for different scenarios
   - Code review checklist
   - Emergency procedures
   - Metrics to track
   - **For**: Maintainers, CI/CD engineers, code reviewers

---

## 🎯 Quick Reference: What's the Problem?

**Current state** (Android branch):
- 205 commits behind upstream
- Significant code divergence throughout
- Every upstream release requires manual merge + recode
- Takes weeks to sync
- Not sustainable long-term

**Proposed solution**:
- Android as optional platform layer, not fork divergence
- All Android-specific code in `src/android/`
- Minimal changes to shared code
- Clean upstream merges via `git rebase`
- Takes hours, not weeks

---

## 📋 Implementation Checklist

### Pre-Implementation
- [ ] Read README_ANDROID_REBUILD.md
- [ ] Read ANDROID_REBUILD_STRATEGY.md (sections 1-3)
- [ ] Team review & approval of architecture
- [ ] Assign developer(s)
- [ ] Allocate 2 weeks for full implementation

### Phase 1: Foundation (3 days)
- [ ] Platform detection (`src/platform.ts`)
- [ ] Android module structure (`src/android/`)
- [ ] Auth contract & implementations
- [ ] Crypto shim
- [ ] Capacitor bridge
- [ ] Run: `npm run typecheck && npm run test`

### Phase 2: Build Config (3 days)
- [ ] Create `vite.config.web.ts`
- [ ] Create `capacitor.config.json`
- [ ] Update build scripts in `package.json`
- [ ] Update `.gitignore`
- [ ] Run: `npm run build:web` (creates dist/)

### Phase 3: Integration (3 days)
- [ ] Platform detection in `src/main/index.ts`
- [ ] Conditional preload in `src/preload/index.ts`
- [ ] Capacitor init in `src/renderer/App.tsx`
- [ ] Run: `npm run build && npm run build:web`

### Phase 4: Verification (1 day)
- [ ] All tests pass
- [ ] Electron build identical to before
- [ ] **CRITICAL**: Test upstream merge
- [ ] Expected: 0 conflicts

### Phase 5: Capacitor/Native (4 days)
- [ ] Create Kotlin GfnPlugin
- [ ] Implement OAuth flow
- [ ] Implement token storage
- [ ] Build APK locally
- [ ] Test on device

### Post-Implementation
- [ ] Merge Android branch to main
- [ ] Update CI/CD for Android builds
- [ ] Document in CONTRIBUTING.md
- [ ] Archive old Android branch

---

## 🏗️ Architecture Overview

**The three-layer design**:

```
┌──────────────────────────────────────┐
│   Shared Logic (src/shared/)         │
│   Platform-agnostic - NO Electron,   │
│   NO Capacitor, NO platform-specific │
└──────────────────────────────────────┘
           △       △       △
           │       │       │
    ┌──────┴─┐  ┌──┴──┐  ┌─┴──────┐
    │Electron│  │ Web │  │Android │
    │ UI     │  │Build│  │Layer   │
    │ Main/  │  │     │  │src/    │
    │Preload │  │React│  │android/│
    └────────┘  └─────┘  └────────┘
```

**Key principle**: Everything Android-specific goes in `src/android/` or config files. The rest stays unchanged.

---

## 📊 Expected Outcomes

After full implementation:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Merge conflicts | Frequent | <1 per merge | 90% fewer |
| Time to sync upstream | Days | Hours | 10x faster |
| Files modified per merge | 10+ | 2-3 | 80% fewer |
| Developer effort | High | Low | 90% less |
| Divergence from upstream | 205 commits | 0 | Perfect sync |
| Release velocity | Blocked | Independent | Unblocked |

---

## 🧪 The Critical Test

After Phases 1-4 (before touching Kotlin), verify the architecture works:

```bash
# 1. Create Android branch
git checkout -b android/main
git add .
git commit -m "feat: add Android platform support"

# 2. Update main
git checkout main
git pull origin main

# 3. Rebase Android onto main
git checkout android/main
git rebase main

# 4. EXPECTED RESULT: 0 conflicts ✓
# WHY: All Android code is isolated
```

If you see conflicts here, stop and review architecture.

---

## 📞 Who Should Do What

### Tech Lead
- [ ] Read README + STRATEGY docs
- [ ] Decide: Proceed? Modify? Reject?
- [ ] Assign developer(s)
- [ ] Create milestone in project board

### Senior Developer (Architecture)
- [ ] Read all docs
- [ ] Review Phase 1 code against principles
- [ ] Code review for architecture compliance
- [ ] Help resolve any phase blockers

### Android Developer
- [ ] Read IMPLEMENTATION_GUIDE
- [ ] Implement Phases 1-4 (weeks 1-2)
- [ ] Implement Phase 5: Kotlin/Capacitor (week 3)
- [ ] Test on device

### Kotlin Engineer
- [ ] Review Phase 5 once drafted
- [ ] Implement or review `GfnPlugin.kt`
- [ ] Wire Capacitor bridge
- [ ] Set up CI/CD for Android builds

### DevOps/CI-CD
- [ ] Review GIT_WORKFLOW_ANDROID.md (Merge Scenarios)
- [ ] Set up Android build pipeline
- [ ] Test signing setup
- [ ] Release procedure

### QA/Tester
- [ ] Verify both Electron and Android builds work
- [ ] Test merge scenarios (Scenario 1 in GIT_WORKFLOW)
- [ ] Validate no regressions

---

## 📈 Success Criteria

Check each of these after implementation:

✅ **Architecture**
- [ ] All Android code in `src/android/` or config files
- [ ] `src/shared/` is untouched
- [ ] Platform detection centralizes in `src/platform.ts`
- [ ] No scattered platform checks

✅ **Functionality**
- [ ] Electron build works (`npm run dist`)
- [ ] Web build works (`npm run build:web`)
- [ ] Android build works (`npm run build:android`)
- [ ] All tests pass (`npm run test`)

✅ **Merge Capability**
- [ ] Merge upstream v0.3.9 to `android/main`: 0 conflicts
- [ ] Merge upstream v0.4.0 to `android/main`: 0 conflicts
- [ ] Both platforms work after each merge

✅ **Code Quality**
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No regressions in Electron
- [ ] Tested on Android device (if Phase 5 done)

---

## 🎓 Learning Resources

**Documents in this repo**:
1. README_ANDROID_REBUILD.md (start here)
2. ANDROID_REBUILD_STRATEGY.md (deep dive)
3. ANDROID_IMPLEMENTATION_GUIDE.md (hands-on)
4. GIT_WORKFLOW_ANDROID.md (operations)

**External resources**:
- Capacitor: https://capacitorjs.com/docs
- Vite: https://vitejs.dev/
- Git rebase: https://git-scm.com/docs/git-rebase
- React + TypeScript: https://react.dev/learn/typescript

**This repo's docs**:
- [docs/development.md](docs/development.md) - General dev setup
- [CONTRIBUTING.md](CONTRIBUTING.md) - Update with Android workflow
- [AGENTS.md](AGENTS.md) - Build priorities (refer to here)

---

## ⏱️ Timeline

```
Week 1 (Phases 1-2)
├── Day 1-2: Platform detection, Android module, auth refactor
├── Day 3: Build config, Capacitor setup
└── Daily: npm run typecheck

Week 2 (Phases 3-4)
├── Day 4-5: Integration (main, preload, renderer)
├── Day 6: Full verification & merge test
└── Day 7: Emergency fixes if needed

Week 3 (Phase 5 - Optional)
├── Days 8-9: Create GfnPlugin.kt (OAuth)
├── Days 10-11: Token storage + testing
├── Days 12-14: Device testing, polish
└── Release v0.4.0-android

Ongoing (After implementation)
├── Weekly: Check divergence from main
├── Monthly: Full upstream sync + test
└── Quarterly: Architecture review
```

---

## ❓ Common Questions

**Q: Do I need to know Kotlin to do this?**
A: No. Phases 1-4 are pure TypeScript. Only Phase 5 requires Kotlin expertise.

**Q: Will this break the Electron build?**
A: No. All changes are isolated. Electron build is identical after Phase 4.

**Q: What if I want to do this incrementally?**
A: You can! After Phase 2, both builds exist. Android team can work on Phase 5 in parallel.

**Q: How do I handle merge conflicts when they occur?**
A: See "Scenario 1: Upstream Releases" in GIT_WORKFLOW_ANDROID.md.

**Q: Can I skip Phase 5 (Kotlin) and just do web?**
A: Yes. Phases 1-4 give you a web build that Capacitor can wrap. You'd need Kotlin for native features (OAuth, token encryption).

**Q: What if upstream changes `src/android/`?**
A: Extremely unlikely. Upstream doesn't know about Android. If it happens, it's a merge conflict you handle manually.

---

## 🚀 Next Steps

1. **Stakeholder review** (30 min)
   - Share README_ANDROID_REBUILD.md
   - Get approval to proceed
   - Assign developer(s)

2. **Developer preparation** (1 hour)
   - Read ANDROID_REBUILD_STRATEGY.md
   - Read ANDROID_IMPLEMENTATION_GUIDE.md (Phase 1)
   - Set up dev environment

3. **Start Phase 1** (Day 1)
   - Create `src/platform.ts`
   - See ANDROID_IMPLEMENTATION_GUIDE.md Task 1.1

4. **Weekly check-ins**
   - Progress on phase(s)
   - Blockers/concerns
   - Adjust timeline if needed

5. **Post-Phase-4 merge test** (Critical!)
   - Test upstream merge works cleanly
   - Document results
   - Proceed to Phase 5 or adjust

---

## 📞 Support

**Questions about the strategy?**
- Read ANDROID_REBUILD_STRATEGY.md Section 3 (Design Decisions)

**Stuck on implementation?**
- Check ANDROID_IMPLEMENTATION_GUIDE.md corresponding task
- Run `npm run typecheck` to catch type errors
- Check GIT_WORKFLOW_ANDROID.md "Troubleshooting"

**Merge conflicts during sync?**
- Follow "Scenario 1: Upstream Releases" in GIT_WORKFLOW_ANDROID.md
- Review merged files against architecture principles
- Escalate if conflicts in `src/shared/`

**Questions about maintenance?**
- Read GIT_WORKFLOW_ANDROID.md
- Start with "Branch Structure" section

---

## 📋 Document Status

| Document | Status | Audience | Read Time |
|----------|--------|----------|-----------|
| README_ANDROID_REBUILD.md | ✓ Ready | Everyone | 5-10 min |
| ANDROID_REBUILD_STRATEGY.md | ✓ Ready | Tech leads | 20-30 min |
| ANDROID_IMPLEMENTATION_GUIDE.md | ✓ Ready | Developers | Reference |
| GIT_WORKFLOW_ANDROID.md | ✓ Ready | Maintainers | Reference |
| This index | ✓ Ready | Everyone | 10 min |

---

## ✨ Vision

After this rebuild:

> "The Android client is a first-class platform target that can be updated independently or in sync with Electron, with zero merge conflicts from upstream."

---

**Last updated**: April 28, 2026
**Status**: Ready for implementation
**Total effort**: 15 developer days (Phases 1-4) + 4 days (Phase 5 Kotlin)
**Expected payoff**: Zero merge conflicts forever + independent platform development

Start with [README_ANDROID_REBUILD.md](README_ANDROID_REBUILD.md) →
