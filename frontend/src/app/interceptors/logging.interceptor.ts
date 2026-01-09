// ============================================================================
//          LOGGING INTERCEPTOR - Registro de peticiones HTTP (desarrollo)
// ============================================================================

import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

/**
 * Interceptor que registra todas las peticiones y respuestas HTTP en consola.
 *
 * Útil para debugging durante el desarrollo.
 * En producción, este interceptor puede ser desactivado o configurado
 * para enviar logs a un servicio de monitoreo.
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();

  // Registrar la petición
  console.group(`🌐 HTTP ${req.method} → ${req.url}`);
  console.log('📤 Request:', {
    method: req.method,
    url: req.url,
    headers: req.headers.keys().reduce((acc, key) => {
      // No mostrar tokens completos por seguridad
      if (key === 'Authorization') {
        acc[key] = req.headers.get(key)?.substring(0, 20) + '...';
      } else {
        acc[key] = req.headers.get(key);
      }
      return acc;
    }, {} as Record<string, string | null>),
    body: req.body
  });

  return next(req).pipe(
    tap({
      next: (event) => {
        // Solo registrar cuando se complete la respuesta
        if (event instanceof HttpResponse) {
          const elapsedTime = Date.now() - startTime;
          console.log(`📥 Response (${elapsedTime}ms):`, {
            status: event.status,
            statusText: event.statusText,
            body: event.body
          });
          console.groupEnd();
        }
      },
      error: (error) => {
        const elapsedTime = Date.now() - startTime;
        console.error(`❌ Error (${elapsedTime}ms):`, {
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message || error.message
        });
        console.groupEnd();
      }
    })
  );
};
