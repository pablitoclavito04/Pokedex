# Sección 1: Arquitectura CSS y comunicación visual.

---

## Tabla de Contenidos

1. Principios de Comunicación Visual.
2. Metodología CSS (BEM).
3. Organización de Archivos (ITCSS).
5. Mixins y Funciones.
6. ViewEncapsulation en Angular.

---

## 1. Principios de Comunicación Visual.

### 1.1 Jerarquía Visual:

**Definición**: La jerarquía visual es el orden en el que percibimos elementos en función de su importancia visual.


**Aplicación en la Pokédex**:

- **Títulos principales**: Utilizamos `font-size-4xl` (48px) con `font-weight-bold` (700) para el título "Pokédex" en la página de inicio

- **Nombres de Pokémon**: Usamos `font-size-2xl` (30px) con `font-weight-semibold` (600) en las tarjetas

- **Información secundaria**: `font-size-base` (16px) con `font-weight-regular` (400) para descripciones

- **Datos terciarios**: `font-size-sm` (14px) con color más suave para información complementaria


**Espaciado para jerarquía**:
- Entre secciones principales: `spacing-12` (48px)
- Entre elementos relacionados: `spacing-4` (16px)
- Entre elementos muy relacionados: `spacing-2` (8px)


**Ejemplo visual en el diseño**:
- En la página principal, el título "Pokédex" domina visualmente.
- Los botones de acción ("Iniciar sesión", "Crear cuenta") tienen tamaño y color destacado.
- Los filtros de tipo están agrupados y son más pequeños que el contenido principal.


### 1.2 Contraste:

**Definición**: El contraste ayuda a diferenciar elementos y guiar la atención del usuario.


**Aplicación en el Pokédex**:

**Contraste de color**:
- Fondo morado/púrpura (`color-primary-500`) contra texto blanco para máximo contraste en CTAs.
- Amarillo (`color-secondary-500`) para botones secundarios que contrastan con el fondo.
- Rojo (`color-accent-500`) para elementos críticos o de advertencia.

**Contraste de tamaño**:
- Botones primarios más grandes que secundarios.
- Números de Pokédex (#001) más pequeños que nombres.
- Iconos de tipo de tamaño consistente pero distinguibles.

**Contraste en modo claro/oscuro**:
```scss
// Modo claro
bg-primary: #f8fafc (muy claro)
text-primary: #0f172a (muy oscuro)
Ratio de contraste: 16.7:1 (AAA)

// Modo oscuro  
bg-primary: #0f1318 (muy oscuro)
text-primary: #f8fafc (muy claro)
Ratio de contraste: 16.7:1 (AAA)
```

### 1.3 Alineación:

**Definición**: La alineación crea orden visual y relaciones entre elementos.

**Aplicación en el Pokédex**:

- **Grid de Pokémon**: Alineación en cuadrícula con 3 columnas en desktop, 2 en tablet, 1 en móvil.
- **Formularios**: Alineación izquierda con labels arriba de inputs.
- **Tarjetas de Pokémon**: Contenido centrado con imagen arriba, nombre en medio, información abajo.
- **Navegación**: Alineación horizontal en desktop, vertical en móvil.

**Sistema de grid utilizado**:
```scss
// 3 columnas en desktop
.grid--3 {
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-6; // 24px entre tarjetas
}
```

### 1.4 Proximidad:

**Definición**: Elementos relacionados deben estar cerca; elementos no relacionados, separados.


**Aplicación en el Pokédex**:

**Agrupación por función**:
- Los filtros de tipo están juntos en un grupo visual.
- Las generaciones están en otro grupo separado.
- La barra de búsqueda está separada de los filtros.

**Espaciado para proximidad**:
```scss
// Elementos muy relacionados (tipos dentro del mismo Pokémon)
gap: $spacing-2; // 8px

// Elementos relacionados (secciones de una tarjeta)
gap: $spacing-4; // 16px

// Elementos separados (diferentes tarjetas)
gap: $spacing-6; // 24px

// Secciones completamente diferentes
margin-bottom: $spacing-12; // 48px
```

**Ejemplo en tarjeta de Pokémon**:
- Imagen de Pokémon muy cerca del nombre (8px).
- Nombre cerca de los tipos (12px).
- Botón de "Más información" más separado (24px).


### 1.5 Repetición:

**Definición**: Repetir elementos visuales crea coherencia y unidad.

**Aplicación en el Pokédex**:

**Patrones repetidos**:
- **Border radius**: Siempre `border-radius-xl` (12px) en tarjetas.

- **Sombras**: Siempre `shadow-md` en estado normal, `shadow-lg` en hover.

- **Badges de tipo**: Mismo estilo con `border-radius-full` y padding consistente.

- **Botones**: Mismo padding `spacing-3 spacing-6` en todos.

- **Transiciones**: Siempre `duration-base` (300ms) con `ease-in-out`


**Sistema de colores repetido**:
```scss
// Todos los botones primarios
background: $color-primary-500;

// Todos los botones secundarios  
background: $color-secondary-500;

// Todos los badges de tipo usan la misma estructura
@mixin pokemon-type($type) {
  border-radius: $border-radius-full;
  padding: $spacing-2 $spacing-4;
  font-weight: $font-weight-semibold;
}
```

---

## 2. Metodología CSS (BEM).

### 2.1 ¿Qué es BEM?

BEM (Block Element Modifier) es una metodología de nomenclatura CSS que ayuda a crear código reutilizable y mantenible.

**Estructura**:
```
.bloque__elemento--modificador
```

- **Block (Bloque)**: Componente independiente y reutilizable.
- **Element (Elemento)**: Parte de un bloque que no tiene sentido fuera de él.
- **Modifier (Modificador)**: Variación de un bloque o elemento.


### 2.2 ¿Por qué BEM?

**Ventajas**:
1. **Claridad**: Los nombres describen la estructura.
2. **Evita colisiones**: Los nombres son específicos y únicos.
3. **Reutilización**: Fácil de mover componentes entre proyectos.
4. **Escalabilidad**: Funciona bien en proyectos grandes.
5. **Mantenibilidad**: Fácil entender qué hace cada clase.


### 2.3 Ejemplos de BEM en el Pokédex:

#### Ejemplo 1: Tarjeta de Pokémon

```scss
// Block (Bloque)
.pokemon-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  
  // Element (Elemento)
  &__image {
    width: 100%;
    height: 200px;
    object-fit: contain;
  }
  
  &__name {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  &__number {
    font-size: 14px;
    color: #64748b;
  }
  
  &__types {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }
  
  &__button {
    width: 100%;
    padding: 12px;
    background: $color-primary-500;
    color: white;
    border-radius: 8px;
    margin-top: 16px;
  }
  
  // Modifier (Modificador)
  &--featured {
    border: 2px solid $color-secondary-500;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }
  
  &--favorite {
    background: linear-gradient(135deg, #fef08a 0%, #fde047 100%);
  }
}
```


**HTML correspondiente**:

```html
 <!-- Tarjeta normal -->
<div class="pokemon-card">
  <img class="pokemon-card__image" src="bulbasaur.png" alt="Bulbasaur">
  <span class="pokemon-card__number">#001</span>
  <h3 class="pokemon-card__name">Bulbasaur</h3>
  <div class="pokemon-card__types">
    <span class="type-badge type-badge--grass">Planta</span>
    <span class="type-badge type-badge--poison">Veneno</span>
  </div>
  <button class="pokemon-card__button">Más información</button>
</div>

<!-- Tarjeta destacada -->
<div class="pokemon-card pokemon-card--featured">
  <!-- ... mismo contenido ... -->
</div>
```


#### Ejemplo 2: Navegación

```scss
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  
  &__logo {
    display: flex;
    align-items: center;
    gap: 12px;
    
    &-image {
      width: 40px;
      height: 40px;
    }
    
    &-text {
      font-size: 24px;
      font-weight: 700;
    }
  }
  
  &__search {
    flex: 1;
    max-width: 400px;
    margin: 0 32px;
  }
  
  &__actions {
    display: flex;
    gap: 16px;
  }
  
  &__button {
    padding: 8px 16px;
    border-radius: 8px;
    
    &--primary {
      background: $color-primary-500;
      color: white;
    }
    
    &--ghost {
      background: transparent;
      border: 1px solid $color-neutral-300;
    }
  }
  
  // Modificador para móvil
  &--mobile {
    flex-direction: column;
    
    .navbar__search {
      width: 100%;
      margin: 16px 0;
    }
  }
}
```

#### Ejemplo 3: Badge de tipo

```scss
.type-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  
  // Modificadores para cada tipo
  &--normal { background: #a8a878; }
  &--fire { background: #f08030; }
  &--water { background: #6890f0; }
  &--electric { background: #f8d030; color: #333; }
  &--grass { background: #78c850; }
  &--ice { background: #98d8d8; }
  &--fighting { background: #c03028; }
  &--poison { background: #a040a0; }
  &--ground { background: #e0c068; }
  &--flying { background: #a890f0; }
  &--psychic { background: #f85888; }
  &--bug { background: #a8b820; }
  &--rock { background: #b8a038; }
  &--ghost { background: #705898; }
  &--dragon { background: #7038f8; }
  &--dark { background: #705848; }
  &--steel { background: #b8b8d0; }
  &--fairy { background: #ee99ac; }
}
```

### 2.4 Reglas de oro de BEM:

1. **Un solo guion** para palabras compuestas en bloques: `.pokemon-card`
2. **Doble guion bajo** para elementos: `.pokemon-card__name`
3. **Doble guion** para modificadores: `.pokemon-card--featured`
4. **No anidar más de un elemento**: `.block__element` así si, `.block__element__subelement` así no.
5. **Los modificadores siempre acompañan al bloque/elemento base**:
   ```html
   <!-- Correcto -->
   <div class="pokemon-card pokemon-card--featured">
   
   <!-- Incorrecto -->
   <div class="pokemon-card--featured">
   ```

---

## 3. Organización de Archivos (ITCSS).

### 3.1 ¿Qué es ITCSS?

ITCSS (Inverted Triangle CSS) es una arquitectura para organizar CSS que gestiona la especificidad de forma incremental.

**Principio clave**: Los estilos se organizan de menor a mayor especificidad, como un triángulo invertido.

```
     Settings     (Variables, configuración)
     Tools        (Mixins, funciones)
     Generic      (Reset, normalize)
     Elements     (Estilos de elementos HTML)
     Objects      (Patrones de diseño sin estilos)
     Components   (Componentes de UI)
     Utilities    (Clases de utilidad)
```

### 3.2 Estructura de carpetas del proyecto:

```
src/styles/
├── 00-settings/
│   └── _variables.scss          # Todas las variables del design system
│
├── 01-tools/
│   └── _mixins.scss             # Mixins y funciones reutilizables
│
├── 02-generic/
│   └── _reset.scss              # Reset CSS moderno
│
├── 03-elements/
│   └── _base.scss               # Estilos base de HTML (h1, p, a, etc.)
│
├── 04-layout/
│   └── _grid.scss               # Sistema de grid y layouts
│
└── styles.scss                  # Archivo principal que importa todo
```

### 3.3 Explicación de cada capa:

#### 00-settings (Variables):

**Propósito**: Definir todas las variables del proyecto sin generar CSS.

**Qué contiene**:
- Colores (paletas completas).
- Tipografía (familias, tamaños, pesos).
- Espaciado (escala de espaciado).
- Breakpoints (puntos de quiebre responsive).
- Sombras, bordes, transiciones.
- Variables de tema claro y oscuro.

**Especificidad**: 0 (no genera CSS).

**Ejemplo**:
```scss
$color-primary-500: #8b5cf6;
$font-size-base: 1rem;
$spacing-4: 1rem;
```


#### 01-tools (Mixins y funciones):

**Propósito**: Herramientas para generar CSS de forma eficiente.

**Qué contiene**:
- Mixins reutilizables.
- Funciones SCSS.
- Helpers para responsive.
- Helpers para temas.

**Especificidad**: 0 (no genera CSS directamente).

**Ejemplo**:
```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```


#### 02-generic (Reset):

**Propósito**: Eliminar inconsistencias entre navegadores.

**Qué contiene**:
- Reset de márgenes y paddings.
- Box-sizing.
- Normalización de elementos.

**Especificidad**: Baja (selectores de elemento).

**Ejemplo**:
```scss
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```


#### 03-elements (Elementos base):

**Propósito**: Estilos base para elementos HTML sin clases.

**Qué contiene**:
- Estilos de h1, h2, h3, etc.
- Estilos de p, a, ul, li.
- Estilos de table, img, etc.

**Especificidad**: Baja (selectores de elemento).

**Ejemplo**:
```scss
h1 {
  font-size: $font-size-4xl;
  font-weight: $font-weight-bold;
}
```


#### 04-layout (Layouts)

**Propósito**: Estructuras de página y sistemas de grid.

**Qué contiene**:
- Sistema de grid.
- Contenedores.
- Layouts de página.

**Especificidad**: Media (clases genéricas).

**Ejemplo**:
```scss
.container {
  max-width: 1280px;
  margin: 0 auto;
}
```


### 3.4 ¿Por qué este orden?

**Ventajas de ITCSS**:

1. **Gestión de especificidad**: Evita guerras de especificidad.
2. **Mantenibilidad**: Fácil encontrar dónde va cada estilo.
3. **Escalabilidad**: Funciona bien en proyectos grandes.
4. **Rendimiento**: Reduce código duplicado.
5. **Onboarding**: Nuevos desarrolladores entienden rápido la estructura.

**El triángulo invertido**:
- Arriba (Settings/Tools): Bajo alcance, baja especificidad.
- Medio (Generic/Elements/Objects): Alcance medio, especificidad media.
- Abajo (Components/Utilities): Alto alcance, alta especificidad.

---

## 4. Sistema de Design Tokens.

### 4.1 ¿Qué son los Design Tokens?

Los design tokens son las **variables de diseño** que representan decisiones de diseño visual. Son la "única fuente de verdad" para colores, tipografía, espaciado, etc.

**Beneficios**:
- Consistencia visual en todo el proyecto.
- Fácil mantenimiento (cambias una variable, afecta todo).
- Facilita la implementación de temas (claro/oscuro).
- Mejora la comunicación entre diseño y desarrollo.


### 4.2 Paleta de colores:

#### Colores primarios (Morado/Púrpura):

```scss
$color-primary-500: #8b5cf6;  // Color principal de marca
```

**Escala completa** (50 a 900):
- `$color-primary-50`: #f5f3ff (Muy claro).
- `$color-primary-500`: #8b5cf6 (Principal).
- `$color-primary-900`: #4c1d95 (Muy oscuro).

**Uso**:
- Botones primarios.
- Enlaces.
- Elementos destacados.
- Hover states.

#### Colores secundarios (Amarillo):

```scss
$color-secondary-500: #eab308;  // Color de acento
```

**Uso**:
- Botones secundarios ("Crear cuenta").
- Badges especiales.
- Elementos de menor prioridad que requieren atención.

#### Colores de acento (Rojo):

```scss
$color-accent-500: #ef4444;  // Color de acento crítico
```

**Uso**:
- Botones de eliminar.
- Errores.
- Estados de advertencia.
- Pokéballs (parte roja).

#### Colores neutrales (Grises):

```scss
$color-neutral-500: #64748b;  // Gris medio
```

**Escala** (50 a 900):
- 50-300: Fondos claros, bordes.
- 400-600: Textos secundarios, iconos.
- 700-900: Textos principales, elementos oscuros.


#### Colores semánticos

```scss
$color-success-light: #10b981;   // Verde - Éxito
$color-error-light: #ef4444;      // Rojo - Error
$color-warning-light: #f59e0b;    // Naranja - Advertencia
$color-info-light: #3b82f6;       // Azul - Información
```

#### Colores de tipos Pokémon

```scss
$type-fire: #f08030;
$type-water: #6890f0;
$type-grass: #78c850;
$type-electric: #f8d030;
// ... y 14 tipos más
```

### 4.3 Sistema de temas (Claro/Oscuro):

#### Tema claro:

```scss
$light-theme: (
  // Fondos
  bg-primary: #f8fafc,        // Fondo principal de la app
  bg-secondary: #ffffff,       // Fondo de tarjetas
  bg-tertiary: #f1f5f9,       // Fondo de secciones alternas
  
  // Textos
  text-primary: #0f172a,      // Texto principal (negro casi)
  text-secondary: #475569,    // Texto secundario (gris oscuro)
  text-tertiary: #94a3b8,     // Texto terciario (gris claro)
  
  // Bordes
  border-primary: #e2e8f0,    // Bordes principales
  border-secondary: #cbd5e1,  // Bordes más oscuros
  
  // Estados
  state-hover: #f1f5f9,       // Color al hacer hover
  state-active: #e2e8f0,      // Color al hacer click
);
```

#### Tema oscuro:

```scss
$dark-theme: (
  // Fondos
  bg-primary: #0f1318,        // Fondo principal oscuro
  bg-secondary: #1a1f2e,      // Fondo de tarjetas oscuro
  bg-tertiary: #20283a,       // Fondo de secciones alternas
  
  // Textos
  text-primary: #f8fafc,      // Texto principal (blanco casi)
  text-secondary: #cbd5e1,    // Texto secundario (gris claro)
  text-tertiary: #94a3b8,     // Texto terciario (gris medio)
  
  // Bordes
  border-primary: #273047,    // Bordes principales
  border-secondary: #2d3a54,  // Bordes más claros
  
  // Estados
  state-hover: #20283a,       // Color al hacer hover
  state-active: #273047,      // Color al hacer click
);
```

#### Cómo usar los temas:

```scss
// En cualquier componente
.card {
  background: map-get($light-theme, bg-secondary);
  
  // Tema oscuro
  :host-context(.dark-theme) & {
    background: map-get($dark-theme, bg-secondary);
  }
}
```

### 4.4 Escala tipográfica:

#### Familias:

```scss
$font-primary: 'Inter', sans-serif;      // Para texto general
$font-secondary: 'Poppins', sans-serif;  // Para títulos
$font-mono: 'JetBrains Mono', monospace; // Para código
```

**Decisión**: Inter para cuerpo porque es muy legible en pantallas. Poppins para títulos porque es más distintiva y llamativa.

#### Tamaños (Escala modular ratio 1.25):

```scss
$font-size-xs: 0.75rem;      // 12px - Metadatos
$font-size-sm: 0.875rem;     // 14px - Texto pequeño
$font-size-base: 1rem;       // 16px - Texto base ⭐
$font-size-md: 1.125rem;     // 18px - Texto destacado
$font-size-lg: 1.25rem;      // 20px - Subtítulos pequeños
$font-size-xl: 1.5rem;       // 24px - Subtítulos
$font-size-2xl: 1.875rem;    // 30px - Títulos secundarios
$font-size-3xl: 2.25rem;     // 36px - Títulos principales
$font-size-4xl: 3rem;        // 48px - Hero titles
$font-size-5xl: 3.75rem;     // 60px - Títulos gigantes
```

**Uso**:
- `xs`: Número de cada Pokémon (#001).
- `sm`: Descripciones cortas, metadatos.
- `base`: Párrafos, textos generales.
- `lg`: Nombres de Pokémon en tarjetas.
- `xl-2xl`: Nombres de Pokémon en páginas de detalle.
- `3xl-5xl`: Títulos de página.

#### Pesos:

```scss
$font-weight-light: 300;      // Casi no se usa
$font-weight-regular: 400;    // Texto normal
$font-weight-medium: 500;     // Texto ligeramente destacado
$font-weight-semibold: 600;   // Subtítulos, labels
$font-weight-bold: 700;       // Títulos principales
$font-weight-extrabold: 800;  // Títulos hero
```

#### Line heights:

```scss
$line-height-tight: 1.25;     // Para títulos
$line-height-normal: 1.5;     // Para texto general ⭐
$line-height-relaxed: 1.625;  // Para textos largos
```

**Decisión**: Normal (1.5) para la mayoría del texto porque es el estándar de legibilidad. Tight para títulos para que se vean compactos.

### 4.5 Sistema de espaciado (Base 4px):

**Principio**: Todos los espacios son múltiplos de 4px para consistencia visual.

```scss
$spacing-0: 0;
$spacing-1: 0.25rem;    // 4px
$spacing-2: 0.5rem;     // 8px
$spacing-3: 0.75rem;    // 12px
$spacing-4: 1rem;       // 16px
$spacing-5: 1.25rem;    // 20px
$spacing-6: 1.5rem;     // 24px
$spacing-8: 2rem;       // 32px
$spacing-12: 3rem;      // 48px
$spacing-16: 4rem;      // 64px
$spacing-20: 5rem;      // 80px
$spacing-24: 6rem;      // 96px
```

**Uso común**:
- `spacing-2`: Gap entre badges de tipo.
- `spacing-4`: Padding interno de botones, gap entre elementos relacionados.
- `spacing-6`: Padding de tarjetas, gap en grids.
- `spacing-8`: Margen entre secciones.
- `spacing-12`: Margen grande entre secciones.
- `spacing-16+`: Solo para separaciones de secciones principales.


### 4.6 Breakpoints responsive:

```scss
$breakpoint-xs: 480px;    // Móvil pequeño (iPhone SE)
$breakpoint-sm: 640px;    // Móvil grande (iPhone 12)
$breakpoint-md: 768px;    // Tablet (iPad)
$breakpoint-lg: 1024px;   // Desktop (laptop pequeña)
$breakpoint-xl: 1280px;   // Desktop grande
$breakpoint-2xl: 1536px;  // Desktop extra grande
```

**Estrategia**: Mobile-first. Los estilos base son para móvil, luego se ajustan para pantallas más grandes.

**Ejemplo**:
```scss
.pokemon-card {
  width: 100%;  // Móvil: ancho completo
  
  @include respond-to('sm') {
    width: 50%;  // Tablet: 2 columnas
  }
  
  @include respond-to('lg') {
    width: 33.333%;  // Desktop: 3 columnas
  }
}
```

### 4.7 Elevaciones (Sombras):

#### Sombras para modo claro:

```scss
$shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

#### Sombras para modo oscuro:

```scss
$shadow-dark-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
$shadow-dark-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
```

**Uso**:
- `sm`: Botones, inputs.
- `md`: Tarjetas en estado normal.
- `lg`: Tarjetas en hover, modales.
- `xl`: Elementos flotantes importantes.

**Decisión**: Se usa sombras más oscuras en modo oscuro (0.4 opacity vs 0.1) porque necesitan más contraste para ser visibles.


### 4.8 Bordes:

```scss
// Grosores
$border-width-thin: 1px;      // Bordes normales
$border-width-medium: 2px;    // Bordes destacados
$border-width-thick: 4px;     // Bordes muy destacados

// Radios
$border-radius-sm: 0.125rem;  // 2px
$border-radius-base: 0.25rem; // 4px
$border-radius-lg: 0.5rem;    // 8px
$border-radius-xl: 0.75rem;   // 12px Más usado en tarjetas
$border-radius-2xl: 1rem;     // 16px
$border-radius-full: 9999px;  // Círculo completo (badges, avatares)
```

### 4.9 Transiciones:

```scss
// Duraciones
$duration-fast: 150ms;    // Cambios rápidos (hover)
$duration-base: 300ms;    // Duración estándar
$duration-slow: 500ms;    // Transiciones complejas

// Funciones de tiempo
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);  // Más usada

// Transiciones predefinidas
$transition-all: all $duration-base $ease-in-out;
$transition-colors: color, background-color, border-color $duration-base;
```

**Uso**:
```scss
.button {
  transition: $transition-all;
  // Se traduce a: all 300ms cubic-bezier(0.4, 0, 0.2, 1)
}
```


---

## 5. Mixins y Funciones.

### 5.1 ¿Qué son los mixins?

Los mixins son **funciones CSS** que generan bloques de código reutilizables. Evitan repetir código y facilitan el mantenimiento.

### 5.2 Mixins de responsive:

#### respond-to (Mobile-first)

```scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (min-width: 640px) {
      @content;
    }
  }
  // ... etc para md, lg, xl
}
```

**Uso**:
```scss
.pokemon-grid {
  grid-template-columns: 1fr;  // Móvil: 1 columna
  
  @include respond-to('md') {
    grid-template-columns: repeat(2, 1fr);  // Tablet: 2 columnas
  }
  
  @include respond-to('lg') {
    grid-template-columns: repeat(3, 1fr);  // Desktop: 3 columnas
  }
}
```

#### respond-to-max (Desktop-first)

```scss
@mixin respond-to-max($breakpoint) {
  @if $breakpoint == 'md' {
    @media (max-width: 767px) {
      @content;
    }
  }
}
```

**Uso**:
```scss
.navbar {
  flex-direction: row;  // Desktop: horizontal
  
  @include respond-to-max('md') {
    flex-direction: column;  // Móvil: vertical
  }
}
```

### 5.3 Mixins de Flexbox:

#### flex-center

```scss
@mixin flex-center($direction: row) {
  display: flex;
  flex-direction: $direction;
  justify-content: center;
  align-items: center;
}
```

**Uso**:
```scss
.loading-spinner {
  @include flex-center;
  min-height: 100vh;
}

.modal-content {
  @include flex-center(column);
  gap: 20px;
}
```

#### flex-between:

```scss
@mixin flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

**Uso**:
```scss
.navbar {
  @include flex-between;
  padding: 16px 24px;
}
```

### 5.4 Mixin de truncate text:

```scss
@mixin truncate($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

**Uso**:
```scss
.pokemon-name {
  @include truncate;  // Una línea
  max-width: 200px;
}

.pokemon-description {
  @include truncate(3);  // Tres líneas
}
```

**Resultado**:
```
Bulbasaur  
Este Pokémon tiene...
```

### 5.5 Mixin de tamaños:

```scss
@mixin size($width, $height: $width) {
  width: $width;
  height: $height;
}
```

**Uso**:
```scss
.avatar {
  @include size(40px);  // 40px x 40px
  border-radius: 50%;
}

.banner {
  @include size(100%, 300px);  // 100% width, 300px height
}
```

### 5.6 Mixin de posicionamiento absoluto:

```scss
@mixin absolute($top: null, $right: null, $bottom: null, $left: null) {
  position: absolute;
  @if $top { top: $top; }
  @if $right { right: $right; }
  @if $bottom { bottom: $bottom; }
  @if $left { left: $left; }
}
```

**Uso**:
```scss
.badge {
  @include absolute(10px, 10px, null, null);
  // Equivale a:
  // position: absolute;
  // top: 10px;
  // right: 10px;
}
```

### 5.7 Mixin de card:

```scss
@mixin card($padding: $spacing-6) {
  background: map-get($light-theme, bg-card);
  border-radius: $border-radius-xl;
  padding: $padding;
  box-shadow: $shadow-md;
  transition: $transition-all;
  
  :host-context(.dark-theme) & {
    background: map-get($dark-theme, bg-card);
    box-shadow: $shadow-dark-md;
  }
  
  @include hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }
}
```

**Uso**:
```scss
.pokemon-card {
  @include card;
  // Ya tiene todos los estilos de tarjeta aplicados
}

.stats-card {
  @include card($spacing-8);  // Con más padding
}
```

### 5.8 Mixin de button:

```scss
@mixin button($bg-color, $text-color: #ffffff) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-3 $spacing-6;
  font-weight: $font-weight-semibold;
  color: $text-color;
  background-color: $bg-color;
  border-radius: $border-radius-lg;
  transition: $transition-all;
  
  @include hover-focus {
    background-color: darken($bg-color, 8%);
    transform: translateY(-1px);
  }
}
```

**Uso**:
```scss
.btn-primary {
  @include button($color-primary-500);
}

.btn-secondary {
  @include button($color-secondary-500, #333);
}
```

### 5.9 Mixin de custom scrollbar:

```scss
@mixin custom-scrollbar($thumb-color, $track-color) {
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: $track-color;
    border-radius: $border-radius-full;
  }
  
  &::-webkit-scrollbar-thumb {
    background: $thumb-color;
    border-radius: $border-radius-full;
    
    &:hover {
      background: darken($thumb-color, 10%);
    }
  }
  
  scrollbar-width: thin;
  scrollbar-color: $thumb-color $track-color;
}
```

**Uso**:
```scss
.pokemon-list {
  height: 500px;
  overflow-y: auto;
  @include custom-scrollbar($color-primary-500, $color-neutral-200);
}
```

### 5.10 Mixin de pokemon-type:

```scss
@mixin pokemon-type($type) {
  @if $type == 'fire' {
    background-color: $type-fire;
  } @else if $type == 'water' {
    background-color: $type-water;
  }
  // ... etc
  
  color: #ffffff;
  font-weight: $font-weight-semibold;
  padding: $spacing-2 $spacing-4;
  border-radius: $border-radius-full;
}
```

**Uso**:
```scss
.type-fire {
  @include pokemon-type('fire');
}

.type-water {
  @include pokemon-type('water');
}
```

### 5.11 Función theme-color:

```scss
@function theme-color($key, $theme: 'light') {
  @if $theme == 'light' {
    @return map-get($light-theme, $key);
  } @else {
    @return map-get($dark-theme, $key);
  }
}
```

**Uso**:
```scss
.card {
  background: theme-color('bg-card', 'light');
  
  [data-theme="dark"] & {
    background: theme-color('bg-card', 'dark');
  }
}
```

---

## 6. ViewEncapsulation en Angular.

### 6.1 ¿Qué es ViewEncapsulation?

ViewEncapsulation define cómo Angular aplica los estilos a los componentes. Controla si los estilos son globales o están encapsulados.

### 6.2 Tipos de ViewEncapsulation:

#### Emulated (Por defecto)

```typescript
@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  encapsulation: ViewEncapsulation.Emulated  // Por defecto
})
```

**Cómo funciona**:
- Angular añade atributos únicos a los elementos.
- Los estilos solo afectan a ese componente.
- Similar a Shadow DOM pero sin usarlo.

**Ejemplo**:
```html


  Bulbasaur



h2[_ngcontent-abc-123] {
  color: blue;
}
```

**Ventajas**:
- Aislamiento de estilos.
- No hay conflictos entre componentes.
- Funciona en todos los navegadores.

**Desventajas**:
- CSS más grande (atributos extra).
- Dificulta estilar componentes hijos.

#### None (Sin encapsulación)

```typescript
@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
```

**Cómo funciona**:
- Los estilos son completamente globales.
- Afectan a toda la aplicación.
- Como CSS normal.

**Ventajas**:
- Fácil compartir estilos.
- CSS más pequeño.
- Puedes usar BEM globalmente.

**Desventajas**:
- Posibles conflictos de estilos.
- Necesitas convenciones de nomenclatura (BEM).

#### ShadowDom (Real Shadow DOM)

```typescript
@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
```

**Cómo funciona**:
- Usa Shadow DOM nativo del navegador
- Aislamiento real y fuerte

**Ventajas**:
- Aislamiento perfecto.
- Estándar web.

**Desventajas**:
- No funciona en navegadores antiguos.
- Dificulta estilizar desde fuera.
- No se usa frecuentemente.


### 6.3 Estrategia recomendada para este proyecto:

**Para componentes**: **Emulated** (por defecto)

```typescript
// pokemon-card.component.ts
@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
  // encapsulation: ViewEncapsulation.Emulated es el default
})
```

**Razones**:
1. Evita conflictos automáticamente.
2. No requiere BEM estricto.
3. Funciona bien con Angular.
4. Fácil de mantener.

**Para estilos globales**: `styles.scss`

```scss
// src/styles/styles.scss
// Estos estilos SÍ son globales y afectan toda la app
```

### 6.4 Cómo usar estilos globales en componentes:

#### Opción 1: :host-context 

```scss
// pokemon-card.component.scss
.card {
  background: white;
  
  // Aplica cuando el componente está dentro de .dark-theme
  :host-context(.dark-theme) & {
    background: #1a1f2e;
  }
}
```

#### Opción 2: Variables CSS (Moderna)

```scss
// styles.scss (global)
:root {
  --card-bg: white;
}

.dark-theme {
  --card-bg: #1a1f2e;
}

// pokemon-card.component.scss
.card {
  background: var(--card-bg);  // Usa la variable global
}
```

### 6.5 Decisión final para el proyecto

**Configuración**:

1. **Componentes de Angular**: Mantener **ViewEncapsulation.Emulated**
2. **Estilos globales**: Usar `src/styles/styles.scss` para:
   - Reset CSS.
   - Estilos base de elementos.
   - Sistema de grid.
   - Clases de utilidad.
3. **Variables**: Accesibles en todos los componentes usando `@use`
4. **Temas**: Usar `:host-context(.dark-theme)` en componentes.

**Ejemplo completo**:

```typescript
// pokemon-card.component.ts
@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
  // Emulated por defecto - NO cambiar
})
export class PokemonCardComponent {}
```

```scss
// pokemon-card.component.scss
@use 'src/styles/00-settings/variables' as *;
@use 'src/styles/01-tools/mixins' as *;

.pokemon-card {
  @include card;  // Usa el mixin global
  
  background: map-get($light-theme, bg-card);
  
  // Tema oscuro
  :host-context(.dark-theme) & {
    background: map-get($dark-theme, bg-card);
  }
  
  &__name {
    font-size: $font-size-xl;
    color: map-get($light-theme, text-primary);
    
    :host-context(.dark-theme) & {
      color: map-get($dark-theme, text-primary);
    }
  }
}
```

**Ventajas de hacer esto**:
- Mejor organización del código.
- Estilos encapsulados por defecto.
- Fácil implementar temas.
- No hay conflictos.
- Mantiene la modularidad de Angular.