#!/bin/sh
set -e

# Salamandr no usa base de datos (sesiones/cache en archivos dentro de storage).
php artisan storage:link --force || true
php artisan optimize

# Sincroniza el menu unificado desde Authxolote. Desactivar con SYNC_AUTHXOLOTE=false.
# Un fallo (auth caido o token invalido) no detiene el contenedor.
if [ "${SYNC_AUTHXOLOTE:-true}" = "true" ]; then
	php artisan authxolote:menu || echo "authxolote:menu fallo; se continua."
fi

exec "$@"
