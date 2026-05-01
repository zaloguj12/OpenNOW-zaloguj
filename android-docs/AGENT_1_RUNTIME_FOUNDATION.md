# Agent 1 - Runtime + Foundation (Phases 1 and 3)

## Scope
Implement platform detection, Android module foundations, auth contract integration, and runtime wiring.

## File Ownership (edit only these)
- `opennow-stable/src/platform.ts`
- `opennow-stable/src/platform.test.ts`
- `opennow-stable/src/shared/auth/contract.ts`
- `opennow-stable/src/android/index.ts`
- `opennow-stable/src/android/auth.ts`
- `opennow-stable/src/android/cryptoShim.ts`
- `opennow-stable/src/android/capacitorBridge.ts`
- `opennow-stable/src/main/gfn/auth.ts`
- `opennow-stable/src/main/index.ts`
- `opennow-stable/src/preload/index.ts`
- `opennow-stable/src/renderer/src/App.tsx`

## Do Not Edit
- `opennow-stable/package.json`
- `opennow-stable/vite.config.web.ts`
- `opennow-stable/capacitor.config.json`
- `.gitignore`
- Any `opennow-stable/android/**` native files

## Required Constraints
1. Keep Android-specific logic in `src/android/`.
2. Keep `src/shared/` platform-agnostic (contracts/types only).
3. Preserve Electron behavior.

## Definition of Done
1. Runtime platform detection works.
2. Auth contract abstraction is in place.
3. Android runtime init path exists without breaking desktop flow.
4. `npm run typecheck` passes.

## Validation Commands
Run from repo root:

```powershell
npm run typecheck
```

