## Arquitectura de Eventos-

Esta sección documenta la arquitectura de eventos implementada en la aplicación Angular, siguiendo los criterios RA6.a, RA6.c, RA6.d, RA6.e, RA6.h.

### Patrón de manejo de eventos

La arquitectura de eventos sigue el patrón unidireccional de datos de Angular:

```
Usuario → Evento DOM → Template Binding → Component Handler → Service/State → View Re-render
```

### Tipos de event binding

#### 1. Eventos de click
```html
<button (click)="handleClick($event)">Click me</button>
```

#### 2. Eventos de teclado.
```html
<!-- Evento específico de tecla -->
<input (keyup.enter)="onSubmit()">

<!-- Evento general con acceso al objeto evento -->
<input (keydown)="onKeyDown($event)">
```

#### 3. Eventos de Focus/Blur
```html
<input (focus)="onFocus()" (blur)="onBlur()">
```

#### 4. Eventos de Mouse
```html
<div (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
```

### HostListener para eventos globales.

Para escuchar eventos a nivel de documento:

```typescript
@HostListener('document:keydown.escape')
onEscapeKey(): void {
  this.close();
}

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  // Manejar click fuera del componente
}
```

### Manipulación del DOM

#### ViewChild y ElementRef

```typescript
@ViewChild('myElement') myElement!: ElementRef;

ngAfterViewInit() {
  console.log(this.myElement.nativeElement);
}
```

#### Renderer2 para Manipulación Segura

```typescript
constructor(private renderer: Renderer2) {}

// Cambiar estilos
this.renderer.setStyle(element, 'color', 'red');

// Añadir/quitar clases
this.renderer.addClass(element, 'active');
this.renderer.removeClass(element, 'active');

// Crear elementos
const div = this.renderer.createElement('div');
this.renderer.appendChild(parent, div);
```

### Diagrama de Flujo de Eventos

```
┌─────────────────────────────────────────────────────────────────┐
│                        FLUJO DE EVENTOS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌───────────────┐    ┌──────────────────┐      │
│  │  Usuario │───>│ Evento DOM    │───>│ Template Binding │      │
│  │  (click) │    │ (MouseEvent)  │    │ (click)="fn()"   │      │
│  └──────────┘    └───────────────┘    └────────┬─────────┘      │
│                                                │                │
│                                                ▼                │
│                                        ┌───────────────┐        │
│                                        │   Component   │        │
│                                        │    Handler    │        │
│                                        └───────┬───────┘        │
│                                                │                │
│                        ┌───────────────────────┐                │
│                        │                       │                │
│                        ▼                       ▼                │
│                ┌──────────────┐        ┌─────────────┐          │
│                │   Service    │        │   Signal/   │          │
│                │   Update     │        │   State     │          │
│                └──────────────┘        └──────┬──────┘          │
│                                               │                 │
│                                               ▼                 │
│                                       ┌──────────────┐          │
│                                       │  View Update │          │
│                                       │  (Zone.js)   │          │
│                                       └──────────────┘          │
│                                                                 │
└──────────────────────────────────────────────────────────────── │
```

### Prevención de Comportamiento por Defecto

```typescript
onSubmit(event: Event): void {
  event.preventDefault();  // Previene recarga de página
  // Lógica del formulario
}

onClick(event: MouseEvent): void {
  event.stopPropagation();  // Detiene propagación del evento
}
```

### Componentes Interactivos Implementados

| Componente | Eventos Implementados | Descripción |
|------------|----------------------|-------------|
| **Header** | click, keydown.escape, document:click | Toggle de menú, cierre con ESC y click fuera |
| **Modal** | click, keydown.escape | Cierre con overlay, ESC y botón |
| **Tabs** | click, keydown (arrows, Home, End) | Navegación por teclado completa |
| **Accordion** | click, keydown (arrows, Home, End) | Expandir/colapsar con teclado |
| **Tooltip** | mouseenter, mouseleave, focusin, focusout | Mostrar/ocultar con delay |
| **Button** | click | Manejo de estados loading/disabled |
| **Form Controls** | input, focus, blur, change | Validación y feedback |
| **Alert** | click | Cierre dismissible |

### Theme Switcher

El sistema de temas utiliza:

1. **ThemeService**: Servicio singleton que gestiona el estado del tema
2. **CSS Custom Properties**: Variables CSS para cambio dinámico
3. **localStorage**: Persistencia de preferencia del usuario
4. **prefers-color-scheme**: Detección de preferencia del sistema

```typescript
// Detectar preferencia del sistema
window.matchMedia('(prefers-color-scheme: dark)').matches

// Escuchar cambios del sistema
mediaQuery.addEventListener('change', (event) => {
  this.setTheme(event.matches ? 'dark' : 'light');
});
```

### Tabla de Compatibilidad de Navegadores

| Evento | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| click | ✓ | ✓ | ✓ | ✓ |
| keydown/keyup | ✓ | ✓ | ✓ | ✓ |
| focus/blur | ✓ | ✓ | ✓ | ✓ |
| mouseenter/mouseleave | ✓ | ✓ | ✓ | ✓ |
| focusin/focusout | ✓ | ✓ | ✓ | ✓ |
| touchstart/touchend | ✓ | ✓ | ✓ | ✓ |
| prefers-color-scheme | ✓ 76+ | ✓ 67+ | ✓ 12.1+ | ✓ 79+ |
| matchMedia | ✓ | ✓ | ✓ | ✓ |

### Buenas Prácticas

1. **Usar Renderer2** en lugar de manipulación directa del DOM para compatibilidad SSR
2. **Verificar plataforma** con `isPlatformBrowser()` antes de acceder a APIs del navegador
3. **Limpiar listeners** en `ngOnDestroy()` para evitar memory leaks
4. **Usar pseudo-eventos** como `(keyup.enter)` para código más limpio
5. **Implementar accesibilidad** con roles ARIA y navegación por teclado
