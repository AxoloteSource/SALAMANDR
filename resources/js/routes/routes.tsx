import IRoute from '@/interfaces/IRoute'
import { appRoutes } from './modules/app.routes'
import { authRoutes } from './modules/auth.routes'
import { authxoloteRoutes } from './modules/authxolote.routes'
import { errorRoutes } from './modules/errors.routes'
import { messagesRoutes } from './modules/messages.routes'

// HAG-9 unified host: aggregator for every section of the SPA.
//   appRoutes       — rewards shell (Diego)
//   messagesRoutes  — LaraAxMessages (Roberto, HAG-7)
//   authxoloteRoutes — Authxolote (Jim, HAG-8)
// errorRoutes carries the '*' catch-all, so it must stay last.
const routes: IRoute[] = [...appRoutes, ...messagesRoutes, ...authxoloteRoutes, ...authRoutes, ...errorRoutes]

export { routes }
