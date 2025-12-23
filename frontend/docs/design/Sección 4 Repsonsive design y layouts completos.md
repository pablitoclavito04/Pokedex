# Sección 4 Repsonsive design y layouts completos.

## Índice
- [4.1 Breakpoints definidos](#41-breakpoints-definidos)
- [4.2 Estrategia responsive elegida](#42-estrategia-responsive-elegida)
- [4.3 Container Queries](#43-container-queries)
- [4.4 Adaptaciones por componente](#44-adaptaciones-por-componente)
- [4.5 Screenshots comparativos](#45-screenshots-comparativos)

---

## 4.1 Breakpoints Definidos.

### Sistema de breakpoints:

| Breakpoint | Píxeles | Uso principal |
|------------|---------|---------------|
| `xs` | 480px | Móvil pequeño (iPhone SE, Galaxy S) |
| `sm` | 640px | Móvil grande (iPhone Pro Max, Galaxy Plus) |
| `md` | 768px | Tablet (iPad Mini, tablets Android) |
| `lg` | 1024px | Desktop pequeño / Tablet landscape |
| `xl` | 1280px | Desktop estándar |
| `2xl` | 1536px | Desktop grande / monitores anchos |

### Justificación de los valores:

- **480px (xs)**: Cubre dispositivos móviles muy pequeños. Por debajo de este valor, el diseño se mantiene en su forma más compacta.

- **640px (sm)**: Punto donde los móviles más grandes empiezan a tener espacio suficiente para layouts de dos columnas en algunos contextos.

- **768px (md)**: Breakpoint estándar de la industria para tablets. El header cambia de menú hamburguesa a navegación horizontal.

- **1024px (lg)**: Desktop pequeño. El footer muestra todas sus columnas, los grids de cards pueden tener 3 columnas.

- **1280px (xl)**: Desktop estándar. Contenedores alcanzan su ancho máximo.

- **1536px (2xl)**: Para monitores muy anchos, permite espaciado adicional.

### Definición en código:

```scss
// _variables.scss
$breakpoint-xs: 480px;    // Móvil pequeño
$breakpoint-sm: 640px;    // Móvil grande
$breakpoint-md: 768px;    // Tablet
$breakpoint-lg: 1024px;   // Desktop
$breakpoint-xl: 1280px;   // Desktop grande
$breakpoint-2xl: 1536px;  // Desktop extra grande
```

---

## 4.2 Estrategia Responsive Elegida.

### Mobile-First

Este proyecto utiliza la estrategia **Mobile-First**, donde los estilos base están diseñados para móviles y se añaden media queries con `min-width` para pantallas más grandes.

### Justificación:

1. **Rendimiento**: Los dispositivos móviles cargan primero los estilos esenciales, sin descargar CSS innecesario.

2. **Priorización del contenido**: Obliga a diseñar pensando primero en lo esencial, evitando sobrecarga visual.

3. **Progresión natural**: Es más intuitivo añadir funcionalidades (columnas, espaciado) que quitarlas.

4. **Tendencia actual**: La mayoría del tráfico web proviene de dispositivos móviles.

### Mixin `respond-to`

```scss
// _mixins.scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'xs' {
    @media (min-width: $breakpoint-xs) { @content; }
  }
  @else if $breakpoint == 'sm' {
    @media (min-width: $breakpoint-sm) { @content; }
  }
  @else if $breakpoint == 'md' {
    @media (min-width: $breakpoint-md) { @content; }
  }
  @else if $breakpoint == 'lg' {
    @media (min-width: $breakpoint-lg) { @content; }
  }
  @else if $breakpoint == 'xl' {
    @media (min-width: $breakpoint-xl) { @content; }
  }
  @else if $breakpoint == '2xl' {
    @media (min-width: $breakpoint-2xl) { @content; }
  }
}
```

### Ejemplo de uso en componentes:

```scss
// header.scss - Ejemplo Mobile-First
.header__nav {
  // Base: Móvil - menú oculto
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;

  &--open {
    display: block;
  }

  // Desktop: navegación siempre visible
  @include respond-to('md') {
    display: block;
    position: static;
    background: transparent;
  }
}

.header__nav-list {
  // Base: Móvil - apilado vertical
  display: flex;
  flex-direction: column;
  gap: $spacing-2;

  // Desktop: horizontal
  @include respond-to('md') {
    flex-direction: row;
    gap: $spacing-6;
  }
}
```

---

## 4.3 Container Queries.

### ¿Qué son las Container Queries?

Las Container Queries permiten que un componente se adapte al tamaño de su contenedor padre, no al viewport. Esto hace que los componentes sean verdaderamente reutilizables e independientes del contexto donde se usen.

### Componentes con Container Queries:

#### 1. Card Component (`app-card`)

**Razón**: Las cards se usan en grids de diferentes columnas. Con Container Queries, una card puede ser vertical en un grid de 3 columnas y horizontal en un grid de 1 columna, sin necesidad de cambiar props.

```scss
// card.scss
:host {
  display: block;
  container-type: inline-size;
  container-name: card-container;
}

.card--responsive {
  // Base: vertical (contenedores pequeños)
  flex-direction: column;

  .card__image-wrapper {
    width: 100%;
    height: 180px;
  }

  // Contenedor > 400px: horizontal
  @container card-container (min-width: 400px) {
    flex-direction: row;

    .card__image-wrapper {
      width: 40%;
      min-width: 150px;
      max-width: 200px;
      height: auto;
    }
  }

  // Contenedor > 600px: más espacio
  @container card-container (min-width: 600px) {
    .card__image-wrapper {
      width: 35%;
      max-width: 250px;
    }

    .card__title {
      font-size: $font-size-2xl;
    }
  }
}
```

**Uso**:
```html
<app-card variant="responsive" [title]="'Título'" [imageUrl]="'...'"></app-card>
```

#### 2. Alert Component (`app-alert`)

**Razón**: Los alerts pueden aparecer en sidebars estrechos, modales, o en el contenido principal. Con Container Queries, se adaptan automáticamente.

```scss
// alert.scss
:host {
  display: block;
  container-type: inline-size;
  container-name: alert-container;
}

.alert--compact {
  // Contenedores muy pequeños: layout vertical
  @container alert-container (max-width: 300px) {
    flex-direction: column;
    text-align: center;
    gap: $spacing-2;

    .alert__icon {
      align-self: center;
      svg { width: 32px; height: 32px; }
    }
  }

  // Contenedores medianos: compacto horizontal
  @container alert-container (min-width: 301px) and (max-width: 500px) {
    padding: $spacing-3 $spacing-4;

    .alert__title { font-size: $font-size-sm; }
    .alert__message { font-size: $font-size-xs; }
  }

  // Contenedores grandes: estilo completo
  @container alert-container (min-width: 501px) {
    padding: $spacing-4 $spacing-6;

    .alert__title { font-size: $font-size-lg; }
  }
}
```

**Uso**:
```html
<app-alert [compact]="true" type="info" title="Nota" message="..."></app-alert>
```

### Beneficios de Container Queries

1. **Componentes reutilizables**: El mismo componente funciona en cualquier contexto.
2. **Menos props**: No necesitas pasar `size="sm"` o `layout="horizontal"`.
3. **Mantenimiento**: Los estilos viven en el componente, no en el padre.
4. **Testing**: Más fácil de probar al no depender del viewport global.

---

## 4.4 Adaptaciones por Componente.

### Header

| Viewport | Comportamiento |
|----------|----------------|
| Mobile (<768px) | Menú hamburguesa, navegación en dropdown vertical |
| Desktop (≥768px) | Navegación horizontal visible, sin hamburguesa |

**Elementos que cambian**:
- Logo: 40px → 48px
- Nav: dropdown vertical → horizontal inline
- Botones de acción: 40px → 44px
- Botón hamburguesa: visible → oculto

### Footer

| Viewport | Comportamiento |
|----------|----------------|
| Mobile (<640px) | Una columna, todo apilado |
| Tablet (640-767px) | 2 columnas |
| Tablet (768-1023px) | 3 columnas |
| Desktop (≥1024px) | 5 columnas (2fr 1fr 1fr 1fr 1fr) |

### Cards

| Viewport | Comportamiento |
|----------|----------------|
| Mobile (<640px) | 1 columna, cards verticales |
| Tablet (640-1023px) | 2 columnas |
| Desktop (≥1024px) | 3+ columnas |

**Variante horizontal**: En mobile se convierte automáticamente en vertical.

### Formularios

| Viewport | Comportamiento |
|----------|----------------|
| Mobile (<640px) | Campos apilados, 1 columna |
| Desktop (≥640px) | Grid de 2 columnas |

**Tablas de items (factura)**:
- Mobile: Cada fila es una "card" con labels visibles
- Desktop: Tabla tradicional con headers

### Alerts

- Mobile: Padding reducido, texto más pequeño
- Desktop: Padding completo

### Botones

- Dentro de formularios en mobile: `width: 100%` cuando se necesita
- Desktop: Ancho automático

---

## 4.5 Screenshots Comparativos

> **Nota**: Esta sección requiere capturas de pantalla reales de la aplicación en diferentes viewports. Las capturas deben tomarse usando Chrome DevTools en los siguientes tamaños:

### Viewports a capturar

1. **Mobile (375px)** - iPhone estándar
2. **Tablet (768px)** - iPad
3. **Desktop (1280px)** - Monitor estándar

### Páginas a capturar

1. **Style Guide** (`/style-guide`)
   - Sección de componentes
   - Grid de cards
   - Formularios

2. **Forms Demo** (`/forms-demo`)
   - Formulario de registro
   - Tabla de items de factura

3. **Header y Footer**
   - Menú hamburguesa abierto (mobile)
   - Navegación completa (desktop)

### Instrucciones para capturar

1. Abrir Chrome DevTools (F12)
2. Click en el icono de dispositivo (Ctrl+Shift+M)
3. Seleccionar "Responsive" y ajustar el ancho manualmente
4. Usar la herramienta de captura de DevTools (Ctrl+Shift+P → "Capture screenshot")

### Ubicación de las capturas

Las capturas deben guardarse en:
```
frontend/docs/design/screenshots/
├── mobile-375/
│   ├── style-guide.png
│   ├── forms-demo.png
│   └── header-menu.png
├── tablet-768/
│   ├── style-guide.png
│   └── forms-demo.png
└── desktop-1280/
    ├── style-guide.png
    └── forms-demo.png
```

---
