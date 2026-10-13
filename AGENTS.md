This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators.
- Route groups: `(app)/` = authenticated screens, `(auth)/` = login/signup/forgot-password.
- Route files are thin wrappers — actual logic and UI live in `src/screens/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Keep non-route code (components, hooks, utils) outside `src/app/`.
- Docs: https://docs.expo.dev/router/introduction.md

## Folder Structure

```
src/
  app/          # routes (Expo Router) — thin files, only import from screens/
  screens/      # screen logic and UI
  components/
    ui/         # primitives (Skeleton, Toggle, etc.)
    molecules/  # reusable composites (FormField, AdBanner, etc.)
    organisms/  # complex blocks (SideDrawer, ExportPdfModal, etc.)
  hooks/        # data hooks (useExpenses, useIncomings, etc.)
  services/     # local SQLite and Supabase calls
  db/
    client.ts   # SQLite initialization
    migrations.ts
    seeds/      # SQL queries and initial seeds
  lib/          # domain utilities (backup, pdf, supabase, google-signin)
  context/      # providers (Auth, Theme, Toast, Locale, Intl)
  schemas/      # Zod validation schemas for forms
  types/        # TypeScript types (including generated supabase.types.ts)
  constants/    # theme, ads IDs
  i18n/         # translations (pt-BR, en, es-ES)
  utils/        # pure helper functions
```

## Database

- Uses `expo-sqlite` with **SQLCipher** enabled (`useSQLCipher: true` in `app.json`).
- Initialization and migrations in `src/db/client.ts` and `src/db/migrations.ts`.
- SQL queries live in `src/db/seeds/queries/` — one file per entity.
- Services in `src/services/` bridge hooks and queries.
- Do not write raw SQL outside `src/db/` and `src/services/`.

## Data & State

- **TanStack React Query** for caching and data synchronization.
- Data hooks live in `src/hooks/` (e.g. `useExpenses`, `useIncomings`).
- No global state manager (Redux, Zustand) — prefer Query + Context.
- Remote backup via Supabase Storage — logic in `src/lib/backup/`.

## Authentication

- Supabase Auth: email/password and Google Sign-In.
- Provider in `src/context/auth.tsx`, client in `src/lib/supabase.ts`.
- Google Sign-In in `src/lib/google-signin.ts` — do not modify without reading the SHA-1 section in CLAUDE.md.

## Internationalization

- Supported languages: pt-BR, en, es-ES. Files in `src/i18n/`.
- Provider in `src/context/intl-provider.tsx` using `react-intl`.
- Always add translation keys in all three languages when adding new text.

## Building with EAS

Use EAS for build, sign, submit (`eas build`, `eas submit`) and OTA updates (`eas update`).

```bash
# Production Android build (run from project root)
npx eas-cli@latest build --profile production --platform android
```

Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories exist, do not edit them manually — configure native behavior via `app.json` and config plugins.
- Expo Go does not include custom native modules. After adding a library with native code, rebuild via EAS.
- Prefer Expo modules over third-party libraries when available.
- Never use `npm install` or `yarn add` directly — always use `npx expo install`.
