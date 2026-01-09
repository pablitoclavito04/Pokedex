// ============================================================================
//          AUTH INTERCEPTOR - Añade token JWT a peticiones protegidas
// ============================================================================

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

/**
 * Interceptor que añade automáticamente el token JWT a las peticiones HTTP
 * que requieren autenticación.
 *
 * Solo añade el token a peticiones hacia el backend de la aplicación,
 * no a APIs externas como PokeAPI.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Lista de URLs que requieren autenticación
  const protectedUrls = [
    'pokedex-backend',  // Backend principal
    '/api/auth/profile',
    '/api/auth/delete-account',
    '/api/favoritos'
  ];

  // Verificar si la petición es hacia una URL protegida
  const isProtectedUrl = protectedUrls.some(url => req.url.includes(url));

  // Si hay token y es una URL protegida, clonar la petición y añadir el header
  if (token && isProtectedUrl) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // Si no, continuar con la petición original
  return next(req);
};
