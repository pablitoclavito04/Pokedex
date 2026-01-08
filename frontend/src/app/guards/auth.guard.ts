// ============================================================================
//          AUTH GUARD - Protección de rutas autenticadas
// ============================================================================

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige a /login con returnUrl.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirigir a login con la URL de retorno
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

/**
 * Guard inverso: redirige a home si ya está autenticado.
 * Útil para páginas de login/register.
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  // Si ya está logueado, redirigir al inicio
  return router.createUrlTree(['/']);
};
