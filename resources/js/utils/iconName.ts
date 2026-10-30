/**
 * Convierte un nombre de icono de Lucide a kebab-case, el formato canónico de Lucide.
 *
 * Acepta tanto PascalCase (`MessageSquareWarning`) como kebab-case
 * (`message-square-warning`) para que los valores históricos de la BD sigan funcionando.
 */
export const normalizeIconName = (name?: string | null): string => {
  if (!name) {
    return ''
  }

  return name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/** Presenta un nombre kebab-case como PascalCase para mostrarlo en el selector. */
export const formatIconLabel = (name: string): string =>
  name
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
