# WellLite

Offline-first mobile app for collecting well and water-point survey data in the field. Field workers can log a well's location, condition, and water-level readings without a signal, then sync everything once they're back online.

## Features

- **Offline-first submission** — every save writes to a local SQLite queue first; nothing is lost if there's no connection.
- **Background sync** — queued wells and readings are pushed to the server automatically once online, with sync status surfaced in the UI.
- **Interactive map** — view nearby wells (surveyed and unsurveyed) and your current location, with an offline cache of the last-seen data.
- **Multi-language support** — English, Amharic, Amharic (Latin script), and Oromo.
- **Auth with membership selection** — register/login gates the app; accounts with multiple organizational memberships are prompted to pick one at sign-in.

## Tech stack

- [Expo](https://docs.expo.dev/versions/v56.0.0/) SDK 56 + Expo Router v4 (typed routes)
- React 19 / React Native 0.85
- TypeScript (strict)
- [`op-sqlite`](https://github.com/OP-Engineering/op-sqlite) + [Drizzle ORM](https://orm.drizzle.team/) for the local database
- `expo-secure-store` for auth token storage
- `expo-location` for GPS
- `@react-native-community/netinfo` for connectivity detection
- `@maplibre/maplibre-react-native` for the map screen
- React Native Paper for UI
- axios for HTTP

## Project structure

```
app/                  Expo Router routes
  (auth)/              Sign-up, sign-in, password reset, onboarding
  (app)/                Gated screens: map (index), enter well data, profile
components/
  atoms/                Small reusable UI primitives (buttons, inputs, labels)
  molecules/            Composed UI (form fields, banners, dropdowns)
  organisms/             Larger composite UI (dialogs, modals)
lib/
  api/                  HTTP calls to the backend (auth, wells, readings, sync)
  auth.tsx              Auth context/provider and session state machine
  http.ts               axios instance, token storage, refresh/interceptor logic
  sync.ts               Drains the local offline queue to the server
  network.tsx            Connectivity context
  i18n/                  Translations and the useT() hook
db/
  schema.ts             Drizzle table definitions (pending queue + wells cache)
  index.ts               Opens the local SQLite DB, runs schema/migrations
assets/                 Images, logos, icons
```

## Getting started

### Prerequisites

- Node.js and npm
- [Expo CLI](https://docs.expo.dev/versions/v56.0.0/get-started/installation/) (via `npx`, no global install needed)
- Xcode (for iOS) and/or Android Studio (for Android), if running on device/simulator rather than Expo Go

### Setup

```bash
npm install
```

Create a `.env` file in the project root with the backend API URL:

```
EXPO_PUBLIC_API_BASE_URL=https://your-api-host
```

### Run

```bash
npm start        # Expo dev server
npm run ios      # Run on iOS simulator
npm run android  # Run on Android emulator
npm run web      # Run in a browser
```

## Architecture notes

**Offline-first data flow:** submissions in `enter-well-data` write locally first — either straight to the server if online, or into the `pendingWells`/`pendingReadings` queue (`db/schema.ts`) if not. Each queued record carries a `client_uuid` generated once per screen instance, used as an idempotency key so retries don't create duplicates. `lib/sync.ts`'s `runSync()` drains that queue via a batch endpoint whenever the app detects connectivity, and `PendingSyncBanner` shows pending/failed state to the user. The map screen also keeps a `wellsCache` table as a last-known snapshot so it has something to render when offline.

**Auth flow:** `AuthProvider` (`lib/auth.tsx`) tracks `loading` / `signedIn` / `signedOut` status. Tokens live in `expo-secure-store` (`lib/http.ts`), which also handles silent token refresh and force-logout via an axios interceptor. Logging in with an account tied to multiple memberships surfaces a `pendingSelection` state, prompting the user to choose one before the session completes.

## Testing

Unit tests (Jest) cover the offline-first and auth logic in `lib/`. See [TESTING.md](./TESTING.md) for what's covered, how to run tests, and conventions for mocking Drizzle/SecureStore/etc.

```bash
npm test
```

## License

See [LICENSE](./LICENSE).
