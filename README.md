# Pokedex

Aplicación web fullstack para gestionar y visualizar información de Pokémon. El proyecto está dividido en dos partes: un frontend desarrollado con Angular y un backend con Spring Boot que expone una API REST.

## Tecnologías

### Frontend
- **Angular 21** con componentes standalone y signals
- **SCSS** con arquitectura modular y sistema de temas (claro/oscuro)
- **RxJS** para programación reactiva y gestión de estado
- **Formularios reactivos** con validadores personalizados
- **Docker + Nginx** para despliegue en producción

### Backend
- **Spring Boot 3.2** con Java 17
- **Spring Security** con autenticación JWT
- **Spring Data JPA** para persistencia
- **MySQL** como base de datos
- **API REST** con documentación completa

## Características del Frontend

### Componentes de Layout
- **Header**: Navegación principal con soporte para tema claro/oscuro
- **Footer**: Información del pie de página
- **Main**: Contenedor principal con estilos adaptativos

### Componentes UI
- **Button**: Botones con múltiples variantes (primary, secondary, danger) y estados
- **Card**: Tarjetas para mostrar información de Pokémon con imagen, tipos y acciones
- **Badge**: Etiquetas para mostrar tipos de Pokémon con colores personalizados
- **Alert**: Mensajes de alerta con tipos success, error, warning e info
- **Modal**: Ventanas modales para confirmaciones y formularios
- **Tabs**: Sistema de pestañas con variantes (default, pills, underline)
- **Accordion**: Paneles colapsables para FAQs y contenido extenso
- **Tooltip**: Información contextual al pasar el cursor

### Componentes de Formulario
- **Form Input**: Campos de texto con validación y estados de error
- **Form Textarea**: Áreas de texto extenso
- **Form Select**: Selector desplegable (incluye los 18 tipos de Pokémon)
- **Login Form**: Formulario de autenticación completo

### Componentes de Feedback
- **Toast**: Notificaciones temporales no intrusivas
- **Spinner/Loading**: Indicador de carga global

### Servicios
- **ThemeService**: Gestión del tema claro/oscuro con persistencia
- **ToastService**: Sistema de notificaciones toast
- **LoadingService**: Control del estado de carga global
- **CommunicationService**: Comunicación entre componentes con RxJS
- **PokemonService**: Conexión con la API de Pokémon

### Validadores Personalizados
- Validador de fortaleza de contraseña
- Validadores de formatos españoles (NIF, teléfono, código postal)
- Validadores cross-field (confirmación de contraseña)
- Validadores asíncronos

### Directivas
- Máscara de NIF
- Máscara de teléfono
- Máscara de código postal

## Características del Backend

- API REST con endpoints para gestión de Pokémon
- Autenticación y autorización con JWT
- Validación de datos de entrada
- Manejo de errores centralizado
- Documentación de API disponible en `/backend/API-DOCUMENTACION.md`

## Despliegue con Docker

```bash
cd frontend
docker build -t pokedex-frontend .
docker run -p 8080:80 pokedex-frontend
```

La aplicación estará disponible en `http://localhost:8080`

## Documentación Adicional

- [Documentación del Backend](backend/DOCUMENTACION.md)
- [Documentación de la API](backend/API-DOCUMENTACION.md)
- [Documentación de Archivos](backend/DOCUMENTACION_ARCHIVOS.md)
- [Documentación de Seguridad](backend/DOCUMENTACION_SEGURIDAD.md)
- [Documentación de Entorno cliente](frontend/README_Entorno_cliente.md)
