// ============================================================================
//          APP CONFIG - Configuración de la aplicación Angular
// ============================================================================

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor, errorInterceptor, loggingInterceptor } from './interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Restaurar posición de scroll al navegar
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      // Precargar todos los módulos lazy en segundo plano
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,    // Añade token JWT automáticamente
        errorInterceptor,   // Manejo global de errores HTTP
        loggingInterceptor  // Debug de peticiones en consola
      ])
    )
  ]
};
