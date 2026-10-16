# SALAMANDR

**Unified frontend host for AxoloteSource services** — a single Laravel + React
SPA (no Inertia) that hosts the frontends of three services behind one shell,
one auth/session, one theme and one sidebar menu.

- Rewards-style shell — `/`, `/dashboard`
- **Authxolote** — `/auth/*` (users, user lists, applications, catalogs, menus, UI kit)
- **LaraAxMessages** — `/messages/*` (WhatsApp templates/info/chats, email, push notifications, campaigns, UI kit)
- WhatsApp **inbound inbox** — `/messages/whatsapp/chats` (view-only for now)

`resources/views/app.blade.php` renders `<body id="root">` and loads
`resources/js/main.tsx`; `routes/web.php` is a catch-all `GET /{any}` (excluding
`api`) → `view('app')`. The shell loads its sidebar from Authxolote.

## Stack

| Layer       | Choice |
| ----------- | ------ |
| Backend     | Laravel 13, PHP 8.3+ (repo runs 8.4) |
| Frontend    | React 19 + TypeScript, Vite 8 |
| Routing     | `react-router-dom` (client-side SPA; Inertia/Wayfinder removed) |
| State/data  | Redux Toolkit (theme) + TanStack Query (server data) |
| UI          | `@axolotesource/ui` (linked to `../ui` locally) |
| Styling     | Tailwind CSS v4 |
| Auth        | Real Authxolote login (Passport bearer token) |
| SDK         | `axolote-source/authxolote-sdk` (auto-discovered service provider) |

## Requirements

- PHP **^8.3** and **Composer 2**
- Node.js and **pnpm**
- [Laravel Herd](https://herd.laravel.com/) (auto-serves at `https://salamandr.test`)
  — or `php artisan serve`
- Reachable Authxolote + LaraAxMessages APIs

## Install

```bash
# 1. PHP deps
composer install

# 2. Environment
cp .env.example .env
php artisan key:generate
#   -> set AUTHXOLOTE_TOKEN (see "Menu sync" below)

# 3. Database (SQLite at database/database.sqlite; a fresh clone has no file)
touch database/database.sqlite
php artisan migrate
#   (no seeding needed — auth is via Authxolote)

# 4. Frontend deps (pnpm) + assets
pnpm install
pnpm build            # or: pnpm dev  (HMR)
# Optional: link the local UI library instead of the published dependency:
#   pnpm lib:local   # @axolotesource/ui = link:../ui   (pnpm lib:prod to revert)

# 5. Set AUTHXOLOTE_TOKEN in .env BEFORE syncing the menu (see "Menu sync")

# 6. Reload config if you edited .env/config (before running or reloading artisan config)
php artisan config:clear

# 7. Sync the unified menu from Authxolote
php artisan authxolote:menu
```

> **One-shot alternative:** `composer run setup` runs the same steps (composer
> install · `.env` · `key:generate` · touch SQLite · migrate · `pnpm install` ·
> `pnpm build`), and `composer run dev` runs the full dev stack
> (`php artisan dev` → `serve` + `queue:listen` + `pail` + Vite).

## Environment

`VITE_*` are read by the frontend; `AUTHXOLOTE_*` by Laravel.

| Key | Purpose | Example |
| --- | ------- | ------- |
| `APP_NAME` | App name (set to `Salamandr`; `.env.example` ships `Laravel`) | `Salamandr` |
| `APP_URL` | Laravel URL (keep consistent with how you serve) | `http://localhost:8000` |
| `DB_CONNECTION` | SALAMANDR's DB | `sqlite` |
| `VITE_APP_URL` | SALAMANDR's own API base (`"${APP_URL}"`) | `http://localhost:8000` |
| `VITE_MESSAGES_URL` | LaraAxMessages API base | `https://laraaxmessages.test` |
| `VITE_AUTH_URL` | Authxolote API base (login + menu source) | `https://authxolote.test` |
| `VITE_MENU_SLUG` | Unified menu slug | `salamandr` |
| `VITE_ENABLE_LIVE_MENUS` | `true` = fetch live menu; `false` = static `configs/menu.config` | `true` |
| `VITE_REAL_AUTH` | `true` = real login + 401 auto-logout; `false` = demo | `true` |
| `AUTHXOLOTE_URL` | Authxolote base for the SDK/artisan | `https://authxolote.test` |
| `AUTHXOLOTE_TOKEN` | Author token for `authxolote:menu` | *(secret — blank in `.env.example`)* |

> Never commit real secrets. `AUTHXOLOTE_TOKEN` is intentionally blank in
> `.env.example`.

## Run

- **Herd:** open <https://salamandr.test> (Herd serves over HTTPS)
- **Without Herd:** `php artisan serve` → <http://localhost:8000> (keep `APP_URL` consistent)
- **Full dev stack:** `composer run dev` (`php artisan dev` → `serve` + `queue:listen` + `pail` + Vite)
- **Assets:** `pnpm dev` (HMR) or `pnpm build` (production)
- **Tests:** `pnpm test:e2e` (Playwright; specs live in `e2e/`)

## Menu sync

The unified sidebar menu is declared in `config/authxolote.php` and pushed to
Authxolote, then fetched by the SPA.

```bash
# 1. Publish the SDK config (if missing) — it ships EMPTY
php artisan vendor:publish --tag=authxolote-config   # -> config/authxolote.php
#    -> fill the `menu` key

# 2. Mint an author token (run INSIDE the Authxolote repo; needs ROOT_USER_EMAIL)
php artisan tinker --execute="echo App\Models\User::where('email', env('ROOT_USER_EMAIL'))->first()->createToken('menu-service')->accessToken;"
#    -> put it in SALAMANDR .env as AUTHXOLOTE_TOKEN (required before step 3)

# 3. Push/refresh the unified menu (safe to re-run; upsert)
php artisan authxolote:menu

# Optional companion: attach the menu actions to roles
php artisan authxolote:actions
```

`authxolote:menu` reads `config('authxolote.menu')` and POSTs it to
`{AUTHXOLOTE_URL}/api/v1/menus/setup` (`auth:api` + `isAllow:auth.menus.store`)
via the SDK. It creates/updates the `salamandr` menu (~23 items: home + auth
group + messages group). The SPA then loads
`GET {VITE_AUTH_URL}/api/v1/menus/salamandr` after login. Requires
`AUTHXOLOTE_URL`, `AUTHXOLOTE_TOKEN`, and a non-empty `menu` config.

## Frontend scripts

| Script | Description |
| ------ | ----------- |
| `pnpm dev` | Vite dev server (HMR) |
| `pnpm build` | Production build → `public/build` |
| `pnpm types` | TypeScript check (`tsc -p tsconfig.dev.json`) |
| `pnpm lint` | ESLint (with `--fix`) |
| `pnpm format` | Prettier over `resources/` |
| `pnpm test:e2e` | Playwright end-to-end tests |
| `pnpm lib:local` / `pnpm lib:prod` | Point `@axolotesource/ui` at `../ui` / the published package |

## Architecture (brief)

- **SPA entry:** `resources/js/main.tsx` mounts into `#root`. Provider stack:
  `AxiosProvider → Redux → App → ThemeProvider → Mantine → QueryClient →
  RouterProvider → AppShell (AxoloteUIProvider)`.
- **Routing:** `resources/js/routes/` — `routes.tsx` aggregates each section
  (`modules/app`, `modules/messages`, `modules/authxolote`, `modules/auth`,
  `modules/errors`); `createBrowserRouter` wraps every route in
  `BlankLayout`/`DefaultLayout`.
- **Auth:** `contexts/AxiosContext` (token + user, cross-tab logout);
  `services/auth/useServiceAuth` (real login). `configs/axiosConfig` adds the
  bearer and handles 401 (menu 401s never log you out).
- **Menu:** `hooks/useAppMenu` fetches the unified menu when authenticated and
  feeds the sidebar; static fallback in `configs/menu.config.ts`.
- **Sections:** pages under `pages/Authxolote/**` and `pages/Messages/**`, each
  with its own `services/*` sharing the `customHost` API pattern
  (`ApisEnum.BaseUrl | BaseMessages | BaseLogin`).
- **Theme/i18n:** Redux `store/themeConfigSlice` (dark/light); inline en/es
  resources merged in `i18n.tsx`.

## Gotchas

1. **Fresh clone has no SQLite file** — run `touch database/database.sqlite`
   (Laravel otherwise prompts). The file is gitignored (`database/.gitignore`).
2. **Menu item slugs are globally unique in Authxolote** — config keys are
   namespaced `salamandr-*` (e.g. `salamandr-auth-users`); bare keys like
   `home`/`ui`/`roles` collide across menus.
3. `.env.example` intentionally leaves `AUTHXOLOTE_TOKEN` blank (blank `menu`
   config too); set both before `authxolote:menu`.
4. The SDK is pinned `dev-main` (fine under `minimum-stability: stable`).
5. Fetching the live menu needs the `auth.menus.show` action on the user's role
   (Root bypasses).
