// ============================================================================
//          BREADCRUMB SERVICE - Servicio de migas de pan dinámicas
// ============================================================================

import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

/**
 * Interfaz para un item de breadcrumb
 */
export interface Breadcrumb {
  label: string;
  url: string;
}

/**
 * Servicio que genera breadcrumbs dinámicos basados en la configuración de rutas.
 * Se actualiza automáticamente en cada navegación.
 */
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Escuchar eventos de navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs: Breadcrumb[] = [];
        this.buildBreadcrumbs(this.route.root, '', breadcrumbs);
        this._breadcrumbs$.next(breadcrumbs);
      });
  }

  /**
   * Construye el array de breadcrumbs recorriendo el árbol de rutas activas.
   */
  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string,
    breadcrumbs: Breadcrumb[]
  ): void {
    const children = route.children;

    if (!children || children.length === 0) {
      return;
    }

    for (const child of children) {
      // Construir la URL del segmento actual
      const routeURL = child.snapshot.url
        .map(segment => segment.path)
        .join('/');

      if (routeURL) {
        url += `/${routeURL}`;
      }

      // Obtener el label del breadcrumb de los datos de la ruta
      const label = child.snapshot.data['breadcrumb'] as string | undefined;

      if (label) {
        // Verificar si es un breadcrumb dinámico (contiene :param)
        let displayLabel = label;

        // Reemplazar parámetros dinámicos
        if (label.includes(':')) {
          const paramMatch = label.match(/:(\w+)/);
          if (paramMatch) {
            const paramName = paramMatch[1];
            const paramValue = child.snapshot.paramMap.get(paramName);
            if (paramValue) {
              displayLabel = label.replace(`:${paramName}`, paramValue);
            }
          }
        }

        // Usar datos resueltos si existen (ej: nombre del Pokémon)
        const resolvedData = child.snapshot.data['pokemon'];
        if (resolvedData?.spanishName && label.includes(':id')) {
          displayLabel = resolvedData.spanishName;
        }

        breadcrumbs.push({ label: displayLabel, url });
      }

      // Continuar recursivamente
      this.buildBreadcrumbs(child, url, breadcrumbs);
    }
  }

  /**
   * Permite establecer breadcrumbs manualmente (útil para casos especiales)
   */
  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this._breadcrumbs$.next(breadcrumbs);
  }

  /**
   * Añade un breadcrumb al final de la lista actual
   */
  addBreadcrumb(breadcrumb: Breadcrumb): void {
    const current = this._breadcrumbs$.getValue();
    this._breadcrumbs$.next([...current, breadcrumb]);
  }
}
