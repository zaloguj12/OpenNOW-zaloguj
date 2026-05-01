# Agent 2 - Build and Config Split (Phase 2)

## Scope
Implement web/Android build configuration, scripts, and ignore rules.

## File Ownership (edit only these)
- `opennow-stable/vite.config.web.ts`
- `opennow-stable/capacitor.config.json`
- `opennow-stable/package.json`
- `.gitignore`

## Do Not Edit
- Any `opennow-stable/src/main/**`
- Any `opennow-stable/src/preload/**`
- Any `opennow-stable/src/renderer/**`
- Any `opennow-stable/src/android/**`

## Required Constraints
1. Do not change existing Electron build behavior.
2. Keep config-driven separation between Electron and Android/Web.
3. Do not introduce platform logic into `src/shared/`.

## Definition of Done
1. `npm run build` still succeeds for Electron path.
2. `npm run build:web` builds `dist/`.
3. `npm run build:android` is wired for Capacitor sync.
4. Ignore rules cover Android/generated artifacts.

## Validation Commands
Run from repo root:

```powershell
npm run build
npm run build:web
```

