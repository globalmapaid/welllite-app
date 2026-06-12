@AGENTS.md

# WellLite

Offline-first form submission app built with Expo + TypeScript.

## Tech Stack
- Expo SDK 56 + Expo Router v4
- TypeScript (strict)
- op-sqlite + Drizzle ORM (local database)
- expo-secure-store (auth tokens)
- Expo Location
- @react-native-community/netinfo
- React Native Paper (UI)

## Architecture
- Offline-first: all data written locally, synced when online
- Auth flow (register/login) gates the main app
- Minimal folder structure — not a large app

## Rules
- Always enter Plan mode before starting a new task
- No changes without explicit user approval
- Minimal, clean solutions — no over-engineering
- Read versioned Expo docs (v56) before writing Expo-specific code
