# SALAMANDR

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/imgs/logo-white.png">
    <img src="public/imgs/axolote-salamandr.svg" alt="Salamandr" width="360">
  </picture>
</p>

**Host frontend unificado para los servicios de AxoloteSource** — una única SPA
de Laravel + React (sin Inertia) que aloja los frontends de tres servicios tras
un solo shell: una sesión/auth, un tema y un menú lateral.

- Shell estilo Rewards — `/`, `/dashboard`
- **Authxolote** — `/auth/*` (usuarios, listas de usuarios, aplicaciones, catálogos, menús, UI kit)
- **LaraAxMessages** — `/messages/*` (plantillas/info/chats de WhatsApp, email, notificaciones push, campañas, UI kit)
- Bandeja de entrada **inbound** de WhatsApp — `/messages/whatsapp/chats` (solo lectura por ahora)

`resources/views/app.blade.php` renderiza `<body id="root">` y carga
`resources/js/main.tsx`; `routes/web.php` es un catch-all `GET /{any}`
(excluyendo `api`) → `view('app')`. El shell carga su barra lateral desde
Authxolote.

## Stack

| Capa        | Elección |
| ----------- | -------- |
| Backend     | Laravel 13, PHP 8.3+ (el repo corre en 8.4) |
| Frontend    | React 19 + TypeScript, Vite 8 |
| Ruteo       | `react-router-dom` (SPA del lado del cliente; Inertia/Wayfinder eliminados) |
| Estado/datos | Redux Toolkit (tema) + TanStack Query (datos del servidor) |
| UI          | `@axolotesource/ui` (enlazado a `../ui` localmente) |
| Estilos     | Tailwind CSS v4 |
| Auth        | Login real con Authxolote + rotación de refresh token (bearer de Passport) |
| SDK         | `axolote-source/authxolote-sdk` (service provider auto-descubierto) |

## Requisitos

- PHP **^8.3** y **Composer 2**
- Node.js y **pnpm**
- [Laravel Herd](https://herd.laravel.com/) (sirve automáticamente en `https://salamandr.test`)
  — o `php artisan serve`
- APIs de Authxolote y LaraAxMessages accesibles

## Instalación

Primero configura el entorno y después ejecuta los pasos de instalación.

```bash
# 1. Entorno
cp .env.example .env
#   -> define APP_NAME, APP_URL, AUTHXOLOTE_URL, AUTHXOLOTE_TOKEN
#      y las variables VITE_* (ver "Entorno" más abajo)

# 2. Dependencias PHP
composer install

# 3. Clave de la aplicación
php artisan key:generate

# 4. Dependencias del frontend + assets
pnpm install
pnpm build            # o: pnpm dev (HMR)
# Opcional: enlazar la librería UI local en lugar de la dependencia publicada:
#   pnpm lib:local   # @axolotesource/ui = link:../ui   (pnpm lib:prod para revertir)

# 5. Recarga la config si editaste .env/config
php artisan config:clear

# 6. Sincroniza el menú unificado desde Authxolote
php artisan authxolote:menu
```

> Si `php artisan authxolote:menu` falla, revisa el log de la aplicación en
> `storage/logs/laravel.log` (o ejecuta `php artisan pail` en otra terminal):
>
> ```bash
> tail -n 100 storage/logs/laravel.log
> ```
>
> Ahí verás el error del SDK/HTTP. Las causas habituales son un
> `AUTHXOLOTE_TOKEN` ausente o expirado, un `AUTHXOLOTE_URL` inaccesible o una
> config `menu` vacía. Para más detalle, define `AUTHXOLOTE_DEBUG=true` en
> `.env`, ejecuta `php artisan config:clear` y vuelve a intentarlo.

> **Alternativa en un solo paso:** `composer run setup` ejecuta el equivalente
> automatizado (composer install · `.env` · `key:generate` · `pnpm install` ·
> `pnpm build`), y `composer run dev` ejecuta el stack completo de desarrollo
> (`php artisan dev` → `serve` + `queue:listen` + `pail` + Vite).

> **No se requiere base de datos.** Las sesiones y la caché usan archivos
> (`storage/framework/`), la cola corre en `sync` y la autenticación se hace
> contra Authxolote con tokens bearer. No necesitas SQLite, migraciones ni
> variables `DB_*`.

## Entorno

Las `VITE_*` las lee el frontend; las `AUTHXOLOTE_*` las lee Laravel.

| Clave | Propósito | Ejemplo |
| ----- | --------- | ------- |
| `APP_NAME` | Nombre de la app (definido como `Salamandr`; `.env.example` trae `Laravel`) | `Salamandr` |
| `APP_URL` | URL de Laravel (mantenla consistente con cómo sirves) | `http://localhost:8000` |
| `VITE_APP_URL` | Base de la API propia de SALAMANDR (`"${APP_URL}"`) | `http://localhost:8000` |
| `VITE_MESSAGES_URL` | Base de la API de LaraAxMessages | `https://laraaxmessages.test` |
| `VITE_AUTH_URL` | Base de la API de Authxolote (login + fuente del menú) | `https://authxolote.test` |
| `VITE_MENU_SLUG` | Slug del menú unificado | `salamandr` |
| `VITE_ENABLE_LIVE_MENUS` | `true` = obtiene el menú en vivo desde Authxolote; `false` = sin menú | `true` |
| `VITE_REAL_AUTH` | `true` = login real + auto-logout en 401; `false` = demo | `true` |
| `AUTHXOLOTE_URL` | Base de Authxolote para el SDK/artisan | `https://authxolote.test` |
| `AUTHXOLOTE_SYNC_USER` | `false` = usa el usuario de la API directamente (sin BD local) | `false` |
| `AUTHXOLOTE_TOKEN` | Token de autor para `authxolote:menu` | *(secreto — vacío en `.env.example`)* |

> Nunca hagas commit de secretos reales. `AUTHXOLOTE_TOKEN` está intencionalmente
> vacío en `.env.example`.

## Ejecución

- **Herd:** abre <https://salamandr.test> (Herd sirve por HTTPS)
- **Sin Herd:** `php artisan serve` → <http://localhost:8000> (mantén `APP_URL` consistente)
- **Stack completo de desarrollo:** `composer run dev` (`php artisan dev` → `serve` + `queue:listen` + `pail` + Vite)
- **Assets:** `pnpm dev` (HMR) o `pnpm build` (producción)
- **Pruebas:** `pnpm test:e2e` (Playwright; los specs viven en `e2e/`)

## Sincronización del menú

El menú lateral unificado se declara en `config/authxolote.php`, se envía a
Authxolote y luego lo obtiene la SPA.

```bash
# 1. Publica la config del SDK (si falta) — viene VACÍA
php artisan vendor:publish --tag=authxolote-config   # -> config/authxolote.php
#    -> completa la clave `menu`

# 2. Genera un token de autor (ejecuta DENTRO del repo de Authxolote; requiere ROOT_USER_EMAIL)
php artisan tinker --execute="echo App\Models\User::where('email', env('ROOT_USER_EMAIL'))->first()->createToken('menu-service')->accessToken;"
#    -> colócalo en el .env de SALAMANDR como AUTHXOLOTE_TOKEN (requerido antes del paso 3)

# 3. Envía/refresca el menú unificado (seguro de re-ejecutar; upsert)
php artisan authxolote:menu

# Complemento opcional: adjunta las acciones del menú a los roles
php artisan authxolote:actions
```

`authxolote:menu` lee `config('authxolote.menu')` y lo envía por POST a
`{AUTHXOLOTE_URL}/api/v1/menus/setup` (`auth:api` + `isAllow:auth.menus.store`)
a través del SDK. Crea/actualiza el menú `salamandr` (~23 ítems: home + grupo
auth + grupo messages). Luego la SPA carga
`GET {VITE_AUTH_URL}/api/v1/menus/salamandr` tras el login. Requiere
`AUTHXOLOTE_URL`, `AUTHXOLOTE_TOKEN` y una config `menu` no vacía.

Si `php artisan authxolote:menu` falla, revisa `storage/logs/laravel.log`
antes de cambiar la configuración.

## Scripts del frontend

| Script | Descripción |
| ------ | ----------- |
| `pnpm dev` | Servidor de desarrollo Vite (HMR) |
| `pnpm build` | Build de producción → `public/build` |
| `pnpm types` | Verificación de TypeScript (`tsc -p tsconfig.dev.json`) |
| `pnpm lint` | ESLint (con `--fix`) |
| `pnpm format` | Prettier sobre `resources/` |
| `pnpm test:e2e` | Pruebas end-to-end con Playwright |
| `pnpm lib:local` / `pnpm lib:prod` | Apunta `@axolotesource/ui` a `../ui` / al paquete publicado |

## Arquitectura (breve)

- **Entrada de la SPA:** `resources/js/main.tsx` se monta en `#root`. Stack de
  providers: `AxiosProvider → Redux → App → ThemeProvider → Mantine → QueryClient →
  RouterProvider → AppShell (AxoloteUIProvider)`.
- **Ruteo:** `resources/js/routes/` — `routes.tsx` agrega cada sección
  (`modules/app`, `modules/messages`, `modules/authxolote`, `modules/auth`,
  `modules/errors`); `createBrowserRouter` envuelve cada ruta en
  `BlankLayout`/`DefaultLayout`.
- **Auth:** `contexts/AxiosContext` (token + usuario, bootstrap de sesión, logout
  entre pestañas); `services/auth/useServiceAuth` (login real). `configs/axiosConfig`
  envía el bearer solo a los hosts autorizados y, ante 401, rota los tokens vía
  `lib/authSession` y reintenta una vez. Los tokens viven en `lib/authStorage`
  (`authToken`, `refreshToken`, `authSessionId`, `user`).
- **Menú:** `hooks/useAppMenu` obtiene el menú unificado cuando hay sesión y
  alimenta la barra lateral. No hay fallback estático: la barra queda vacía
  hasta que responde Authxolote.
- **Secciones:** páginas bajo `pages/Authxolote/**` y `pages/Messages/**`, cada
  una con sus propios `services/*` que comparten el patrón de API `customHost`
  (`ApisEnum.BaseUrl | BaseMessages | BaseLogin`).
- **Tema/i18n:** Redux `store/themeConfigSlice` (oscuro/claro); recursos en/es
  en línea fusionados en `i18n.tsx`.

## Consideraciones

1. **Los slugs de los ítems del menú son globalmente únicos en Authxolote** — las
   claves de config van con namespace `salamandr-*` (p. ej. `salamandr-auth-users`);
   claves simples como `home`/`ui`/`roles` chocan entre menús.
2. `.env.example` deja intencionalmente `AUTHXOLOTE_TOKEN` vacío (y también la config
   `menu`); define ambos antes de `authxolote:menu`.
3. El SDK está fijado a `dev-main` (correcto bajo `minimum-stability: stable`).
4. Obtener el menú en vivo requiere la acción `auth.menus.show` en el rol del
   usuario (Root la omite).
