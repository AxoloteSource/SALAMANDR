/**
 * API hosts for the unified SALAMANDR frontend (HAG-9).
 *
 * Each section of the SPA talks to its own backend; services pass the matching
 * host through the shared `customHost` option in `hooks/useApi`.
 */
export enum ApisEnum {
  /** SALAMANDR API (rewards shell / backoffice). */
  BaseUrl = import.meta.env.VITE_APP_URL || '/api',
  /** LaraAxMessages API — Roberto (HAG-7). */
  BaseMessages = import.meta.env.VITE_MESSAGES_URL || '/messages-api',
  /** Authxolote API — Jim (HAG-8). Also used for the menus pipeline. */
  BaseLogin = import.meta.env.VITE_AUTH_URL || '/auth'
}
