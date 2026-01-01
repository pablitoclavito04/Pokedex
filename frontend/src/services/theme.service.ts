import { Injectable, PLATFORM_ID, Inject, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

/**
 * ThemeService - Servicio de gestión global de temas
 *
 * Funcionalidades:
 * - Detecta prefers-color-scheme del sistema
 * - Persiste preferencia en localStorage
 * - Aplica tema al cargar la aplicación
 * - Proporciona signal reactivo para el tema actual
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  private readonly isBrowser: boolean;

  // Signal reactivo para el tema actual (por defecto: light)
  readonly currentTheme = signal<Theme>('light');

  // Signal computado para saber si es tema oscuro
  readonly isDarkTheme = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Inicializar tema al cargar
    if (this.isBrowser) {
      this.initializeTheme();
      this.listenToSystemThemeChanges();
    }

    // Effect para sincronizar isDarkTheme con currentTheme
    effect(() => {
      this.isDarkTheme.set(this.currentTheme() === 'dark');
    });
  }

  /**
   * Inicializa el tema basándose en la preferencia guardada o el tema claro por defecto
   */
  private initializeTheme(): void {
    const savedTheme = this.getSavedTheme();
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('light');
    }
  }

  /**
   * Detecta la preferencia de tema del sistema operativo
   */
  private getSystemThemePreference(): boolean {
    if (!this.isBrowser) return false;

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Escucha cambios en la preferencia del sistema
   * Solo aplica si el usuario no ha elegido manualmente un tema
   */
  private listenToSystemThemeChanges(): void {
    if (!this.isBrowser) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (event) => {
      // Solo cambiar automáticamente si no hay preferencia guardada
      if (!this.getSavedTheme()) {
        this.setTheme(event.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * Obtiene el tema guardado en localStorage
   */
  private getSavedTheme(): Theme | null {
    if (!this.isBrowser) return null;

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return null;
  }

  /**
   * Establece el tema y lo aplica al documento
   */
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);

    if (this.isBrowser) {
      this.applyThemeToDocument(theme);
      this.persistTheme(theme);
    }
  }

  /**
   * Aplica el tema claro temporalmente sin guardarlo (para landing pages)
   * Cambio instantáneo sin transición
   */
  setTemporaryLightTheme(): void {
    this.currentTheme.set('light');
    if (this.isBrowser) {
      this.applyThemeInstant('light');
    }
  }

  /**
   * Restaura el tema guardado en localStorage
   * Cambio instantáneo sin transición
   */
  restoreSavedTheme(): void {
    const savedTheme = this.getSavedTheme();
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
      if (this.isBrowser) {
        this.applyThemeInstant(savedTheme);
      }
    }
  }

  /**
   * Aplica el tema instantáneamente sin transición (para navegación)
   */
  private applyThemeInstant(theme: Theme): void {
    if (!this.isBrowser) return;

    const body = document.body;
    const html = document.documentElement;

    // Deshabilitar todas las transiciones temporalmente
    body.classList.add('no-transitions');

    // Remover clases de tema existentes
    body.classList.remove('light-theme', 'dark-theme', 'theme-transitioning');
    html.classList.remove('light-theme', 'dark-theme');

    // Aplicar nueva clase de tema
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      html.classList.add('dark-theme');
    } else {
      body.classList.add('light-theme');
      html.classList.add('light-theme');
    }

    // Forzar reflow y reactivar transiciones
    void body.offsetHeight;
    body.classList.remove('no-transitions');
  }

  /**
   * Alterna entre tema claro y oscuro
   */
  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Aplica la clase de tema al documento
   */
  private applyThemeToDocument(theme: Theme): void {
    if (!this.isBrowser) return;

    const body = document.body;
    const html = document.documentElement;

    // Añadir clase de transición para suavizar el cambio
    body.classList.add('theme-transitioning');

    // Forzar reflow para que la clase de transición se aplique antes del cambio
    void body.offsetHeight;

    // Remover clases de tema existentes
    body.classList.remove('light-theme', 'dark-theme');
    html.classList.remove('light-theme', 'dark-theme');

    // Aplicar nueva clase de tema
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      html.classList.add('dark-theme');
    } else {
      body.classList.add('light-theme');
      html.classList.add('light-theme');
    }

    // Remover clase de transición después de que termine la animación
    setTimeout(() => {
      body.classList.remove('theme-transitioning');
    }, 350);
  }

  /**
   * Persiste la preferencia de tema en localStorage
   */
  private persistTheme(theme: Theme): void {
    if (!this.isBrowser) return;

    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  /**
   * Limpia la preferencia guardada y vuelve al tema claro
   */
  resetToSystemPreference(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.setTheme('light');
    }
  }
}