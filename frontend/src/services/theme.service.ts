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

  // Signal reactivo para el tema actual
  readonly currentTheme = signal<Theme>('dark');

  // Signal computado para saber si es tema oscuro
  readonly isDarkTheme = signal<boolean>(true);

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
   * Inicializa el tema basándose en:
   * 1. Preferencia guardada en localStorage
   * 2. Preferencia del sistema (prefers-color-scheme)
   * 3. Tema oscuro por defecto
   */
  private initializeTheme(): void {
    const savedTheme = this.getSavedTheme();

    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Detectar preferencia del sistema
      const prefersDark = this.getSystemThemePreference();
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  /**
   * Detecta la preferencia de tema del sistema operativo
   */
  private getSystemThemePreference(): boolean {
    if (!this.isBrowser) return true;

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
}

  /**
   * Persiste la preferencia de tema en localStorage
   */
  private persistTheme(theme: Theme): void {
    if (!this.isBrowser) return;

    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  /**
   * Limpia la preferencia guardada y vuelve a la del sistema
   */
  resetToSystemPreference(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.STORAGE_KEY);
      const prefersDark = this.getSystemThemePreference();
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }
}
