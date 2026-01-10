# Documentación y salud de la aplicación.

## Índice
1. [Spring Boot Actuator](#spring-boot-actuator)
2. [Swagger / OpenAPI](#swagger--openapi)
3. [Enlaces de Acceso](#enlaces-de-acceso)

---

## Spring Boot actuator.

### ¿Qué es?
Spring Boot Actuator es un módulo que proporciona endpoints para monitorear y gestionar la aplicación en producción. Permite verificar el estado de salud, métricas de rendimiento y información del sistema.

### Configuración implementada:

**Dependencia añadida en `pom.xml`:**
```xml

    org.springframework.boot
    spring-boot-starter-actuator

```

**Configuración en `application.properties`:**
```properties
# Actuator - Monitoreo y Salud
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
management.info.env.enabled=true
info.app.name=Pokedex API
info.app.description=Backend API REST para aplicacion Pokedex
info.app.version=1.0.0
```

**Configuración de seguridad en `SecurityConfig.java`:**
```java
.requestMatchers("/actuator/**").permitAll()
```

### Endpoints Disponibles

| Endpoint | URL | Descripción |
|----------|-----|-------------|
| Health | `/actuator/health` | Estado de salud de la aplicación |
| Info | `/actuator/info` | Información de la aplicación |
| Metrics | `/actuator/metrics` | Métricas de rendimiento |

### Ejemplo de respuesta - Health Check:

```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 414921494528,
        "free": 63114440704,
        "threshold": 10485760,
        "exists": true
      }
    },
    "livenessState": {
      "status": "UP"
    },
    "ping": {
      "status": "UP"
    },
    "readinessState": {
      "status": "UP"
    }
  }
}
```

### Componentes monitoreados:

- **db**: Estado de la conexión a la base de datos PostgreSQL
- **diskSpace**: Espacio disponible en disco del servidor
- **livenessState**: Si la aplicación está viva y respondiendo
- **ping**: Respuesta básica del servidor
- **readinessState**: Si la aplicación está lista para recibir tráfico

---

## Swagger / OpenAPI.

### ¿Qué es?
Swagger (OpenAPI) es una herramienta que genera documentación interactiva de la API REST automáticamente. Permite visualizar todos los endpoints, sus parámetros, y probarlos directamente desde el navegador.

### Configuración implementada:

**Dependencia añadida en `pom.xml`:**
```xml

    org.springdoc
    springdoc-openapi-starter-webmvc-ui
    2.3.0

```

**Configuración en `application.properties`:**
```properties
# Swagger / OpenAPI - Documentación de API
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
```

**Configuración de seguridad en `SecurityConfig.java`:**
```java
.requestMatchers("/swagger-ui/**").permitAll()
.requestMatchers("/swagger-ui.html").permitAll()
.requestMatchers("/v3/api-docs/**").permitAll()
.requestMatchers("/swagger-resources/**").permitAll()
.requestMatchers("/webjars/**").permitAll()
```

### Controladores documentados:

| Controlador | Descripción | Endpoints |
|-------------|-------------|-----------|
| **auth-controller** | Autenticación y gestión de usuarios | login, register, profile, validate, delete-account |
| **pokemon-controller** | CRUD de Pokémon | GET, POST, PUT, DELETE |
| **favorito-controller** | Gestión de favoritos | añadir, eliminar, toggle, listar |
| **tipo-controller** | Tipos de Pokémon | listar, obtener por id/nombre |
| **file-controller** | Gestión de imágenes | subir, obtener, eliminar |
| **health-controller** | Health check personalizado | GET /api/health |

### Schemas (DTOs) documentados:

- `PokemonDTO` - Datos de un Pokémon.
- `EstadisticasDTO` - Estadísticas base de un Pokémon.
- `EvolucionDTO` - Información de evolución.
- `TipoDTO` - Tipo de Pokémon.
- `LoginRequest` - Petición de login.
- `RegisterRequest` - Petición de registro.
- `ProfileUpdateRequest` - Actualización de perfil.
- `EvolucionRequest` - Crear evolución.

---

## Enlaces de acceso.

### Producción (Render):

| Recurso | URL |
|---------|-----|
| **Actuator Health** | https://pokedex-backend-mwcz.onrender.com/actuator/health |
| **Actuator Info** | https://pokedex-backend-mwcz.onrender.com/actuator/info |
| **Actuator Metrics** | https://pokedex-backend-mwcz.onrender.com/actuator/metrics |
| **Swagger UI** | https://pokedex-backend-mwcz.onrender.com/swagger-ui.html |
| **OpenAPI JSON** | https://pokedex-backend-mwcz.onrender.com/v3/api-docs |

### Desarrollo local:

| Recurso | URL |
|---------|-----|
| **Actuator Health** | http://localhost:8080/actuator/health |
| **Swagger UI** | http://localhost:8080/swagger-ui.html |

---

### Actuator Health:
La respuesta muestra el estado de todos los componentes:
- Base de datos PostgreSQL conectada.
- Espacio en disco suficiente.
- Aplicación lista para recibir peticiones.

### Swagger UI:
Interfaz interactiva que permite:
- Ver todos los endpoints organizados por controlador.
- Probar peticiones directamente desde el navegador.
- Ver los schemas de datos (DTOs).
- Descargar la especificación OpenAPI en JSON.

---

## Tecnologías utilizadas:

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Spring Boot Actuator | 3.2.1 | Monitoreo y salud |
| SpringDoc OpenAPI | 2.3.0 | Documentación Swagger |
| Spring Security | 6.x | Configuración de acceso público |

