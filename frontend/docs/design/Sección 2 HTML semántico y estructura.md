# Sección 2: HTML Semántico y Estructura

## Índice
- [2.1 Elementos semánticos utilizados](#21-elementos-semánticos-utilizados)
- [2.2 Jerarquía de headings](#22-jerarquía-de-headings)
- [2.3 Estructura de formularios](#23-estructura-de-formularios)
- [2.4 Componentes de layout](#24-componentes-de-layout)
- [2.5 CSS Custom Properties](#25-css-custom-properties)

---

## 2.1 Elementos Semánticos Utilizados

### ¿Qué es HTML semántico?

HTML semántico significa usar las etiquetas HTML correctas para el contenido que representan. En lugar de usar `<div>` para todo, usamos etiquetas que describen su propósito.

### Elementos semánticos en la Pokédex

| Elemento | Propósito | Ubicación en el proyecto |
|----------|-----------|-------------------------|
| `<header>` | Encabezado de página/sección | `HeaderComponent` |
| `<nav>` | Navegación principal | Dentro de `<header>` y `<footer>` |
| `<main>` | Contenido principal | `MainComponent` |
| `<footer>` | Pie de página | `FooterComponent` |
| `<article>` | Contenido independiente | `PokemonCardComponent` |
| `<section>` | Sección temática | Agrupaciones dentro de páginas |
| `<aside>` | Contenido secundario | Sidebar (opcional) |
| `<form>` | Formularios | `LoginFormComponent` |
| `<fieldset>` | Grupo de campos | Dentro de formularios |
| `<legend>` | Título del grupo | Dentro de `<fieldset>` |
| `<label>` | Etiqueta de campo | `FormInputComponent` |

### Ejemplo: Header Component

```html
<!-- Elemento <header> para el encabezado de la página -->
<header class="header">
  <div class="header__container">
    
    <!-- Logo con enlace a inicio -->
    <a href="/" class="header__logo" aria-label="Ir a la página principal">
      <img src="favicon.png" alt="Pokéball" class="header__logo-icon">
      <span class="header__logo-text">Pokédex</span>
    </a>
    
    <!-- Elemento <nav> para la navegación principal -->
    <nav class="header__nav" aria-label="Navegación principal">
      <ul class="header__nav-list">
        <li class="header__nav-item">
          <a href="/" class="header__nav-link">Inicio</a>
        </li>
        <li class="header__nav-item">
          <a href="/pokedex" class="header__nav-link">Pokédex</a>
        </li>
        <!-- ... más enlaces -->
      </ul>
    </nav>
    
    <!-- Acciones de utilidad -->
    <div class="header__actions">
      <button class="header__theme-btn" aria-label="Cambiar tema">
        <!-- Icono -->
      </button>
    </div>
    
  </div>
</header>
```

### Ejemplo: Main Component

```html
<!-- Elemento <main> para el contenido principal -->
<!-- Solo debe haber UN <main> por página -->
<main class="main" id="main-content" role="main">
  <div class="main__container">
    <!-- ng-content proyecta el contenido de cada página -->
    <ng-content></ng-content>
  </div>
</main>
```

### Ejemplo: Footer Component

```html
<!-- Elemento <footer> para el pie de página -->
<footer class="footer">
  <div class="footer__container">
    
    <!-- Información de marca -->
    <div class="footer__brand">
      <a href="/" class="footer__logo">Pokédex</a>
      <p class="footer__description">
        Tu enciclopedia Pokémon completa.
      </p>
    </div>
    
    <!-- Navegación secundaria -->
    <nav class="footer__nav" aria-label="Navegación del pie de página">
      <ul class="footer__nav-list">
        <li><a href="/about">Sobre nosotros</a></li>
        <li><a href="/contact">Contacto</a></li>
      </ul>
    </nav>
    
    <!-- Redes sociales -->
    <div class="footer__social">
      <a href="https://github.com" aria-label="GitHub">GitHub</a>
      <a href="https://twitter.com" aria-label="Twitter">Twitter</a>
    </div>
    
    <!-- Copyright y legal -->
    <div class="footer__bottom">
      <p class="footer__copyright">© 2024 Pokédex</p>
      <nav class="footer__legal" aria-label="Enlaces legales">
        <a href="/privacy">Privacidad</a>
        <a href="/terms">Términos</a>
      </nav>
    </div>
    
  </div>
</footer>
```

### Ejemplo: Article (Tarjeta Pokémon)

```html
<!-- Elemento <article> para contenido independiente -->
<article class="pokemon-card">
  <div class="pokemon-card__image-wrapper">
    <img src="pokemon.png" alt="Bulbasaur" class="pokemon-card__image">
  </div>
  
  <div class="pokemon-card__content">
    <span class="pokemon-card__number">#001</span>
    <h3 class="pokemon-card__name">Bulbasaur</h3>
    
    <div class="pokemon-card__types">
      <span class="type-badge type-badge--grass">Grass</span>
      <span class="type-badge type-badge--poison">Poison</span>
    </div>
  </div>
</article>
```

---

## 2.2 Jerarquía de Headings

### Reglas de jerarquía

1. **Solo UN `<h1>` por página** - El título principal
2. **`<h2>` para secciones principales** - Divisiones mayores
3. **`<h3>` para subsecciones** - Dentro de secciones h2
4. **NUNCA saltar niveles** - No ir de h1 a h3 directamente

### Diagrama de jerarquía

```
Página: Pokédex
│
├── h1: Pokédex (título principal de la página)
│
├── h2: Pokémon Destacados
│   ├── h3: Bulbasaur
│   ├── h3: Charmander
│   └── h3: Squirtle
│
├── h2: Explorar por Tipo
│   ├── h3: Tipo Fuego
│   ├── h3: Tipo Agua
│   └── h3: Tipo Planta
│
├── h2: Quiz Pokémon
│   ├── h3: Pregunta 1
│   └── h3: Resultado
│
└── h2: Favoritos
    └── h3: Lista de favoritos
```

### Ejemplo en código

```html
<!-- Página principal -->
<main class="main">
  
  <!-- Título principal - Solo UNO por página -->
  <h1 class="page-title">Pokédex</h1>
  
  <!-- Sección: Pokémon Destacados -->
  <section class="featured-section">
    <h2 class="section-title">Pokémon Destacados</h2>
    
    <article class="pokemon-card">
      <h3 class="pokemon-card__name">Bulbasaur</h3>
      <!-- contenido -->
    </article>
    
    <article class="pokemon-card">
      <h3 class="pokemon-card__name">Charmander</h3>
      <!-- contenido -->
    </article>
  </section>
  
  <!-- Sección: Explorar por Tipo -->
  <section class="types-section">
    <h2 class="section-title">Explorar por Tipo</h2>
    
    <div class="type-group">
      <h3 class="type-group__title">Tipo Fuego</h3>
      <!-- lista de pokémon -->
    </div>
    
    <div class="type-group">
      <h3 class="type-group__title">Tipo Agua</h3>
      <!-- lista de pokémon -->
    </div>
  </section>
  
</main>
```

### ❌ Errores comunes a evitar

```html
<!-- ❌ MAL: Múltiples h1 -->
<h1>Pokédex</h1>
<h1>Mis Favoritos</h1>

<!-- ❌ MAL: Saltar niveles (h1 → h3) -->
<h1>Pokédex</h1>
<h3>Bulbasaur</h3>

<!-- ❌ MAL: Usar headings solo por estilo -->
<h3>Texto pequeño</h3> <!-- Debería ser un <p> con clase -->

<!-- ✅ BIEN: Jerarquía correcta -->
<h1>Pokédex</h1>
<h2>Pokémon Destacados</h2>
<h3>Bulbasaur</h3>
```

---

## 2.3 Estructura de Formularios

### Elementos semánticos en formularios

| Elemento | Propósito | Requerido |
|----------|-----------|-----------|
| `<form>` | Contenedor del formulario | ✅ Sí |
| `<fieldset>` | Agrupa campos relacionados | ✅ Recomendado |
| `<legend>` | Título del grupo | ✅ Con fieldset |
| `<label>` | Etiqueta del campo | ✅ Obligatorio |
| `<input>` | Campo de entrada | ✅ Sí |
| `<button type="submit">` | Botón de envío | ✅ Sí |

### Asociación Label-Input

Hay dos formas de asociar un `<label>` con su `<input>`:

#### Método 1: Usando `for` e `id` (Recomendado)

```html
<label for="email">Correo electrónico</label>
<input type="email" id="email" name="email">
```

El atributo `for` del label debe coincidir con el `id` del input.

#### Método 2: Anidando el input dentro del label

```html
<label>
  Correo electrónico
  <input type="email" name="email">
</label>
```

### Ejemplo: Componente FormInput

```html
<!-- form-input.component.html -->
<div class="form-input"
     [class.form-input--error]="shouldShowError"
     [class.form-input--disabled]="disabled">
  
  <!-- Label siempre asociado al input -->
  <label [attr.for]="inputId" class="form-input__label">
    {{ label }}
    <!-- Indicador de campo requerido -->
    <span *ngIf="required" class="form-input__required" aria-hidden="true">*</span>
  </label>
  
  <!-- Contenedor del input -->
  <div class="form-input__wrapper">
    
    <!-- Input con atributos de accesibilidad -->
    <input 
      [attr.id]="inputId"
      [attr.name]="name"
      [type]="currentType"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [required]="required"
      [attr.aria-required]="required"
      [attr.aria-invalid]="shouldShowError"
      [attr.aria-describedby]="shouldShowError ? inputId + '-error' : null"
      class="form-input__field"
      (input)="onInput($event)"
      (blur)="onBlur()">
    
  </div>
  
  <!-- Texto de ayuda -->
  <p *ngIf="helpText && !shouldShowError" class="form-input__help">
    {{ helpText }}
  </p>
  
  <!-- Mensaje de error -->
  <p *ngIf="shouldShowError" 
     [attr.id]="inputId + '-error'"
     class="form-input__error"
     role="alert">
    {{ errorMessage }}
  </p>
  
</div>
```

### Ejemplo: Formulario de Login completo

```html
<!-- login-form.component.html -->
<div class="login-form">
  
  <!-- Cabecera -->
  <header class="login-form__header">
    <h2 class="login-form__title">Iniciar Sesión</h2>
    <p class="login-form__subtitle">Accede a tu cuenta</p>
  </header>
  
  <!-- Formulario -->
  <form class="login-form__form" method="post" (ngSubmit)="onSubmit($event)">
    
    <!-- Fieldset: Credenciales -->
    <fieldset class="login-form__fieldset">
      <legend class="login-form__legend">Credenciales de acceso</legend>
      
      <!-- Campo: Email -->
      <div class="login-form__field">
        <app-form-input
          inputId="login-email"
          name="email"
          type="email"
          label="Correo electrónico"
          placeholder="tu@email.com"
          [required]="true"
          [showError]="hasAttemptedSubmit"
          [errorMessage]="errors.email">
        </app-form-input>
      </div>
      
      <!-- Campo: Contraseña -->
      <div class="login-form__field">
        <app-form-input
          inputId="login-password"
          name="password"
          type="password"
          label="Contraseña"
          placeholder="Tu contraseña"
          [required]="true"
          [minlength]="8"
          [showError]="hasAttemptedSubmit"
          [errorMessage]="errors.password">
        </app-form-input>
      </div>
      
    </fieldset>
    
    <!-- Fieldset: Opciones -->
    <fieldset class="login-form__fieldset">
      <legend class="visually-hidden">Opciones adicionales</legend>
      
      <div class="login-form__options">
        <!-- Checkbox: Recordarme -->
        <div class="login-form__checkbox">
          <input type="checkbox" id="remember" name="remember">
          <label for="remember">Recordarme</label>
        </div>
        
        <!-- Enlace: Olvidé contraseña -->
        <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
      </div>
    </fieldset>
    
    <!-- Botón de envío -->
    <button type="submit" class="login-form__submit-btn">
      Iniciar Sesión
    </button>
    
  </form>
  
</div>
```

### Atributos de accesibilidad en formularios

| Atributo | Propósito | Ejemplo |
|----------|-----------|---------|
| `for` / `id` | Asocia label con input | `<label for="email">` + `<input id="email">` |
| `required` | Campo obligatorio | `<input required>` |
| `aria-required` | Para lectores de pantalla | `aria-required="true"` |
| `aria-invalid` | Indica error de validación | `aria-invalid="true"` |
| `aria-describedby` | Referencia al mensaje de error | `aria-describedby="email-error"` |
| `role="alert"` | Anuncia errores automáticamente | En el mensaje de error |

---

## 2.4 Componentes de Layout

### Estructura de la aplicación

```

```

### Uso en app.component.html

```html
<app-header 
  [title]="'Pokédex'"
  [isDarkTheme]="isDarkTheme"
  (themeToggle)="onThemeToggle($event)">
</app-header>

<app-main>
  <!-- El contenido de cada página va aquí -->
  <router-outlet></router-outlet>
</app-main>

<app-footer></app-footer>
```

### Archivos de cada componente

```
src/app/components/layout/
├── header/
│   ├── header.ts          # Lógica del componente
│   ├── header.html        # Template HTML semántico
│   └── header.scss        # Estilos BEM
├── main/
│   ├── main.ts
│   ├── main.html
│   └── main.scss
└── footer/
    ├── footer.ts
    ├── footer.html
    └── footer.scss
```

---

## 2.5 CSS Custom Properties

### ¿Qué son las CSS Custom Properties?

Son variables nativas de CSS que permiten cambiar valores dinámicamente sin recompilar SCSS.

### Archivo: _css-variables.scss

```scss
// Tema oscuro (predeterminado)
:root,
.dark-theme {
  --bg-primary: #0f1318;
  --bg-secondary: #1a1f2e;
  --bg-tertiary: #20283a;
  
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  
  --border-primary: #273047;
  
  --color-primary: #8b5cf6;
  --color-secondary: #fbbf24;
  --color-accent: #ff3366;
}

// Tema claro
.light-theme {
  --bg-primary: #f5f5f7;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e2e8f0;
  
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --text-tertiary: #64748b;
  
  --border-primary: #e2e8f0;
}
```

### Cómo usar en componentes

```scss
.mi-componente {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.mi-boton {
  background: var(--color-primary);
  color: #ffffff;
}
```

### Cambiar tema con JavaScript

```typescript
// Cambiar a tema oscuro
document.body.classList.add('dark-theme');
document.body.classList.remove('light-theme');

// Cambiar a tema claro
document.body.classList.add('light-theme');
document.body.classList.remove('dark-theme');
```

### Ventajas de CSS Custom Properties

1. **Cambio dinámico**: Se actualizan en tiempo real sin recompilar
2. **Herencia**: Los valores se heredan a elementos hijos
3. **JavaScript**: Se pueden leer y modificar con JS
4. **Fallbacks**: Puedes definir valores por defecto: `var(--color, #000)`

---

## Resumen de la Fase 2

### Componentes creados

| Componente | Tipo | Elemento semántico |
|------------|------|-------------------|
| HeaderComponent | Layout | `<header>`, `<nav>` |
| MainComponent | Layout | `<main>` |
| FooterComponent | Layout | `<footer>`, `<nav>` |
| FormInputComponent | Shared | `<label>`, `<input>` |
| LoginFormComponent | Shared | `<form>`, `<fieldset>`, `<legend>` |

### Archivos SCSS creados

- `header.scss` - Estilos BEM del header
- `main.scss` - Estilos BEM del main
- `footer.scss` - Estilos BEM del footer
- `form-input.scss` - Estilos BEM del input
- `login-form.scss` - Estilos BEM del formulario
- `_css-variables.scss` - CSS Custom Properties para temas
