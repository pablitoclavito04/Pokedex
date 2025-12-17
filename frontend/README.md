# Pokédex Angular - Documentación del Proyecto

## Índice

- [Fase 1: Arquitectura de Eventos](#fase-1-arquitectura-de-eventos)
- [Fase 2: Servicios y Comunicación](#fase-2-servicios-y-comunicación)
- [Fase 3: Formularios Reactivos](#fase-3-formularios-reactivos)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

# Fase 1: Arquitectura de Eventos

Criterios: RA6.a, RA6.c, RA6.d, RA6.e, RA6.h

## Patrón de Manejo de Eventos

La arquitectura de eventos sigue el patrón unidireccional de datos de Angular:

```
Usuario → Evento DOM → Template Binding → Component Handler → Service/State → View Re-render
```

## Tipos de Event Binding

### 1. Eventos de Click
```html
<button (click)="handleClick($event)">Click me</button>
```

### 2. Eventos de Teclado
```html
<!-- Evento específico de tecla -->
<input (keyup.enter)="onSubmit()">

<!-- Evento general con acceso al objeto evento -->
<input (keydown)="onKeyDown($event)">
```

### 3. Eventos de Focus/Blur
```html
<input (focus)="onFocus()" (blur)="onBlur()">
```

### 4. Eventos de Mouse
```html
<div (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
```

## HostListener para Eventos Globales

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

## Manipulación del DOM

### ViewChild y ElementRef

```typescript
@ViewChild('myElement') myElement!: ElementRef;

ngAfterViewInit() {
  console.log(this.myElement.nativeElement);
}
```

### Renderer2 para Manipulación Segura

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

## Diagrama de Flujo de Eventos

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
└─────────────────────────────────────────────────────────────────┘
```

## Prevención de Comportamiento por Defecto

```typescript
onSubmit(event: Event): void {
  event.preventDefault();  // Previene recarga de página
  // Lógica del formulario
}

onClick(event: MouseEvent): void {
  event.stopPropagation();  // Detiene propagación del evento
}
```

## Componentes Interactivos Implementados

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

## Theme Switcher

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

## Compatibilidad de Navegadores

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

## Buenas Prácticas - Eventos

1. **Usar Renderer2** en lugar de manipulación directa del DOM para compatibilidad SSR
2. **Verificar plataforma** con `isPlatformBrowser()` antes de acceder a APIs del navegador
3. **Limpiar listeners** en `ngOnDestroy()` para evitar memory leaks
4. **Usar pseudo-eventos** como `(keyup.enter)` para código más limpio
5. **Implementar accesibilidad** con roles ARIA y navegación por teclado

---

# Fase 2: Servicios y Comunicación

Criterios: RA6.e, RA6.g, RA6.h

## Diagrama de Arquitectura de Servicios

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              COMPONENTES                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Header     │  │  StyleGuide  │  │   Pokedex    │  │  Favorites   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │                 │              │
└─────────┼─────────────────┼─────────────────┼─────────────────┼──────────────┘
          │                 │                 │                 │
          ▼                 ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SERVICIOS                                       │
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │   ThemeService      │  │ CommunicationService│  │    ToastService     │  │
│  │   ───────────────   │  │   ───────────────   │  │   ───────────────   │  │
│  │ • currentTheme      │  │ • notifications$    │  │ • toasts$           │  │
│  │ • isDarkTheme       │  │ • sharedData$       │  │ • show()            │  │
│  │ • toggleTheme()     │  │ • selectedPokemon$  │  │ • success()         │  │
│  │ • setTheme()        │  │ • searchFilter$     │  │ • error()           │  │
│  └─────────────────────┘  └─────────────────────┘  │ • warning()         │  │
│                                                     │ • info()            │  │
│  ┌─────────────────────┐                           │ • dismiss()         │  │
│  │   LoadingService    │                           └─────────────────────┘  │
│  │   ───────────────   │                                                    │
│  │ • isLoading$        │                                                    │
│  │ • show()            │                                                    │
│  │ • hide()            │                                                    │
│  │ • forceHide()       │                                                    │
│  └─────────────────────┘                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          COMPONENTES GLOBALES                                │
│  ┌─────────────────────┐  ┌─────────────────────┐                           │
│  │   ToastComponent    │  │   SpinnerComponent  │                           │
│  │   (app-toast)       │  │   (app-spinner)     │                           │
│  └─────────────────────┘  └─────────────────────┘                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Servicios Implementados

### 1. ThemeService (`services/theme.service.ts`)

**Propósito:** Gestión del tema claro/oscuro de la aplicación.

**Características:**
- Detecta `prefers-color-scheme` del sistema
- Persiste preferencia en `localStorage`
- Aplica tema al cargar la aplicación
- Signal reactivo para el tema actual

**Uso:**
```typescript
constructor(private themeService: ThemeService) {}

// Alternar tema
this.themeService.toggleTheme();

// Establecer tema específico
this.themeService.setTheme('dark');

// Verificar tema actual
if (this.themeService.isDarkTheme()) { ... }
```

---

### 2. CommunicationService (`services/communication.service.ts`)

**Propósito:** Comunicación entre componentes hermanos o no relacionados.

**Características:**
- Usa `BehaviorSubject` para mantener el último valor emitido
- Permite suscripciones tardías
- Múltiples canales de comunicación (notificaciones, datos compartidos, etc.)

**Patrones implementados:**
| Tipo Subject | Uso | Ventajas |
|-------------|-----|----------|
| `BehaviorSubject` | Estado compartido | Valor inicial + histórico |

**Uso:**
```typescript
// Componente emisor
constructor(private commService: CommunicationService) {}

onAction() {
  this.commService.sendNotification('Dato enviado');
  this.commService.selectPokemon(25); // Pikachu
}

// Componente receptor
ngOnInit() {
  this.commService.notifications$.subscribe(msg =>
    console.log('Recibido:', msg)
  );

  this.commService.selectedPokemon$.subscribe(id =>
    this.loadPokemon(id)
  );
}
```

---

### 3. ToastService (`services/toast.service.ts`)

**Propósito:** Sistema centralizado de notificaciones toast.

**Características:**
- Soporta múltiples toasts simultáneos
- Auto-dismiss configurable por tipo
- Tipos: `success`, `error`, `warning`, `info`

**Duraciones por defecto:**
| Tipo | Duración |
|------|----------|
| success | 4000ms |
| error | 8000ms |
| warning | 6000ms |
| info | 3000ms |

**Uso:**
```typescript
constructor(private toast: ToastService) {}

// Métodos específicos
this.toast.success('¡Pokémon capturado!');
this.toast.error('Error de conexión');
this.toast.warning('Pokémon debilitado');
this.toast.info('Nuevo evento disponible');

// Método genérico con duración personalizada
this.toast.show('Mensaje', 'success', 5000);

// Cerrar toast específico
this.toast.dismiss(toastId);

// Cerrar todos
this.toast.dismissAll();
```

---

### 4. LoadingService (`services/loading.service.ts`)

**Propósito:** Gestión de estados de carga global.

**Características:**
- Contador de peticiones concurrentes
- Solo oculta cuando todas las peticiones terminan
- Método `forceHide()` para casos de error

**Uso:**
```typescript
constructor(private loading: LoadingService) {}

async loadData() {
  this.loading.show();

  try {
    await this.api.getData();
  } finally {
    this.loading.hide();
  }
}

// Con RxJS y finalize
this.http.get('/api/pokemon').pipe(
  finalize(() => this.loading.hide())
).subscribe();
```

---

## Patrones de Comunicación

### 1. Observable/Subject
```typescript
// Servicio
private subject = new BehaviorSubject<string>('');
public data$ = this.subject.asObservable();

emit(value: string) {
  this.subject.next(value);
}

// Componente
this.service.data$.subscribe(value => this.handleValue(value));
```

### 2. Servicio Singleton
```typescript
@Injectable({ providedIn: 'root' })
export class MyService { ... }
```

### 3. Signals + AsyncPipe
```typescript
// Componente
users$ = this.userService.getUsers();

// Template
@for (user of users$ | async; track user.id) { ... }
```

---

## Separación de Responsabilidades

### Componentes "Dumb" (Presentación)
- Solo templates, signals locales, handlers
- Sin HTTP, validaciones o estado global
- Delegan lógica a servicios

```typescript
// ✅ Componente limpio
@Component({...})
export class UserListComponent {
  users$ = this.userService.getUsers();

  constructor(private userService: UserService) {}

  onSelect(user: User) {
    this.userService.selectUser(user.id);
  }
}
```

### Servicios "Smart" (Lógica)
- Lógica de negocio
- Caching
- Orquestación de APIs
- Validaciones

```typescript
// ✅ Servicio con lógica
@Injectable({ providedIn: 'root' })
export class UserService {
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      map(users => users.filter(u => u.active)),
      catchError(this.handleError)
    );
  }
}
```

---

## Flujo de Datos

```
Usuario interactúa con Componente
          │
          ▼
Componente llama método de Servicio
          │
          ▼
Servicio emite nuevo valor via BehaviorSubject
          │
          ▼
Componentes suscritos reciben actualización
          │
          ▼
Vista se actualiza automáticamente (OnPush + AsyncPipe)
```

---

# Estructura del Proyecto

```
src/
├── app/
│   ├── pages/                    # Páginas/vistas
│   │   ├── home/
│   │   ├── pokedex/
│   │   └── style-guide/
│   ├── app.ts
│   ├── app.html
│   └── app.routes.ts
├── components/
│   ├── layout/                   # Componentes de layout
│   │   └── header/
│   └── shared/                   # Componentes reutilizables
│       ├── accordion/
│       ├── alert/
│       ├── badge/
│       ├── button/
│       ├── card/
│       ├── form-input/
│       ├── form-select/
│       ├── form-textarea/
│       ├── modal/
│       ├── spinner/              # Spinner global de carga
│       ├── tabs/
│       ├── toast/                # Sistema de notificaciones
│       └── tooltip/
├── services/                     # Servicios de la aplicación
│   ├── theme.service.ts          # Gestión de temas
│   ├── communication.service.ts  # Comunicación entre componentes
│   ├── toast.service.ts          # Notificaciones toast
│   └── loading.service.ts        # Estados de carga
└── styles/                       # Estilos globales SCSS
    ├── 00-settings/
    │   ├── _variables.scss
    │   └── _css-variables.scss
    ├── 01-tools/
    │   └── _mixins.scss
    └── styles.scss
```

---

## Testing

Los servicios están diseñados para ser fácilmente testeables:

```typescript
describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should show success toast', () => {
    service.success('Test message');

    service.toasts$.subscribe(toasts => {
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('success');
    });
  });
});
```

---

## Entregables

### Fase 1
- ✅ Componentes interactivos con event binding
- ✅ Navegación por teclado (accesibilidad)
- ✅ Theme switcher con persistencia
- ✅ Manipulación segura del DOM con Renderer2
- ✅ Documentación de arquitectura de eventos

### Fase 2
- ✅ CommunicationService para componentes hermanos
- ✅ Sistema de notificaciones (ToastService + ToastComponent)
- ✅ Loading states (LoadingService + SpinnerComponent)
- ✅ Separación clara entre lógica y presentación
- ✅ Documentación de arquitectura de servicios

### Fase 3
- ✅ Formularios reactivos con FormBuilder
- ✅ Validadores síncronos y asíncronos
- ✅ Validadores personalizados (NIF, teléfono, código postal)
- ✅ Validadores de grupo (passwordMatch, atLeastOneRequired)
- ✅ FormArrays dinámicos
- ✅ Directivas de máscara de entrada
- ✅ Documentación de formularios reactivos

---

# Fase 3: Formularios Reactivos

Criterios: RA6.b, RA6.f

## Diagrama de Arquitectura de Formularios

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FORMULARIOS REACTIVOS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        FormsDemoComponent                            │    │
│  │  ┌─────────────────────┐    ┌─────────────────────┐                 │    │
│  │  │   registroForm      │    │    facturaForm      │                 │    │
│  │  │   (FormGroup)       │    │    (FormGroup)      │                 │    │
│  │  └─────────────────────┘    └─────────────────────┘                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          VALIDADORES                                 │    │
│  │                                                                      │    │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │    │
│  │  │    Síncronos     │  │    Asíncronos    │  │   De Grupo       │   │    │
│  │  │  ─────────────   │  │  ─────────────   │  │  ─────────────   │   │    │
│  │  │ • required       │  │ • usernameAvail  │  │ • passwordMatch  │   │    │
│  │  │ • minLength      │  │ • emailUnique    │  │ • atLeastOne     │   │    │
│  │  │ • pattern        │  │                  │  │   Required       │   │    │
│  │  │ • nif()          │  │                  │  │                  │   │    │
│  │  │ • telefonoMovil()│  │                  │  │                  │   │    │
│  │  │ • codigoPostal() │  │                  │  │                  │   │    │
│  │  │ • passwordStrength│ │                  │  │                  │   │    │
│  │  │ • edadMinima()   │  │                  │  │                  │   │    │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      DIRECTIVAS DE MÁSCARA                           │    │
│  │                                                                      │    │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │    │
│  │  │  NifMaskDirective│  │PhoneMaskDirective│  │PostalCodeMask    │   │    │
│  │  │  [appNifMask]    │  │  [appPhoneMask]  │  │[appPostalCodeMask│   │    │
│  │  │  8 nums + 1 letra│  │  9 números max   │  │  5 números max   │   │    │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Validadores Implementados

### Validadores Síncronos Personalizados

| Validador | Archivo | Descripción | Error Key |
|-----------|---------|-------------|-----------|
| `nif()` | `nif.validator.ts` | Valida formato NIF español (8 números + letra) | `invalidNif`, `invalidNifLetter` |
| `telefonoMovil()` | `telefono.validator.ts` | Valida teléfono móvil español (6xx/7xx) | `invalidPhone` |
| `codigoPostal()` | `codigo-postal.validator.ts` | Valida CP español (01000-52999) | `invalidPostalCode` |
| `passwordStrength()` | `password-strength.validator.ts` | Verifica fortaleza de contraseña | `weakPassword` |
| `edadMinima()` | `edad-minima.validator.ts` | Verifica edad mínima desde fecha | `edadMinima` |

### Validadores Asíncronos

| Validador | Servicio | Descripción |
|-----------|----------|-------------|
| `usernameAvailable()` | `AsyncValidatorsService` | Verifica disponibilidad de username (simulado) |
| `emailUnique()` | `AsyncValidatorsService` | Verifica unicidad de email (simulado) |

### Validadores de Grupo

| Validador | Descripción |
|-----------|-------------|
| `passwordMatch(field1, field2)` | Verifica que dos campos coincidan |
| `atLeastOneRequired(field1, field2)` | Al menos uno de los campos debe tener valor |

## Uso de Validadores

### Validador de NIF
```typescript
// En el FormGroup
nif: ['', [Validators.required, nif()]]

// En el template
@if (hasError('nif', 'invalidNif')) {
  <span class="error">Formato de NIF inválido</span>
}
@if (hasError('nif', 'invalidNifLetter')) {
  <span class="error">La letra del NIF no es correcta</span>
}
```

### Validador Asíncrono
```typescript
username: ['', {
  validators: [Validators.required, Validators.minLength(3)],
  asyncValidators: [this.asyncValidators.usernameAvailable()],
  updateOn: 'blur'  // Solo valida al perder el foco
}]
```

### Validador de Grupo
```typescript
this.fb.group({
  password: ['', [Validators.required]],
  confirmPassword: ['', [Validators.required]]
}, {
  validators: [passwordMatch('password', 'confirmPassword')]
});
```

## Directivas de Máscara

Las directivas de máscara restringen la entrada del usuario en tiempo real:

### NifMaskDirective
```html
<input appNifMask formControlName="nif">
```
- Solo permite 8 dígitos numéricos
- Después permite 1 letra (auto-mayúscula)
- Bloquea cualquier otro carácter

### PhoneMaskDirective
```html
<input appPhoneMask formControlName="telefono">
```
- Solo permite dígitos numéricos
- Máximo 9 dígitos
- No permite letras ni caracteres especiales

### PostalCodeMaskDirective
```html
<input appPostalCodeMask formControlName="codigoPostal">
```
- Solo permite dígitos numéricos
- Máximo 5 dígitos

## FormArrays Dinámicos

### Estructura
```typescript
// Definición
telefonos: this.fb.array([])

// Crear nuevo item
newTelefono(): FormGroup {
  return this.fb.group({
    numero: ['', [Validators.required, telefonoMovil()]],
    tipo: ['movil']
  });
}

// Agregar
addTelefono(): void {
  this.telefonos.push(this.newTelefono());
}

// Eliminar
removeTelefono(index: number): void {
  if (this.telefonos.length > 1) {
    this.telefonos.removeAt(index);
  }
}
```

### En el Template
```html
<div formArrayName="telefonos">
  @for (tel of telefonos.controls; track $index; let i = $index) {
    <div [formGroupName]="i">
      <input formControlName="numero" appPhoneMask>
      <input type="radio" formControlName="tipo" value="movil">
      <input type="radio" formControlName="tipo" value="fijo">
    </div>
  }
</div>
```

## Formularios Implementados

### 1. Formulario de Registro
- Datos de cuenta (username, email, password)
- Datos personales (nombre, apellidos, NIF, fecha nacimiento)
- Contacto (teléfono móvil/fijo con validación cruzada)
- Dirección completa
- Aceptación de términos

### 2. Formulario de Factura
- Datos del cliente (nombre, NIF)
- Teléfonos de contacto (FormArray)
- Direcciones (FormArray con tipo envío/facturación)
- Items de factura (FormArray con cálculo de totales)

## Estructura de Archivos

```
src/
├── validators/
│   ├── index.ts                    # Exportaciones públicas
│   ├── nif.validator.ts            # Validador NIF español
│   ├── telefono.validator.ts       # Validador teléfono móvil
│   ├── codigo-postal.validator.ts  # Validador código postal
│   ├── password-strength.validator.ts
│   ├── password-match.validator.ts
│   ├── at-least-one-required.validator.ts
│   ├── edad-minima.validator.ts
│   └── async-validators.service.ts # Validadores asíncronos
├── directives/
│   ├── index.ts                    # Exportaciones públicas
│   ├── nif-mask.directive.ts       # Máscara NIF
│   ├── phone-mask.directive.ts     # Máscara teléfono
│   └── postal-code-mask.directive.ts # Máscara código postal
└── app/
    └── pages/
        └── forms-demo/
            ├── forms-demo.ts       # Componente
            ├── forms-demo.html     # Template
            └── forms-demo.scss     # Estilos
```

## Buenas Prácticas - Formularios

1. **Usar `updateOn: 'blur'`** para validadores asíncronos (evita llamadas excesivas)
2. **Separar validadores** en archivos individuales para reutilización
3. **Crear directivas de máscara** para restricciones de entrada en tiempo real
4. **Usar FormArrays** para datos dinámicos (teléfonos, direcciones, items)
5. **Validadores de grupo** para validaciones que involucran múltiples campos
6. **Feedback visual inmediato** con clases CSS para estados válido/inválido/pendiente
