# Sección 6: Temas y modo oscuro.

---

## Índice.

- [6.1 Arquitectura del Sistema de Temas](#61-arquitectura-del-sistema-de-temas)
- [6.2 CSS Custom Properties (Variables CSS)](#62-css-custom-properties-variables-css)
- [6.3 SCSS Variables (Design Tokens)](#63-scss-variables-design-tokens)
- [6.4 Theme Service (Gestión de Temas)](#64-theme-service-gestión-de-temas)
- [6.5 Theme Switcher Component](#65-theme-switcher-component)
- [6.6 Detección de Preferencia del Sistema](#66-detección-de-preferencia-del-sistema)
- [6.7 Transiciones Suaves](#67-transiciones-suaves)
- [6.8 Ejemplos de Uso](#68-ejemplos-de-uso)
- [6.9 Capturas de Pantalla](#69-capturas-de-pantalla)

---

## 6.1 Arquitectura del sistema de temas.

### Descripción general:

El proyecto implementa un **sistema completo de temas** que permite alternar entre modo claro y modo oscuro, con:

- **CSS Custom Properties** para valores dinámicos.
- **SCSS Variables** para design tokens estáticos.
- **Theme Service** (Angular) para lógica de negocio.
- **Persistencia** en localStorage.
- **Detección automática** de preferencia del sistema.
- **Transiciones suaves** entre temas.

### Stack tecnológico:

| Tecnología | Uso |
|------------|-----|
| **CSS Custom Properties** | Variables CSS nativas (`--color-primary`) |
| **SCSS** | Preprocesador para variables y mixins |
| **Angular Signals** | Reactividad en ThemeService |
| **localStorage** | Persistencia de preferencia del usuario |
| **prefers-color-scheme** | Detección de preferencia del sistema operativo |

### Estructura de archivos:

```
frontend/src/
├── styles/
│   └── 00-settings/
│       ├── _css-variables.scss       # CSS Custom Properties (231 líneas)
│       └── _variables.scss           # SCSS Variables (415 líneas)
├── services/
│   └── theme.service.ts              # Servicio de gestión de temas (221 líneas)
└── components/
    └── layout/
        └── header/
            ├── header.ts             # Lógica del theme switcher
            └── header.html           # UI del botón de tema
```

---

## 6.2 CSS Custom Properties (Variables CSS):

### Ubicación:

**Archivo:** `frontend/src/styles/00-settings/_css-variables.scss`


### Temas definidos:

El sistema define **2 temas completos**:

1. **Tema oscuro** (por defecto en `:root`)
2. **Tema claro** (en clase `.light-theme`)


### Estructura de variables:

El sistema usa **60+ variables CSS** organizadas en categorías:

```scss
:root {
  // ========================================
  // TEMA OSCURO (por defecto)
  // ========================================

  // 1. COLORES DE FONDO
  --bg-primary: #172133;        // Fondo principal
  --bg-secondary: #1a1f2e;      // Fondo secundario (cards)
  --bg-tertiary: #20283a;       // Fondo terciario (hover)
  --bg-elevated: #273047;       // Elementos elevados
  --bg-overlay: rgba(23, 33, 51, 0.95);

  // 2. COLORES DE TEXTO
  --text-primary: #f8fafc;      // Texto principal
  --text-secondary: #cbd5e1;    // Texto secundario
  --text-tertiary: #94a3b8;     // Texto terciario
  --text-disabled: #64748b;     // Texto deshabilitado
  --text-inverse: #1e293b;      // Texto invertido

  // 3. COLORES DE BORDE
  --border-primary: #273047;    // Borde principal
  --border-secondary: #1f2937;  // Borde secundario
  --border-hover: #374151;      // Borde hover

  // 4. COLORES DE SOMBRA
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5);

  // 5. COLORES SEMÁNTICOS
  --color-primary: #8b5cf6;     // Morado
  --color-secondary: #fbbf24;   // Amarillo
  --color-accent: #ff3366;      // Rosa/Rojo
  --color-success: #10b981;     // Verde
  --color-error: #ef4444;       // Rojo
  --color-warning: #f59e0b;     // Naranja
  --color-info: #3b82f6;        // Azul

  // 6. ESTADOS HOVER
  --bg-hover: rgba(139, 92, 246, 0.1);
  --bg-active: rgba(139, 92, 246, 0.2);
  --bg-selected: rgba(139, 92, 246, 0.15);
}
```

### Tema claro:

```scss
.light-theme {
  // ========================================
  // TEMA CLARO
  // ========================================

  // 1. COLORES DE FONDO
  --bg-primary: #f5f5f7;        // Fondo principal (gris muy claro)
  --bg-secondary: #ffffff;      // Fondo secundario (blanco)
  --bg-tertiary: #ebebed;       // Fondo terciario
  --bg-elevated: #ffffff;       // Elementos elevados
  --bg-overlay: rgba(255, 255, 255, 0.95);

  // 2. COLORES DE TEXTO
  --text-primary: #1e293b;      // Texto principal (oscuro)
  --text-secondary: #475569;    // Texto secundario
  --text-tertiary: #64748b;     // Texto terciario
  --text-disabled: #94a3b8;     // Texto deshabilitado
  --text-inverse: #f8fafc;      // Texto invertido

  // 3. COLORES DE BORDE
  --border-primary: #e2e8f0;    // Borde principal
  --border-secondary: #cbd5e1;  // Borde secundario
  --border-hover: #94a3b8;      // Borde hover

  // 4. COLORES DE SOMBRA
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.2);

  // 5. COLORES SEMÁNTICOS (sin cambios, se mantienen iguales)
  --color-primary: #8b5cf6;
  --color-secondary: #fbbf24;
  --color-accent: #ff3366;
  // ... (resto igual)

  // 6. ESTADOS HOVER (más sutiles en tema claro)
  --bg-hover: rgba(139, 92, 246, 0.05);
  --bg-active: rgba(139, 92, 246, 0.1);
  --bg-selected: rgba(139, 92, 246, 0.08);
}
```

### Ventajas del sistema:

**Cambio instantáneo:** Al cambiar la clase del body, todas las variables se actualizan.
**Mantenible:** Un solo lugar para definir colores por tema.
**Performante:** CSS nativo, sin JavaScript para recalcular estilos.
**Escalable:** Fácil añadir nuevos temas (ej: tema azul, tema verde).

---

## 6.3 SCSS variables (Design Tokens).

### Ubicación:

**Archivo:** `frontend/src/styles/00-settings/_variables.scss`

### Diferencia con CSS Custom Properties:

| CSS Custom Properties | SCSS Variables |
|----------------------|----------------|
| **Dinámicas** (cambian en runtime) | **Estáticas** (se compilan) |
| `--color-primary` | `$color-primary-500` |
| Se usan en componentes | Se usan en mixins/funciones SCSS |
| Soportan cambio de tema | No cambian después de compilar |


### Paleta de colores:

#### Colores primarios (morado):

```scss
$color-primary-50: #f5f3ff;
$color-primary-100: #ede9fe;
$color-primary-200: #ddd6fe;
$color-primary-300: #c4b5fd;
$color-primary-400: #a78bfa;
$color-primary-500: #8b5cf6;  // Color principal
$color-primary-600: #7c3aed;
$color-primary-700: #6d28d9;
$color-primary-800: #5b21b6;
$color-primary-900: #4c1d95;
```

#### Colores secundarios (amarillo):

```scss
$color-secondary-50: #fffbeb;
$color-secondary-100: #fef3c7;
$color-secondary-200: #fde68a;
$color-secondary-300: #fcd34d;
$color-secondary-400: #fbbf24;  // Amarillo principal
$color-secondary-500: #f59e0b;
$color-secondary-600: #d97706;
$color-secondary-700: #b45309;
$color-secondary-800: #92400e;
$color-secondary-900: #78350f;
```

#### Colores de acento (rosa/rojo):

```scss
$color-accent-500: #ff3366;    // Rosa principal
$color-accent-600: #e62958;
$color-accent-700: #cc1f4a;
```

#### Colores semánticos:

```scss
$color-success: #10b981;  // Verde - operaciones exitosas
$color-error: #ef4444;    // Rojo - errores
$color-warning: #f59e0b;  // Naranja - advertencias
$color-info: #3b82f6;     // Azul - información
```

### Colores de tipos Pokémon:

```scss
// 18 tipos de Pokémon con colores oficiales
$type-normal: #a8a878;
$type-fire: #f08030;
$type-water: #6890f0;
$type-electric: #f8d030;
$type-grass: #78c850;
$type-ice: #98d8d8;
$type-fighting: #c03028;
$type-poison: #a040a0;
$type-ground: #e0c068;
$type-flying: #a890f0;
$type-psychic: #f85888;
$type-bug: #a8b820;
$type-rock: #b8a038;
$type-ghost: #705898;
$type-dragon: #7038f8;
$type-dark: #705848;
$type-steel: #b8b8d0;
$type-fairy: #ee99ac;
```

### Sistema de espaciado (4px base):

```scss
$spacing-0: 0;
$spacing-1: 0.25rem;  // 4px
$spacing-2: 0.5rem;   // 8px
$spacing-3: 0.75rem;  // 12px
$spacing-4: 1rem;     // 16px
$spacing-5: 1.25rem;  // 20px
$spacing-6: 1.5rem;   // 24px
$spacing-8: 2rem;     // 32px
$spacing-10: 2.5rem;  // 40px
$spacing-12: 3rem;    // 48px
$spacing-16: 4rem;    // 64px
$spacing-20: 5rem;    // 80px
$spacing-24: 6rem;    // 96px
$spacing-32: 8rem;    // 128px
```

### Tipografía:

```scss
// Familias
$font-primary: 'Inter', sans-serif;
$font-secondary: 'Poppins', sans-serif;
$font-mono: 'JetBrains Mono', monospace;

// Tamaño base
$font-size-base: 1rem; // 16px

// Escala tipográfica (ratio 1.25)
$font-size-xs: 0.75rem;     // 12px
$font-size-sm: 0.875rem;    // 14px
$font-size-base: 1rem;      // 16px
$font-size-lg: 1.125rem;    // 18px
$font-size-xl: 1.25rem;     // 20px
$font-size-2xl: 1.5rem;     // 24px
$font-size-3xl: 1.875rem;   // 30px
$font-size-4xl: 2.25rem;    // 36px
$font-size-5xl: 3rem;       // 48px

// Pesos
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
$font-weight-extrabold: 800;
```

### Breakpoints (Mobile-first):

```scss
$breakpoint-xs: 480px;   // Móviles pequeños
$breakpoint-sm: 640px;   // Móviles estándar
$breakpoint-md: 768px;   // Tablets
$breakpoint-lg: 1024px;  // Laptops
$breakpoint-xl: 1280px;  // Desktops
$breakpoint-2xl: 1536px; // Pantallas grandes
```

---

## 6.4 Theme Service (Gestión de temas).

### Ubicación:

**Archivo:** `frontend/src/services/theme.service.ts`


### Descripción:

Servicio Angular injectable que gestiona todo el ciclo de vida del sistema de temas:

- Detección de preferencia del sistema.
- Persistencia en localStorage.
- Cambio de tema con transiciones.
- API reactiva con Signals.


### Código completo:

```typescript
import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  // Signals reactivos
  currentTheme = signal<Theme>('dark');
  isDarkTheme = signal<boolean>(true);

  private readonly STORAGE_KEY = 'theme';

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
    }

    // Effect: sincroniza isDarkTheme con currentTheme
    effect(() => {
      this.isDarkTheme.set(this.currentTheme() === 'dark');
    });
  }

  /**
   * Inicializa el tema al cargar la aplicación
   * Prioridad: 1. localStorage -> 2. sistema -> 3. oscuro
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme | null;

    if (savedTheme) {
      this.setTheme(savedTheme, false); // Sin transición inicial
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(systemPrefersDark ? 'dark' : 'light', false);
    }

    // Escuchar cambios en preferencia del sistema
    this.listenToSystemThemeChanges();
  }

  /**
   * Establece un tema específico
   * @param theme - 'light' | 'dark'
   * @param withTransition - Aplicar transición suave (default: true)
   */
  setTheme(theme: Theme, withTransition: boolean = true): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Aplicar clase de transición
    if (withTransition) {
      document.body.classList.add('theme-transitioning');
    } else {
      document.body.classList.add('no-transitions');
    }

    // Aplicar tema
    const body = document.body;
    const html = document.documentElement;

    if (theme === 'dark') {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      html.classList.remove('light-theme');
      html.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      html.classList.remove('dark-theme');
      html.classList.add('light-theme');
    }

    // Actualizar signal
    this.currentTheme.set(theme);

    // Guardar en localStorage
    localStorage.setItem(this.STORAGE_KEY, theme);

    // Remover clase de transición después de 350ms
    if (withTransition) {
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 350);
    } else {
      setTimeout(() => {
        document.body.classList.remove('no-transitions');
      }, 50);
    }
  }

  /**
   * Alterna entre tema claro y oscuro
   */
  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Establece tema claro temporalmente (sin guardar en localStorage)
   * Usado en landing page
   */
  setTemporaryLightTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const body = document.body;
    const html = document.documentElement;

    body.classList.add('light-theme', 'no-transitions');
    html.classList.add('light-theme', 'no-transitions');

    this.currentTheme.set('light');

    setTimeout(() => {
      body.classList.remove('no-transitions');
      html.classList.remove('no-transitions');
    }, 50);
  }

  /**
   * Restaura el tema guardado desde localStorage
   */
  restoreSavedTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme | null;

    if (savedTheme) {
      this.setTheme(savedTheme, false);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(systemPrefersDark ? 'dark' : 'light', false);
    }
  }

  /**
   * Resetea a la preferencia del sistema (limpia localStorage)
   */
  resetToSystemPreference(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.removeItem(this.STORAGE_KEY);

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(systemPrefersDark ? 'dark' : 'light');
  }

  /**
   * Escucha cambios en la preferencia del sistema
   */
  private listenToSystemThemeChanges(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    darkModeQuery.addEventListener('change', (e) => {
      // Solo aplicar si no hay tema guardado
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}
```

### API pública:

| Método | Descripción |
|--------|-------------|
| `setTheme(theme, withTransition?)` | Establece tema específico |
| `toggleTheme()` | Alterna entre claro/oscuro |
| `setTemporaryLightTheme()` | Tema claro temporal (sin persistir) |
| `restoreSavedTheme()` | Restaura tema guardado |
| `resetToSystemPreference()` | Vuelve a preferencia del sistema |


### Signals (propiedades reactivas):

| Signal | Tipo | Descripción |
|--------|------|-------------|
| `currentTheme` | `'light' \| 'dark'` | Tema actual |
| `isDarkTheme` | `boolean` | `true` si es tema oscuro |

---

## 6.5 Theme Switcher Component.

### Ubicación:

**Componente:** `frontend/src/components/layout/header/header.ts`
**Template:** `frontend/src/components/layout/header/header.html`


### Implementación en header:

#### TypeScript (header.ts):

```typescript
import { ThemeService } from '@services/theme.service';

export class HeaderComponent {
  themeService = inject(ThemeService); // Inyección pública

  showThemeButton = computed(() => {
    // No mostrar en landing ni en quiz
    return !this.isLandingPage() && !this.isQuizMode();
  });

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
```

#### HTML (header.html):

```html
<!-- Botón de Theme Switcher (líneas 70-96) -->
@if (showThemeButton) {
  <button
    class="header__action-btn header__theme-btn"
    (click)="toggleTheme()"
    [attr.aria-label]="
      themeService.isDarkTheme()
        ? 'Cambiar a tema claro'
        : 'Cambiar a tema oscuro'
    "
    type="button">

    <!-- Icono Sol: mostrar cuando está en modo oscuro -->
    @if (themeService.isDarkTheme()) {
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="header__icon">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    }

    <!-- Icono Luna: mostrar cuando está en modo claro -->
    @if (!themeService.isDarkTheme()) {
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="header__icon">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
      </svg>
    }
  </button>
}
```

#### SCSS (header.scss):

```scss
.header__theme-btn {
  // Estilos base heredados de .header__action-btn
  position: relative;

  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(20deg) scale(1.1);
  }

  &:active svg {
    transform: rotate(-20deg) scale(0.95);
  }
}
```

### Características del Theme Switcher:

**Reactivo:** Usa Signals de Angular para actualización automática.
**Accesible:** `aria-label` dinámico según estado del tema.
**Visual:** Iconos SVG de sol/luna que cambian según tema actual.
**Animado:** Rotación y escala en hover/active.
**Contextual:** Solo visible en rutas de la app (no en landing/quiz).

---

## 6.6 Detección de preferencia del sistema.

### Implementación:

El sistema detecta automáticamente la preferencia del usuario mediante **`prefers-color-scheme`**:

```typescript
// En ThemeService.initializeTheme()
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (!localStorage.getItem('theme')) {
  this.setTheme(systemPrefersDark ? 'dark' : 'light', false);
}
```

### Prioridad de temas:

El sistema sigue esta jerarquía:

1. **Tema guardado en localStorage** (máxima prioridad)
   - Si el usuario cambió manualmente el tema, se respeta siempre.

2. **Preferencia del sistema** (`prefers-color-scheme`)
   - Si no hay tema guardado, se usa la preferencia del SO.

3. **Tema por defecto** (oscuro)
   - Si no hay ni guardado ni detección del sistema.


### Escucha de cambios del sistema:

El servicio **escucha cambios en tiempo real** de la preferencia del sistema:

```typescript
private listenToSystemThemeChanges(): void {
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

  darkModeQuery.addEventListener('change', (e) => {
    // Solo aplicar si no hay tema guardado manualmente
    if (!localStorage.getItem('theme')) {
      this.setTheme(e.matches ? 'dark' : 'light');
    }
  });
}
```

**Ejemplo:** Si el usuario cambia su sistema operativo de modo claro a oscuro (sin haber elegido manualmente en la app), la app cambiará automáticamente.

---


## 6.7 Transiciones suaves.

### Implementación global:

**Archivo:** `frontend/src/styles/styles.scss` (líneas 145-170)

```scss
// ============================================================================
//                      TRANSICIONES DE TEMA
// ============================================================================

// Aplicar transiciones suaves cuando se cambia de tema
body.theme-transitioning,
body.theme-transitioning *,
body.theme-transitioning *::before,
body.theme-transitioning *::after {
  transition-property: background-color, color, border-color, fill, stroke, box-shadow !important;
  transition-duration: 0.3s !important;
  transition-timing-function: ease !important;
}

// Deshabilitar transiciones al navegar o cargar
body.no-transitions,
body.no-transitions *,
body.no-transitions *::before,
body.no-transitions *::after {
  transition: none !important;
}
```

### Propiedades que transicionan:

| Propiedad | Efecto |
|-----------|--------|
| `background-color` | Fondos de elementos |
| `color` | Color de texto |
| `border-color` | Bordes de elementos |
| `fill` | Relleno de SVGs |
| `stroke` | Trazo de SVGs |
| `box-shadow` | Sombras de elementos |

### Timing:

- **Duración:** 300ms (0.3s).
- **Easing:** `ease` (aceleración al inicio, desaceleración al final).
- **Aplicación:** Todos los elementos y pseudo-elementos.

### Clases de control:

| Clase | Uso | Duración |
|-------|-----|----------|
| `.theme-transitioning` | Cambio manual de tema | 350ms |
| `.no-transitions` | Carga inicial / navegación | 50ms (sin transición visible) |

### Flujo de transición:

```
Usuario hace click en theme switcher
      ↓
1. Se añade clase 'theme-transitioning' al body
      ↓
2. Se cambian las clases 'dark-theme' / 'light-theme'
      ↓
3. CSS aplica transiciones suaves (300ms)
      ↓
4. Después de 350ms, se remueve 'theme-transitioning'
```

### Optimización de performance:

**Solo propiedades necesarias:** No transiciona `transform`, `opacity`, etc. (innecesarios para temas).
**Sin transiciones en carga:** Clase `.no-transitions` evita flash al cargar.
**Timing ajustado:** 300ms es rápido pero perceptible (UX óptimo).
**Hardware acceleration:** Las propiedades usadas son GPU-friendly.

---

## 6.8 Ejemplos de uso.

### Uso en componentes (SCSS):

#### Ejemplo 1: Card con variables CSS

```scss
.card {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  box-shadow: var(--shadow-md);

  &:hover {
    background-color: var(--bg-tertiary);
    box-shadow: var(--shadow-lg);
  }
}
```

#### Ejemplo 2: Botón con estados:

```scss
.button {
  background-color: var(--color-primary);
  color: var(--text-inverse);
  border: 2px solid transparent;

  &:hover {
    background-color: var(--bg-hover);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  &:disabled {
    background-color: var(--bg-tertiary);
    color: var(--text-disabled);
  }
}
```

#### Ejemplo 3: Input con foco:

```scss
.input {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);

  &::placeholder {
    color: var(--text-tertiary);
  }

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--bg-hover);
  }

  &:disabled {
    background-color: var(--bg-tertiary);
    color: var(--text-disabled);
    cursor: not-allowed;
  }
}
```

### Uso en TypeScript (Angular).

#### Ejemplo 1: Detectar tema actual:

```typescript
import { ThemeService } from '@services/theme.service';

export class MyComponent {
  themeService = inject(ThemeService);

  ngOnInit() {
    // Leer tema actual (reactivo)
    console.log(this.themeService.currentTheme()); // 'dark' | 'light'
    console.log(this.themeService.isDarkTheme());  // true | false
  }
}
```

#### Ejemplo 2: Cambiar tema programáticamente:

```typescript
export class SettingsComponent {
  themeService = inject(ThemeService);

  setDarkMode() {
    this.themeService.setTheme('dark');
  }

  setLightMode() {
    this.themeService.setTheme('light');
  }

  toggle() {
    this.themeService.toggleTheme();
  }
}
```

#### Ejemplo 3: Condiciones basadas en tema:

```html
<!-- En template -->
<div [class.dark-mode-only]="themeService.isDarkTheme()">
  Este contenido solo se ve en modo oscuro
</div>

<p>
  Tema actual: {{ themeService.currentTheme() }}
</p>
```

#### Ejemplo 4: Effect reactivo:

```typescript
export class ChartComponent {
  themeService = inject(ThemeService);

  constructor() {
    // Recrear gráfico cuando cambia el tema
    effect(() => {
      const isDark = this.themeService.isDarkTheme();
      this.updateChartColors(isDark);
    });
  }

  updateChartColors(isDark: boolean) {
    // Lógica para actualizar colores del gráfico
  }
}
```

### Gestión especial de temas por ruta.

#### Landing Page (siempre claro):

```typescript
// En landing.component.ts
ngOnInit() {
  // Forzar tema claro sin guardar en localStorage
  this.themeService.setTemporaryLightTheme();
}

ngOnDestroy() {
  // Restaurar tema guardado al salir
  this.themeService.restoreSavedTheme();
}
```

#### App Routes (restaurar tema guardado):

```typescript
// En app.component.ts o router guard
constructor() {
  if (this.router.url !== '/') { // No es landing
    this.themeService.restoreSavedTheme();
  }
}
```

---

## 6.9 Capturas de pantalla.

### Página de pokédex:

#### Modo oscuro:
<img width="1738" height="1346" alt="image" src="https://github.com/user-attachments/assets/c4e07769-543b-49b4-b53d-2876f25b113a" />


**Elementos destacados:**
- Filtros con fondo `#20283a`
- Cards de Pokémon con elevación (`--shadow-md`)
- Badges de tipos con colores vibrantes sobre fondo oscuro

#### Modo claro:
<img width="1756" height="1326" alt="image" src="https://github.com/user-attachments/assets/2cc78530-b55c-40d1-81a4-251a0706884d" />


**Elementos destacados:**
- Filtros con fondo `#ffffff`
- Bordes más marcados (`--border-primary`)
- Badges de tipos con bordes sutiles

---

### Página de detalles del Pokémon:

#### Modo oscuro:
<img width="1662" height="1135" alt="image" src="https://github.com/user-attachments/assets/d731ad3a-63eb-4048-bc30-54d0314a010b" />


**Elementos destacados:**
- Hero section con gradiente oscuro
- Sección de estadísticas con colores semánticos vibrantes
- Tabs de navegación con estados hover claros
- Texto secundario legible (`#cbd5e1`)

#### Modo claro:
<img width="1723" height="1169" alt="image" src="https://github.com/user-attachments/assets/a04d8237-2714-4d3b-8892-3ecaabc2c874" />


**Elementos destacados:**
- Hero section con gradiente suave
- Sección de estadísticas con colores menos saturados
- Bordes más definidos en tabs
- Contraste alto para accesibilidad

---

### Página de configuración del Quiz:

#### Modo oscuro:
<img width="2492" height="1285" alt="image" src="https://github.com/user-attachments/assets/430a2cb2-f75f-4ebd-98d2-8802ab207848" />


**Elementos destacados:**
- Fondo de imagen con overlay oscuro semitransparente.
- Card de configuración con fondo `#1a1f2e` y elevación.
- Selectores de dificultad y número de preguntas con estados hover.
- Botones con colores vibrantes sobre fondo oscuro.
- Iconos y badges con alta visibilidad.

#### Modo claro:
<img width="2493" height="1252" alt="image" src="https://github.com/user-attachments/assets/2121d2a8-525e-4c9a-8f84-6fe38e8c0b9a" />


**Elementos destacados:**
- Fondo de imagen con overlay claro sutil.
- Card de configuración con fondo blanco y sombra suave.
- Selectores con bordes definidos y estados hover sutiles.
- Botones con contraste alto para accesibilidad.
- Iconos con colores menos saturados.

---

### Theme Switcher en header:

#### Estado en modo oscuro:
<img width="159" height="109" alt="image" src="https://github.com/user-attachments/assets/4834fb07-a802-4724-b6d3-1a23d2087cb6" />


**Muestra:** Icono de Sol - indica que al hacer click cambiará a modo claro.

#### Estado en modo claro:
<img width="115" height="96" alt="image" src="https://github.com/user-attachments/assets/6d9d8fa7-5fbf-4ac6-af48-efeb2167df0e" />


**Muestra:** Icono de Luna - indica que al hacer click cambiará a modo oscuro.

---

## Comparativa visual:

| Elemento | Modo Oscuro | Modo Claro |
|----------|-------------|------------|
| **Fondo principal** | #172133 (azul oscuro) | #f5f5f7 (gris claro) |
| **Cards** | #1a1f2e (elevadas) | #ffffff (blanco) |
| **Texto principal** | #f8fafc (blanco suave) | #1e293b (oscuro) |
| **Bordes** | #273047 (sutiles) | #e2e8f0 (visibles) |
| **Sombras** | Pronunciadas (profundidad) | Sutiles (elevación) |
| **Hover** | Morado transparente 10% | Morado transparente 5% |

---

## Resumen de implementación.

### Completado:

| Elemento | Detalles |
|----------|----------|
| **CSS Custom Properties** | 60+ variables, 2 temas completos |
| **SCSS Variables** | 415 líneas, design tokens completos |
| **Theme Service** | Signals reactivos, localStorage, detección SO |
| **Theme Switcher** | Botón en header, iconos animados |
| **Persistencia** | localStorage con clave 'theme' |
| **Detección sistema** | prefers-color-scheme + listener |
| **Transiciones** | 300ms suaves en 6 propiedades |
| **Gestión especial** | Landing claro, app con tema guardado |
| **Accesibilidad** | aria-label dinámicos, alto contraste |


### Métricas:

- **Líneas de código CSS:** 231 (variables) + 415 (SCSS).
- **Líneas de código TS:** 221 (ThemeService).
- **Componentes actualizados:** 100% usan variables CSS.
- **Páginas con soporte:** Todas (14 rutas).
- **Tiempo de transición:** 300ms.
- **Temas disponibles:** 2 (oscuro, claro).
- **Navegadores soportados:** Chrome, Firefox, Safari, Edge (modernos).
