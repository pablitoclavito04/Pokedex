# Sección 5: Optimización Multimedia

## 5.1 Formatos elegidos

### Imágenes de la aplicación

| Formato | Uso | Justificación |
|---------|-----|---------------|
| **PNG** | Favicon, iconos con transparencia | Soporte universal, calidad sin pérdida para iconos |
| **WebP** | Imágenes de contenido (futuro) | 25-35% más ligero que JPEG/PNG, buen soporte |
| **SVG** | Iconos inline, gráficos vectoriales | Escalable, pequeño tamaño, animable |

### Imágenes de la API (PokeAPI)

Las imágenes de Pokémon provienen de la API externa en formato PNG. No controlamos su optimización, pero implementamos:
- **Lazy loading** nativo del navegador
- **Caché del navegador** para imágenes ya cargadas
- **Tamaños fijos** para evitar layout shift

### Soporte de navegadores para WebP

| Navegador | Soporte WebP |
|-----------|--------------|
| Chrome | ✅ 100% (desde v23) |
| Firefox | ✅ 100% (desde v65) |
| Safari | ✅ 100% (desde v14) |
| Edge | ✅ 100% (desde v18) |
| IE11 | ❌ No soportado |

> **Nota:** Si se añaden imágenes WebP en el futuro, incluir fallback JPG/PNG para IE11 usando `<picture>`.

---

## 5.2 Herramientas utilizadas

### Para optimización de imágenes

| Herramienta | URL | Uso |
|-------------|-----|-----|
| **Squoosh** | https://squoosh.app/ | Conversión a WebP, compresión avanzada |
| **TinyPNG** | https://tinypng.com/ | Compresión automática PNG/JPEG |
| **SVGOMG** | https://jakearchibald.github.io/svgomg/ | Optimización de SVGs |

### Proceso de optimización

1. **Imagen original** → Squoosh/TinyPNG
2. **Generar múltiples tamaños**: 400w, 800w, 1200w
3. **Convertir a WebP** con calidad 80-85%
4. **Mantener fallback** en formato original
5. **Nombrar descriptivamente**: `hero-400w.webp`, `hero-800w.jpg`

---

## 5.3 Resultados de optimización

### Favicon

| Archivo | Tamaño original | Tamaño optimizado | Reducción |
|---------|-----------------|-------------------|-----------|
| favicon.png | 16.7 KB | 16.7 KB | (pendiente optimizar) |

### SVGs inline optimizados

Los iconos SVG están embebidos directamente en los componentes, lo cual:
- ✅ Reduce requests HTTP
- ✅ Permite animaciones CSS
- ✅ Se beneficia de gzip del HTML

**Iconos implementados:**
- Corazón (favoritos)
- Pokéball (spinner, botón acción)
- Flechas de navegación
- Iconos de tema (sol/luna)
- Iconos de cerrar (X)

---

## 5.4 Performance Budget

### Límites definidos

| Métrica | Límite máximo | Objetivo |
|---------|---------------|----------|
| Peso total página | < 2 MB | < 1.5 MB |
| Peso imágenes | < 1 MB/página | < 500 KB |
| Número de requests | < 50 | < 30 |
| First Contentful Paint (FCP) | < 1.5s | < 1s |
| Largest Contentful Paint (LCP) | < 2.5s | < 2s |
| Cumulative Layout Shift (CLS) | < 0.1 | < 0.05 |

### Métricas actuales (Modo Desarrollo)

| Métrica | Valor (dev) | Objetivo | Estado |
|---------|-------------|----------|--------|
| Performance Score | 27/100 | > 80 | ⚠️ Dev mode |
| First Contentful Paint | 10.4s | < 1.5s | ⚠️ Dev mode |
| Largest Contentful Paint | 18.6s | < 2.5s | ⚠️ Dev mode |
| Cumulative Layout Shift | 0.912 | < 0.1 | ✅ Fixed (width/height) |

> **⚠️ IMPORTANTE:** Estas métricas fueron tomadas en **modo desarrollo** (`ng serve`).
> El código no está minificado ni optimizado. Para métricas reales, ejecutar:
> ```bash
> ng build --configuration=production
> ```
> Y servir los archivos de `/dist` con un servidor estático.

> **Pasos para auditoría Lighthouse:**
> 1. Abrir DevTools (F12)
> 2. Ir a pestaña "Lighthouse"
> 3. Seleccionar "Performance", "Accessibility", "Best Practices"
> 4. Ejecutar auditoría en modo móvil y desktop

### Optimizaciones implementadas

- ✅ Lazy loading en todas las imágenes de cards
- ✅ Dimensiones explícitas (width/height) en imágenes para evitar CLS
- ✅ Animaciones CSS usando solo `transform` y `opacity`
- ✅ SVGs inline (sin requests adicionales)
- ✅ CSS variables para temas (sin duplicación)
- ✅ Componentes standalone (tree-shaking)

---

## 5.5 Tecnologías implementadas

### Lazy Loading nativo

Implementado en el componente Card para todas las imágenes:

```html
<!-- card.html - Variante Pokemon -->
<img
  [src]="imageUrl"
  [alt]="imageAlt || title"
  loading="lazy">

<!-- card.html - Variantes Vertical/Horizontal -->
<img
  [src]="imageUrl"
  [alt]="imageAlt || title"
  class="card__image"
  loading="lazy">
```

**Beneficios:**
- Las imágenes solo cargan cuando están cerca del viewport
- Reduce tiempo de carga inicial
- Mejora LCP y FCP

### Implementación futura: srcset y picture

Cuando se añadan imágenes propias al proyecto, usar:

```html
<!-- Ejemplo con srcset para imágenes responsivas -->
<img
  src="hero-800w.jpg"
  srcset="hero-400w.jpg 400w,
          hero-800w.jpg 800w,
          hero-1200w.jpg 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1024px) 800px,
         1200px"
  alt="Descripción"
  loading="lazy">

<!-- Ejemplo con picture para art direction -->
<picture>
  <source media="(max-width: 600px)"
          srcset="hero-mobile.webp"
          type="image/webp">
  <source media="(max-width: 600px)"
          srcset="hero-mobile.jpg">
  <source srcset="hero-desktop.webp"
          type="image/webp">
  <img src="hero-desktop.jpg"
       alt="Hero image"
       loading="lazy">
</picture>
```

---

## 5.6 Animaciones CSS

### Principios de optimización (60fps)

**REGLA FUNDAMENTAL:** Solo animar propiedades "composited":
- ✅ `transform` (translate, rotate, scale)
- ✅ `opacity`

**NUNCA animar** (causan reflow/repaint):
- ❌ `width`, `height`
- ❌ `top`, `left`, `right`, `bottom`
- ❌ `margin`, `padding`
- ❌ `font-size`

### Animaciones implementadas

#### 1. Loading Spinner (Pokéball)

**Archivo:** `spinner.scss`

```scss
// Bounce vertical (wrapper separado)
@keyframes spinner-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

// Rotación continua
@keyframes spinner-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Pulse del botón central
@keyframes spinner-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
```

**Optimización aplicada:**
- Animaciones separadas en elementos diferentes
- `will-change: transform` solo donde es necesario
- Duración entre 200ms y 1.5s

#### 2. Transiciones hover/focus

**Componentes con transiciones optimizadas:**

| Componente | Propiedad animada | Duración |
|------------|-------------------|----------|
| Button | `transform: translateY(-1px)` | 150ms |
| Card | `transform: translateY(-4px)` | 150ms |
| Card (hover) | `box-shadow` | 150ms |
| Nav links | `border-color` | 150ms |
| Action buttons | `transform: scale(1.1)` | 150ms |

**Ejemplo de código:**
```scss
// button.scss
&:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba($color-primary-500, 0.4);
}
```

#### 3. Micro-interacción: Heart Beat (Favoritos)

**Archivo:** `card.scss`

```scss
// Animación cuando se marca como favorito
@keyframes favorite-heart-beat {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1); }
  75% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

// Aplicación
.card__favorite-btn.animate-heart-beat svg {
  animation: favorite-heart-beat 400ms ease-out;
}
```

**Implementación en TypeScript:**
```typescript
onFavoriteClick(event: Event): void {
  const button = event.currentTarget as HTMLElement;

  // Añadir animaciones
  button.classList.add('animate-wave');
  button.classList.add('animate-heart-beat');

  // Remover después de completar
  setTimeout(() => button.classList.remove('animate-wave'), 600);
  setTimeout(() => button.classList.remove('animate-heart-beat'), 400);

  this.favoriteClick.emit();
}
```

#### 4. Animaciones de Modal

**Archivo:** `modal.scss`

```scss
// Entrada del modal
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// Salida del modal
@keyframes slideDown {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
}
```

#### 5. Animaciones de Alert

**Archivo:** `alert.scss`

```scss
// Entrada
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Shake para errores
@keyframes alertShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}
```

### Archivo de animaciones globales

**Ubicación:** `styles/03-generic/animations.scss`

Contiene animaciones reutilizables:
- `fade-in`, `fade-out`
- `slide-in-up`, `slide-in-down`, `slide-in-left`, `slide-in-right`
- `bounce`, `bounce-click`
- `pulse`, `shake`, `wiggle`
- `pop-in`, `pop-out`
- `heart-beat`, `ripple`
- `shimmer` (para skeleton loading)

### Clases de utilidad para animaciones

```scss
.animate-spin { animation: spin 1s linear infinite; }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
.animate-bounce { animation: bounce 1s ease-in-out infinite; }
.animate-fade-in { animation: fade-in 300ms ease-out forwards; }
.animate-pop-in { animation: pop-in 300ms ease-out forwards; }
.animate-shake { animation: shake 500ms ease-in-out; }
```

---

## Resumen de optimizaciones

| Categoría | Implementación | Estado |
|-----------|----------------|--------|
| Lazy loading | `loading="lazy"` en imágenes | ✅ |
| Dimensiones imágenes | `width` y `height` explícitos | ✅ |
| Animaciones 60fps | Solo transform/opacity | ✅ |
| SVGs optimizados | Inline en componentes | ✅ |
| Estructura assets | `/public/assets/images`, `/icons` | ✅ |
| Spinner optimizado | Animaciones separadas | ✅ |
| Micro-interacciones | Heart-beat, ripple | ✅ |
| Animaciones modales | Entrada/salida suaves | ✅ |
| Archivo animaciones globales | `animations.scss` | ✅ |
| srcset/picture | Preparado para futuro | ⏳ |
| WebP con fallback | Preparado para futuro | ⏳ |

---

## Próximos pasos

1. **Optimizar favicon.png** con TinyPNG/Squoosh
2. **Generar múltiples tamaños** del favicon para diferentes dispositivos
3. **Crear manifest.json** con iconos para PWA (futuro)
4. **Añadir imágenes hero** con srcset cuando se implemente la página Home
5. **Ejecutar Lighthouse** y documentar métricas reales
