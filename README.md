# Pokédex.

Aplicación web fullstack para gestionar y visualizar información de Pokémon. El proyecto está dividido en dos partes: un frontend desarrollado con Angular y un backend con Spring Boot que expone una API REST.

## Aplicación en producción:

**URL:** pablitoclavito04.github.io/Pokedex/

**Características principales:**
- Interfaz responsive (mobile, tablet, desktop).
- Modo claro/oscuro con persistencia.
- Búsqueda y filtrado de Pokémon.
- Sistema de favoritos.
- Gestión de equipos Pokémon.
- Quiz interactivo.
- Autenticación de usuarios.

## Métricas de rendimiento:

| Métrica | Score | Herramienta |
|---------|-------|-------------|
| Performance | 92/100 | Lighthouse |
| Accessibility | 98/100 | Lighthouse |
| Best Practices | 95/100 | Lighthouse |
| SEO | 100/100 | Lighthouse |

## Tecnologías.

### Frontend:
- **Angular 21** con componentes standalone y signals.
- **SCSS** con arquitectura modular y sistema de temas (claro/oscuro).
- **RxJS** para programación reactiva y gestión de estado.
- **Formularios reactivos** con validadores personalizados.
- **Docker + Nginx** para despliegue en producción.

### Backend:
- **Spring Boot 3.2** con Java 17
- **Spring Security** con autenticación JWT.
- **Spring Data JPA** para persistencia.
- **MySQL** como base de datos.
- **API REST** con documentación completa.

## Características del frontend.

### Componentes de layout:
- **Header**: Navegación principal con soporte para tema claro/oscuro.
- **Footer**: Información del pie de página.
- **Main**: Contenedor principal con estilos adaptativos.

### Componentes UI:
- **Button**: Botones con múltiples variantes (primary, secondary, danger) y estados.
- **Card**: Tarjetas para mostrar información de Pokémon con imagen, tipos y acciones.
- **Badge**: Etiquetas para mostrar tipos de Pokémon con colores personalizados.
- **Alert**: Mensajes de alerta con tipos success, error, warning e info.
- **Modal**: Ventanas modales para confirmaciones y formularios.
- **Tabs**: Sistema de pestañas con variantes (default, pills, underline).
- **Accordion**: Paneles colapsables para FAQs y contenido extenso.
- **Tooltip**: Información contextual al pasar el cursor.

### Componentes de formulario:
- **Form Input**: Campos de texto con validación y estados de error.
- **Form Textarea**: Áreas de texto extenso.
- **Form Select**: Selector desplegable (incluye los 18 tipos de Pokémon).
- **Login Form**: Formulario de autenticación completo.

### Componentes de feedback:
- **Toast**: Notificaciones temporales no intrusivas.
- **Spinner/Loading**: Indicador de carga global.

### Servicios:
- **ThemeService**: Gestión del tema claro/oscuro con persistencia.
- **ToastService**: Sistema de notificaciones toast.
- **LoadingService**: Control del estado de carga global.
- **CommunicationService**: Comunicación entre componentes con RxJS.
- **PokemonService**: Conexión con la API de Pokémon.

### Validadores personalizados:
- Validador de fortaleza de contraseña.
- Validadores de formatos españoles (NIF, teléfono, código postal).
- Validadores cross-field (confirmación de contraseña).
- Validadores asíncronos.

### Directivas:
- Máscara de NIF.
- Máscara de teléfono.
- Máscara de código postal.

## Características del Backend.

- API REST con endpoints para gestión de Pokémon.
- Autenticación y autorización con JWT.
- Validación de datos de entrada.
- Manejo de errores centralizado.
- Documentación de API disponible en `/backend/API-DOCUMENTACION.md`

## Instalación y desarrollo local:

### Requisitos previos:
- Node.js 18+ y npm
- Angular CLI 17+
- Java 17+ (para el backend)
- MySQL 8+ (para el backend)

### Instalación del frontend:

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/Pokedex.git
cd Pokedex/frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Build de producción:

```bash
# Generar build optimizado
npm run build -- --configuration production

# Output en: frontend/dist/frontend/browser/
```

## Despliegue con docker

```bash
cd frontend
docker build -t pokedex-frontend .
docker run -p 8080:80 pokedex-frontend
```

La aplicación estará disponible en `http://localhost:8080`

## Despliegue en GitHub pages:

```bash
# Build de producción
cd frontend
npm run build -- --configuration production

# Deploy a gh-pages branch
git checkout gh-pages
cp -r frontend/dist/frontend/browser/* .
git add .
git commit -m "Deploy: Actualización"
git push origin gh-pages
```

## Estructura del proyecto:

```
Pokedex/
├── frontend/               # Angular 21 application
│   ├── src/
│   │   ├── app/           # Componentes, servicios, guards
│   │   ├── styles/        # Sistema de diseño ITCSS
│   │   └── assets/        # Imágenes, fonts, iconos
│   └── docs/
│       └── design/        # Documentación de diseño (DIW)
└── backend/               # Spring Boot API
    ├── src/
    └── docs/              # Documentación de API
```

## Documentación completa:

### Diseño de Interfaces Web (DIW):
- [Sección 1: Componentes Básicos](frontend/docs/design/Sección%201%20Componentes%20básicos.md)
- [Sección 2: Sistema de Diseño](frontend/docs/design/Sección%202%20Sistema%20de%20diseño.md)
- [Sección 3: Layouts y Páginas](frontend/docs/design/Sección%203%20Layouts%20y%20páginas%20completas.md)
- [Sección 4: Responsive Design](frontend/docs/design/Sección%204%20Repsonsive%20design%20y%20layouts%20completos.md)
- [Sección 5: Optimización Multimedia](frontend/docs/design/Sección%205%20Optimización%20Multimedia.md)
- [Sección 6: Temas y Modo Oscuro](frontend/docs/design/Sección%206%20Temas%20y%20modo%20oscuro.md)
- [Sección 7: Aplicación Completa y Despliegue](frontend/docs/design/Sección%207%20Aplicación%20completa%20y%20despliegue.md)

### Desarrollo Web en Entorno Cliente (DWEC):
- [Documentación del Frontend (Entorno Cliente)](frontend/README%20Entorno%20cliente.md)

### Backend (Spring Boot):
- [Documentación del Backend](backend/DOCUMENTACION.md)
- [Documentación de la API](backend/API-DOCUMENTACION.md)
- [Documentación de Archivos](backend/DOCUMENTACION_ARCHIVOS.md)
- [Documentación de Seguridad](backend/DOCUMENTACION_SEGURIDAD.md)

