// ============================================================================
//          ERROR INTERCEPTOR - Manejo global de errores HTTP
// ============================================================================

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

/**
 * Interceptor que maneja errores HTTP de forma centralizada.
 *
 * Captura errores comunes como:
 * - 401 (No autorizado): Redirige a login
 * - 403 (Prohibido): Muestra mensaje de permisos insuficientes
 * - 404 (No encontrado): Muestra mensaje de recurso no encontrado
 * - 500 (Error de servidor): Muestra mensaje genérico de error
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente (red, timeout, etc.)
        errorMessage = `Error de conexión: ${error.error.message}`;
        console.error('Error del cliente:', error.error.message);
      } else {
        // Error del lado del servidor
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Solicitud incorrecta';
            break;

          case 401:
            // No autorizado - redirigir a login
            errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
            authService.logout();
            router.navigate(['/login'], {
              queryParams: { returnUrl: router.url }
            });
            break;

          case 403:
            errorMessage = 'No tienes permisos para realizar esta acción';
            break;

          case 404:
            // Solo mostrar error si no es de PokeAPI (manejado por servicios)
            if (!req.url.includes('pokeapi.co')) {
              errorMessage = error.error?.message || 'Recurso no encontrado';
            } else {
              // Para PokeAPI, dejar que el servicio maneje el error
              return throwError(() => error);
            }
            break;

          case 409:
            errorMessage = error.error?.message || 'Ya existe un recurso con esos datos';
            break;

          case 422:
            errorMessage = error.error?.message || 'Los datos enviados no son válidos';
            break;

          case 500:
          case 502:
          case 503:
            errorMessage = 'Error del servidor. Por favor, inténtalo más tarde.';
            break;

          default:
            if (error.error?.message) {
              errorMessage = error.error.message;
            }
        }

        console.error(
          `Error HTTP ${error.status}:`,
          error.error?.message || error.message
        );
      }

      // Mostrar toast de error (con excepciones)
      const shouldShowToast =
        // No mostrar para PokeAPI (excepto 401)
        (!req.url.includes('pokeapi.co') || error.status === 401) &&
        // No mostrar para GET /profile (tiene fallback a sessionStorage)
        !(req.url.includes('/api/auth/profile') && req.method === 'GET');

      if (shouldShowToast) {
        toastService.error(errorMessage);
      }

      // Propagar el error para que los servicios puedan manejarlo también
      return throwError(() => error);
    })
  );
};
