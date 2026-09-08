# Testing

Unit tests use Jest with the `jest-expo` preset.

## Running tests

```
npm test
npm test -- --watch
npx tsc --noEmit   # also typechecks the test files (strict mode)
```

## What's covered, and why

Tests target the app's actual risk areas: offline sync, auth/token handling,
and local caching — the places where a silent bug would corrupt data or lock
a user out, and where a regression is easy to introduce without noticing.

- `lib/*.ts`/`lib/*.tsx` — state machines and logic modules (`http`, `sync`,
  `auth`, `wellsCache`, `network`, `i18n`) are covered.
- `lib/api/*.ts` — only the files with real logic beyond `http.get/post` are
  covered (e.g. `wells.ts`'s param mapping, `auth.ts`'s
  `isMembershipSelectionRequired` guard). Thin pass-through wrappers aren't.
- `app/**` screens and `components/**` UI are **not** covered. Testing these
  meaningfully needs React Native Testing Library plus mocks for op-sqlite,
  SecureStore, Location and NetInfo end-to-end — a lot of setup for
  comparatively little bug-catching value right now. Rely on manual testing
  there unless a component has real conditional logic worth locking down.

## Where tests live

Colocated next to the module they test, as `*.test.ts` / `*.test.tsx` — no
separate `__tests__` tree. For example:

- `lib/http.test.ts`
- `lib/sync.test.ts`
- `lib/auth.test.tsx`
- `lib/wellsCache.test.ts`
- `lib/network.test.tsx`
- `lib/i18n/index.test.ts`
- `lib/api/auth.test.ts`, `lib/api/wells.test.ts`

## How to mock the common dependencies

- **`@/db` and `@/db/schema` (Drizzle)** — mock both. Keep the table-identity
  objects inline in the `@/db/schema` mock factory (see the hoisting gotcha
  below) and compare against them by reference in the `@/db` mock.
  See `lib/wellsCache.test.ts`, `lib/sync.test.ts`.
- **`expo-secure-store`** — mock `getItemAsync`/`setItemAsync`/
  `deleteItemAsync` against a plain in-memory object. See `lib/http.test.ts`.
- **`axios` / `./http`** — to test the interceptors themselves, use
  `axios-mock-adapter` against the real `http` instance
  (see `lib/http.test.ts`). For modules that just call `http.get`/`http.post`,
  mock `../http` directly instead (see `lib/api/wells.test.ts`).
- **React context/providers with effects** — render with
  `react-test-renderer` + `act`, and read the hook's value out through a
  small `Probe` component that calls the hook and reports it via a callback.
  See `lib/network.test.tsx`, `lib/auth.test.tsx`.

## Two gotchas that will cost you time otherwise

**Mock-hoisting trap.** A factory like
`jest.mock('@/module', () => ({ foo: someOuterConst }))` bakes in whatever
`someOuterConst` holds _at the moment the factory runs_. Babel hoists ES
`import`s above other top-level statements, so the factory can run before
your `const` is even initialized — silently baking in `undefined` forever
(module exports are cached after the first require). Fix: inline the mock's
values directly in the factory, or `require()` an already-mocked dependency
lazily from inside another factory/function body — never read an outer
`const` at the top level of a factory's return value. See `lib/sync.test.ts`.

**Effects with real delays.** Some effects wait on a real timer (e.g.
`lib/auth.tsx`'s `MIN_SPLASH_MS`). Don't await a real `setTimeout` in the
test — it's slow and can race with the component's own timer in a way that
produces "not wrapped in act" warnings and stale assertions. Instead, use
`jest.useFakeTimers()` and `jest.advanceTimersByTime(...)` inside
`act(async () => { ... })`, followed by a few `await Promise.resolve()` ticks
to drain any promises chained off the timer. See `lib/auth.test.tsx`.

## Should this get a test?

- Pure logic, data mapping, or a fallback chain → yes.
- A state machine gating access or data integrity (auth, sync) → yes.
- A thin wrapper that just calls `http.get`/`http.post` → no.
- A screen or UI component → generally no for now — ask first if it has real
  conditional logic worth locking down.
