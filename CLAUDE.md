# CLAUDE.md

Guru Dashboard: a clickable prototype of Great Learning's mentor ("Guru") dashboard for the Ninja platform. It is a front-end-only demo. All data is seeded mock data, most state resets on reload, and nothing talks to a real backend.

## Stack

Vite 6 · React 19 · TypeScript (strict) · MUI v7 + Emotion · Tailwind v3 · Redux Toolkit + RTK Query · react-router-dom **v6** · recharts · dayjs · lucide-react. Capacitor wraps it for Android (`android/`, `webDir: dist`). It deploys on Vercel (`vercel.json`, SPA rewrite everything except `/api/`).

## Commands

```bash
npm install
npm run dev       # Vite dev server, default port 5173
npm run build     # tsc --noEmit && vite build  ← the only type/lint gate that works
npm run preview
```

- `npm run lint` does not work: the repo has no ESLint config.
- There is no test runner. To check a change, run `npm run build` and look at it in the browser.
- `netlify.toml` is stale. It publishes `out/`, but the build writes to `dist/`.

## Layout

- `src/App.tsx`: routes. `/` redirects to `/new-dashboard`. Pages load lazily.
  - Inside `AppLayout` (sidebar + mobile nav): dashboard, courses, calendar, availability, notifications, payments, recommend/*, support, profile, preferences, account, components.
  - Full-bleed, outside `AppLayout`: `/old-dashboard`, `/marketing-dashboard`, `/ninja-availability`, `/recommend/courses`. These copy other tools' chrome on purpose and do not follow the project's visual rules.
  - The `/recommend` routes share one `RecommendProvider` + `RecommendFlowDialog`, so referrals survive navigation between them.
- `src/pages/<Feature>/index.tsx`: page components. Several are very large single files (Components ~3.1k lines, Profile ~2.8k, Calendar ~2.4k, Dashboard ~2k). Read the part you need, not the whole file.
- `src/components/`: `dialogs/` (rendered once at the root by `<GlobalDialogs />`, with open flags in `store/slices/uiSlice.ts`), `shared/` (e.g. `SessionCard`, `StatusChip`), `layout/`, `recommend/`, `video/`, `home/`, `dev/DevPanel.tsx`, `Utils/FlexBox.tsx`.
- `src/store/`: `slices/` for UI state, `selectors/`, and typed hooks `useAppSelector` / `useAppDispatch` in `store/index.ts`.
- `src/api/ninja/`: RTK Query on `fakeBaseQuery`. Endpoints use `queryFn` and read mocks from `__mocks__/`.
- `src/data/demo-*.ts`: seed data. `src/lib/`: types, helpers, constants, role config, timezone, analytics, AI polish client.
- `src/theme/`: MUI theme (`theme.tsx`), tokens. `colors.ts` is the upstream GL palette; only `tokens.ts` reads it, and `tokens.ts` sanitises its quirks. Do not edit `colors.ts`.
- `api/polish.ts`: the one Vercel serverless function (Anthropic SDK, "Polish with AI"). It stays off until `ANTHROPIC_API_KEY` and `VITE_AI_POLISH_ENDPOINT` are set. Until then the client in `src/lib/ai/polishMessage.ts` uses a local mock.
- `docs/`: product context (referral/Ambassadors program, roles audit, design-system plan).

## Demo model

- **The demo's "today" is fixed**: `demoNow` in `src/lib/constants.ts` (currently 2026-04-21 09:00). Date logic and seed data are relative to it, not to the real clock. Some comments in `demo-sessions.ts` still give an older date.
- **The Dev Panel** (button at bottom right; state in `store/slices/devPanelSlice.ts`) controls the persona:
  - Guru role(s): Teacher, Course/Career Mentor, Evaluator, Moderator, and so on. `lib/role-config.ts` maps roles to the session types each one sees.
  - Guru stage: experienced / mid / early / new / empty / onboarding. Stages drive how much data exists and which empty states show.
  - Recommend stage and flags: `noPromoCode` (default on), `pgReferral`, V1 mode.
  - It also links to the full-bleed pages.
  - Its selections persist in `localStorage` (`guru-dev-*` keys).
  - Any new data-dependent UI must behave sensibly at every stage, including `empty`.
- `/components` is the reference gallery for card and chip states. When card variants change, update it too.

## Conventions

**Styling order:**
1. MUI variant / color / size props.
2. `sx` for small tweaks.
3. Theme tokens (`primary.main`, `text.secondary`, `divider`…) instead of hex values.

Never use Emotion `styled()` or inline `style={{}}`. Use `<FlexBox>` instead of `<Stack direction="row">`. (The README mentions `.module.scss`, but the repo has no Sass setup and no scss files.)

**Other styling facts:**
- Theme radius is 4px.
- Emotion is inserted with `prepend: true`, so Tailwind classes win on specificity.
- MUI `Menu` / `Popover` portals don't work with the Emotion Babel plugin here. Use custom `position: fixed` dropdowns positioned with `getBoundingClientRect()`.
- Support both light and dark mode.

**State:**
- Redux slice: UI state that crosses components, including dialog open flags.
- RTK Query: data.
- `useState`: transient local state.

**Components:** plain default-exported functions (no `React.FC`). The `@/` alias maps to `src/`.

**Referral links:** never let the AI polish path touch URLs. The client strips `?ref=` links before calling the model and re-appends them afterwards, because attribution depends on them.

**Commits:** Conventional-commit style with a feature scope, e.g. `feat(recommend): …`, `style(home): …`, `fix(video): …`, `copy(video): …`. The subject is lowercase and imperative. The body explains why.

## Stale docs

- `context.md` describes an older Next.js version of this project at a different path. Ignore it.
- `README.md` is mostly right. Where it disagrees with this file (router version, dev port, lint, scss), trust the code.
- `CHANGELOG.md` was last updated 2026-06-11. Newer history is only in git.
