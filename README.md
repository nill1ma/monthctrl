# Month Ctrl

[![Platform](https://img.shields.io/badge/platform-Android-green)](https://play.google.com/store/apps/details?id=com.developmentsnil.monthctrl)
[![Status](https://img.shields.io/badge/status-internal%20testing-yellow)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

A personal finance mobile app for tracking monthly income and expenses. Built with Expo and React Native.

## Screenshots

<!-- Add screenshots or a GIF of the main flow here -->

## Features

- Register and categorize income and expenses
- Monthly summary with totals by currency
- Export reports as PDF
- Encrypted local database (SQLCipher)
- Automatic cloud backup via Supabase Storage
- Google Sign-In and email/password authentication
- Multi-language support (Portuguese, English, Spanish)
- Dark/light theme

## Tech Stack

- **Framework:** Expo SDK 57 / React Native 0.86.3 / React 19
- **Routing:** Expo Router (file-based)
- **Auth & Backend:** Supabase
- **Local DB:** expo-sqlite + SQLCipher
- **State/Cache:** TanStack React Query
- **Forms:** React Hook Form + Zod
- **Ads:** Google AdMob
- **i18n:** react-intl + expo-localization

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- EAS CLI (for builds)

### Installation

```bash
npm install
```

### Environment

Create a `.env` file at the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_WEB_CLIENT=your_google_web_client_id
```

### Running

```bash
# Start dev server (requires a development build)
npx expo start --dev-client --clear
```

> **Note:** This project uses native modules (SQLCipher, Google Sign-In, AdMob) and cannot run on Expo Go. A development build is required.

### Development Build

```bash
npx eas-cli@latest build --profile development --platform android
```

### Production Build

```bash
npx eas-cli@latest build --profile production --platform android
```

## Project Structure

```
src/
  app/          # Routes (Expo Router)
  screens/      # Screen logic and UI
  components/   # UI primitives, molecules and organisms
  hooks/        # Data hooks
  services/     # SQLite and Supabase queries
  db/           # Database client, migrations and seeds
  lib/          # Domain utilities (backup, pdf, supabase)
  context/      # React providers
  schemas/      # Zod validation schemas
  i18n/         # Translation files
  types/        # TypeScript types
  constants/    # Theme and ad unit IDs
```

## Contributing

See [AGENTS.md](./AGENTS.md) for development guidelines and conventions.

## License

MIT
