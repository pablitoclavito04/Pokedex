# Documentación de Seguridad - Sistema JWT

---

## ÍNDICE

1. [¿Qué es JWT?](#1-qué-es-jwt)
2. [¿Por qué necesitamos seguridad?](#2-por-qué-necesitamos-seguridad)
3. [Arquitectura de Seguridad](#3-arquitectura-de-seguridad)
4. [Sistema de Roles](#4-sistema-de-roles)
5. [Flujo de Autenticación](#5-flujo-de-autenticación)
6. [Endpoints de Autenticación](#6-endpoints-de-autenticación)
7. [Protección de Endpoints](#7-protección-de-endpoints)
8. [Clases Implementadas](#8-clases-implementadas)
9. [Cómo Usar el Sistema](#9-cómo-usar-el-sistema)
10. [Ejemplos Prácticos](#10-ejemplos-prácticos)

---

## 1. ¿QUÉ ES JWT?

### Definición:

**JWT (JSON Web Token)** es un estándar abierto (RFC 7519) que define una forma compacta y segura de transmitir información entre dos partes como un objeto JSON.

### Analogía simple:

Imagina que JWT es como un **carnet de identidad digital**:

```
            ┌─────────────────────────────────────────┐
            │         CARNET DE ACCESO                │
            ├─────────────────────────────────────────┤
            │  Nombre: Pablo                          │
            │  Rol: USER                              │
            │  Válido hasta: 24 horas                 │
            │  Firma: ✓ Verificado por el servidor    │
            └─────────────────────────────────────────┘
```

- Cuando haces **login**, el servidor te da este "carnet" (token)
- Cada vez que haces una petición, muestras tu "carnet"
- El servidor verifica que el "carnet" es auténtico
- Si es válido y tienes permisos, te permite la acción

### Estructura de un token JWT:

Un token JWT tiene 3 partes separadas por puntos:

```
eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInN1YiI6InBhYmxvIn0.abc123...
│_______________________│_________________________________│___________│
        HEADER                      PAYLOAD                  SIGNATURE
```

1. **Header:** Tipo de token y algoritmo de encriptación
2. **Payload:** Datos del usuario (nombre, rol, expiración)
3. **Signature:** Firma para verificar autenticidad

---

## 2. ¿POR QUÉ NECESITAMOS SEGURIDAD?

### Sin seguridad (Es peligroso):

```
CUALQUIER PERSONA puede:
GET    /api/pokemon         → Ver todos los Pokémon
POST   /api/pokemon         → Crear Pokémon falsos
PUT    /api/pokemon/1       → Modificar cualquier dato
DELETE /api/pokemon/1       → Eliminar Pokémon

Resultado: Base de datos destruida en minutos
```

### Con seguridad (Está protegido):

```
VISITANTE (sin login):
GET    /api/pokemon         → Ver Pokémon
POST   /api/pokemon         → 403 Forbidden
DELETE /api/pokemon/1       → 403 Forbidden

USUARIO (con login):
GET    /api/pokemon         → Ver Pokémon
POST   /api/pokemon         → Crear Pokémon
PUT    /api/pokemon/1       → Editar Pokémon
DELETE /api/pokemon/1       → 403 Forbidden

ADMIN (con login + rol admin):
TODO permitido
```

---

## 3. ARQUITECTURA DE SEGURIDAD.

### Diagrama de componentes:

```
┌─────────────────────────────────────────────────────────────┐
│                 CLIENTE (Insomnia/Frontend)                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ HTTP Request + Token
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  JwtAuthenticationFilter                    │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ 1. Extraer token del header "Authorization"         │   │
│   │ 2. Validar token con JwtUtil                        │   │
│   │ 3. Extraer username y role                          │   │
│   │ 4. Crear autenticación en Spring Security           │   │
│   └─────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     SecurityConfig                          │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Verificar si el usuario tiene permiso para          │   │
│   │ acceder al endpoint solicitado                      │   │
│   └─────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌─────────────────────┐         ┌─────────────────────┐
    │     PERMITIDO       │         │      DENEGADO       │
    │                     │         │                     │
    │  → Controller       │         │  → 403 Forbidden    │
    │  → Service          │         │                     │
    │  → Repository       │         │                     │
    │  → Base de Datos    │         │                     │
    └─────────────────────┘         └─────────────────────┘
```

---

## 4. SISTEMA DE ROLES.

### Roles implementados:

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Sin login** | Visitante anónimo | Solo lectura (GET) |
| **USER** | Usuario registrado | Lectura + Crear + Editar |
| **ADMIN** | Administrador | Todo (incluyendo eliminar) |

### Tabla de permisos por endpoint:

| Endpoint | Método | Sin login | USER | ADMIN |
|----------|--------|-----------|------|-------|
| `/api/auth/register` | POST | ✅ | ✅ | ✅ |
| `/api/auth/login` | POST | ✅ | ✅ | ✅ |
| `/api/pokemon` | GET | ✅ | ✅ | ✅ |
| `/api/pokemon/{id}` | GET | ✅ | ✅ | ✅ |
| `/api/pokemon` | POST | ❌ | ✅ | ✅ |
| `/api/pokemon/{id}` | PUT | ❌ | ✅ | ✅ |
| `/api/pokemon/{id}` | DELETE | ❌ | ❌ | ✅ |
| `/api/pokemon/{id}/imagen` | POST | ❌ | ✅ | ✅ |
| `/api/pokemon/{id}/imagen` | GET | ✅ | ✅ | ✅ |
| `/api/pokemon/{id}/imagen` | DELETE | ❌ | ❌ | ✅ |

---

## 5. FLUJO DE AUTENTICACIÓN.

### Registro de usuario:

```
┌──────────┐                              ┌──────────┐
│  Cliente │                              │ Servidor │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │  POST /api/auth/register                │
     │  {username, password, email}            │
     │────────────────────────────────────────>│
     │                                         │
     │                              ┌──────────┴──────────┐
     │                              │ 1. Validar datos    │
     │                              │ 2. Encriptar pass   │
     │                              │ 3. Guardar en BD    │
     │                              │ 4. Generar token    │
     │                              └──────────┬──────────┘
     │                                         │
     │  201 Created                            │
     │  {token, username, email, role}         │
     │<────────────────────────────────────────│
     │                                         │
```

### Login:

```
┌──────────┐                              ┌──────────┐
│  Cliente │                              │ Servidor │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │  POST /api/auth/login                   │
     │  {username, password}                   │
     │────────────────────────────────────────>│
     │                                         │
     │                              ┌──────────┴──────────┐
     │                              │ 1. Buscar usuario   │
     │                              │ 2. Verificar pass   │
     │                              │ 3. Generar token    │
     │                              └──────────┬──────────┘
     │                                         │
     │  200 OK                                 │
     │  {token, username, email, role}         │
     │<────────────────────────────────────────│
     │                                         │
```

### Petición protegida:

```
┌──────────┐                              ┌──────────┐
│  Cliente │                              │ Servidor │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │  POST /api/pokemon                      │
     │  Authorization: Bearer TOKEN            │
     │  {numero: 25, nombre: "Pikachu"...}     │
     │────────────────────────────────────────>│
     │                                         │
     │                              ┌──────────┴──────────┐
     │                              │ 1. Extraer token    │
     │                              │ 2. Validar token    │
     │                              │ 3. Verificar rol    │
     │                              │ 4. Ejecutar acción  │
     │                              └──────────┬──────────┘
     │                                         │
     │  201 Created                            │
     │  {id: 8, numero: 25, nombre: "Pikachu"} │
     │<────────────────────────────────────────│
     │                                         │
```

---

## 6. ENDPOINTS DE AUTENTICACIÓN.

### POST /api/auth/register

**Descripción:** Registrar un nuevo usuario

**Request:**
```json
{
  "username": "pablo",
  "password": "password123",
  "email": "pablo@pokedex.com"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "pablo",
  "email": "pablo@pokedex.com",
  "role": "USER"
}
```

**Validaciones:**
- Username único
- Email único y válido
- Contraseña mínimo 6 caracteres

---

### POST /api/auth/login

**Descripción:** Iniciar sesión

**Request:**
```json
{
  "username": "pablo",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "pablo",
  "email": "pablo@pokedex.com",
  "role": "USER"
}
```

---

### GET /api/auth/validate

**Descripción:** Verificar si un token es válido

**Request:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response (200 OK):**
```
Token válido. Usuario: pablo, Rol: USER
```

---

## 7. PROTECCIÓN DE ENDPOINTS.

### Cómo usar el token:

Para acceder a endpoints protegidos, añadir el header:

```
Authorization: Bearer TU_TOKEN_AQUI
```

**Importante:**
- `Bearer` con B mayúscula
- Un espacio entre `Bearer` y el token
- El token completo (empieza con `eyJ`)

### Ejemplo en Insomnia/Postman

```http
POST http://localhost:8080/api/pokemon
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInN1YiI6InBhYmxvIiwiaWF0IjoxNzMzNDU2NzgwfQ.abc123
Content-Type: application/json

{
  "numero": 25,
  "nombre": "Pikachu",
  ...
}
```

---


## 8. CLASES IMPLEMENTADAS.

### Estructura de archivos:

```

src/main/java/
├── entity/
│   └── User.java              ← Entidad de usuario
├── repository/
│   └── UserRepository.java    ← Acceso a BD de usuarios
├── dto/
│   ├── RegisterRequest.java   ← DTO para registro
│   ├── LoginRequest.java      ← DTO para login
│   └── AuthResponse.java      ← DTO de respuesta
├── service/
│   └── AuthService.java       ← Lógica de autenticación
├── controller/
│   └── AuthController.java    ← Endpoints REST
├── security/
│   ├── SecurityConfig.java    ← Configuración de seguridad
│   └── JwtAuthenticationFilter.java ← Filtro JWT
└── util/
    └── JwtUtil.java           ← Utilidad para tokens

```

### Descripción de cada clase:

| Clase | Responsabilidad |
|-------|-----------------|
| **User** | Representa un usuario en la BD |
| **UserRepository** | CRUD de usuarios |
| **RegisterRequest** | Datos de registro |
| **LoginRequest** | Credenciales de login |
| **AuthResponse** | Respuesta con token |
| **AuthService** | Lógica de registro/login |
| **AuthController** | Endpoints de autenticación |
| **SecurityConfig** | Configuración de permisos |
| **JwtAuthenticationFilter** | Intercepta y valida tokens |
| **JwtUtil** | Genera y valida tokens JWT |

---

## 9. CÓMO USAR EL SISTEMA.

### Paso 1: Registrar usuario

```bash
POST /api/auth/register
{
  "username": "miusuario",
  "password": "mipassword",
  "email": "mi@email.com"
}
```

### Paso 2: Guardar el token

De la respuesta, guardar el campo `token`.

### Paso 3: Usar el token en peticiones

```bash
POST /api/pokemon
Authorization: Bearer MI_TOKEN
Content-Type: application/json

{...datos del pokemon...}
```

### Paso 4: Renovar token (si expira)

Los tokens expiran en 24 horas. Hacer login de nuevo:

```bash
POST /api/auth/login
{
  "username": "miusuario",
  "password": "mipassword"
}
```

---

## 10. EJEMPLOS PRÁCTICOS.

### Ejemplo 1: Flujo completo de usuario

```
1. Registro → Obtener token
2. Crear Pokémon → Con token (201 OK)
3. Editar Pokémon → Con token (200 OK)
4. Eliminar → 403 Forbidden (no es ADMIN)
```

### Ejemplo 2: Convertir a ADMIN

```sql
-- En MySQL
UPDATE users SET role = 'ADMIN' WHERE username = 'pablo';
```

Luego hacer login de nuevo para obtener token con rol ADMIN.

### Ejemplo 3: Token expirado

```
Request: POST /api/pokemon
Response: 403 Forbidden

Solución: Hacer login de nuevo → Nuevo token
```

---

## RESUMEN:

| Concepto | Descripción |
|----------|-------------|
| **JWT** | Token de autenticación seguro |
| **Roles** | Niveles de permisos (USER, ADMIN) |
| **Token** | "Carnet digital" que identifica al usuario |
| **24 horas** | Duración del token |
| **BCrypt** | Algoritmo de encriptación de contraseñas |

---

**El sistema de seguridad está completamente funcional.**