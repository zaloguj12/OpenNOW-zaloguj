# Agent 3 - Native Plugin Skeleton + Final Verification (Phases 4 and 5)

## Scope
Handle optional Capacitor Android native plugin scaffold and run final verification across both platform paths.

## File Ownership (edit only these)
- `opennow-stable/android/**` (if generated/updated)
- `android/app/src/main/java/**/GfnPlugin.kt` (if plugin scaffold is added)
- `android-docs/*` (only if documenting verification results)

## Do Not Edit
- `opennow-stable/src/**` (runtime/business logic owned by other agents)
- `opennow-stable/package.json`
- `opennow-stable/vite.config.web.ts`
- `opennow-stable/capacitor.config.json`
- `.gitignore`

## Required Constraints
1. Keep native scope minimal (OAuth/token/plugin bridge skeleton only).
2. Do not break Electron workflow.
3. If native work is not feasible now, skip code changes and only verify readiness.

## Definition of Done
1. Native plugin scaffold exists or is explicitly deferred with reasons.
2. Final checks are run and results reported.
3. Mergeability risk is evaluated (focus on config/native boundaries).

## Validation Commands
Run from repo root:

```powershell
npm run typecheck
npm run build
npm run build:web
npm run build:android
```

