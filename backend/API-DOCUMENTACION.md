# API REST Pokédex - Documentación de Endpoints.

**Base URL:** `http://localhost:8080/api`
**Formato de respuesta:** JSON
**Versión:** 2.0 (con Seguridad JWT y Upload de Archivos)

---

## ÍNDICE

1. [Autenticación](#1-autenticación)
2. [Endpoints de Pokemon](#2-endpoints-de-pokemon)
3. [Endpoints de Tipos](#3-endpoints-de-tipos)
4. [Endpoints de Imágenes](#4-endpoints-de-imágenes)
5. [Códigos de Estado HTTP](#5-códigos-de-estado-http)
6. [Ejemplos de Uso](#6-ejemplos-de-uso)
7. [Manejo de Errores](#7-manejo-de-errores)

---

## 1. AUTENTICACIÓN

### 1.0 Sistema de Seguridad JWT

La API utiliza **JWT (JSON Web Token)** para autenticación. Es como un "carnet digital" que identifica al usuario.

**Niveles de acceso:**

| Nivel | Descripción | Permisos |
|-------|-------------|----------|
| **Público** | Sin login | Solo GET (consultar) |
| **USER** | Usuario registrado | GET + POST + PUT (crear/editar) |
| **ADMIN** | Administrador | Todo (incluyendo DELETE) |

**Cómo usar el token:**

1. Registrarse o hacer login
2. Copiar el token de la respuesta
3. Añadir en cada petición protegida:
   ```
   Authorization: Bearer TU_TOKEN_AQUI
   ```

---

### 1.1 Registrar Usuario:

**POST** `/auth/register`

Crea una nueva cuenta de usuario.

**Request:**
```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "pablo",
  "password": "password123",
  "email": "pablo@pokedex.com"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInN1YiI6InBhYmxvIiwiaWF0IjoxNzMzNDU2NzgwfQ...",
  "username": "pablo",
  "email": "pablo@pokedex.com",
  "role": "USER"
}
```

**Validaciones:**
- ✅ Username único (no repetido)
- ✅ Email único y válido (contiene @)
- ✅ Contraseña mínimo 6 caracteres

**Errores:**
- `400 Bad Request` - "El username ya está en uso"
- `400 Bad Request` - "El email ya está en uso"
- `400 Bad Request` - "La contraseña debe tener al menos 6 caracteres"

---

### 1.2 Iniciar Sesión (Login):

**POST** `/auth/login`

Inicia sesión y obtiene un token JWT.

**Request:**
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "pablo",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInN1YiI6InBhYmxvIiwiaWF0IjoxNzMzNDU2NzgwfQ...",
  "username": "pablo",
  "email": "pablo@pokedex.com",
  "role": "USER"
}
```

**Errores:**
- `401 Unauthorized` - "Usuario o contraseña incorrectos"
- `401 Unauthorized` - "La cuenta está deshabilitada"

---

### 1.3 Validar Token:

**GET** `/auth/validate`

Verifica si un token es válido.

**Request:**
```http
GET http://localhost:8080/api/auth/validate
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response (200 OK):**
```
Token válido. Usuario: pablo, Rol: USER
```

**Errores:**
- `401 Unauthorized` - Token inválido o expirado

**Nota:** Los tokens expiran en **24 horas**. Después hay que hacer login de nuevo.

---

## 2. ENDPOINTS DE POKEMON.

### Tabla de Permisos:

| Método | Endpoint | Público | USER | ADMIN |
|--------|----------|---------|------|-------|
| GET | /api/pokemon | ✅ | ✅ | ✅ |
| GET | /api/pokemon/{id} | ✅ | ✅ | ✅ |
| GET | /api/pokemon/numero/{n} | ✅ | ✅ | ✅ |
| GET | /api/pokemon/buscar | ✅ | ✅ | ✅ |
| GET | /api/pokemon/generacion/{g} | ✅ | ✅ | ✅ |
| GET | /api/pokemon/tipo/{t} | ✅ | ✅ | ✅ |
| POST | /api/pokemon | ❌ | ✅ | ✅ |
| PUT | /api/pokemon/{id} | ❌ | ✅ | ✅ |
| DELETE | /api/pokemon/{id} | ❌ | ❌ | ✅ |
| POST | /api/pokemon/{id}/evolucion | ❌ | ✅ | ✅ |

---

### 2.1 Listar Todos los Pokémon:

**GET** `/pokemon`

Obtiene la lista completa de Pokémon ordenados por número de Pokédex.

**Autenticación:** No requerida (público)

**Request:**
```http
GET http://localhost:8080/api/pokemon
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "numero": 1,
    "nombre": "Bulbasaur",
    "altura": 0.70,
    "peso": 6.90,
    "descripcion": "Bulbasaur es un Pokémon cuadrúpedo...",
    "imagenUrl": "/api/pokemon/1/imagen",
    "generacion": 1,
    "tipos": ["Planta", "Veneno"],
    "estadisticas": {
      "id": 1,
      "ps": 45,
      "ataque": 49,
      "defensa": 49,
      "velocidad": 45,
      "ataqueEspecial": 65,
      "defensaEspecial": 65,
      "total": 318
    },
    "evoluciones": [
      {
        "id": 1,
        "pokemonOrigen": "Bulbasaur",
        "pokemonDestino": "Ivysaur",
        "nivelEvolucion": 16,
        "metodo": "Nivel"
      }
    ]
  }
]
```

---

### 2.2 Obtener Pokémon por ID:

**GET** `/pokemon/{id}`

Obtiene un Pokémon específico por su ID.

**Autenticación:** No requerida (público)

**Request:**
```http
GET http://localhost:8080/api/pokemon/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "numero": 1,
  "nombre": "Bulbasaur",
  "altura": 0.70,
  "peso": 6.90,
  "descripcion": "Bulbasaur es un Pokémon cuadrúpedo...",
  "imagenUrl": "/api/pokemon/1/imagen",
  "generacion": 1,
  "tipos": ["Planta", "Veneno"],
  "estadisticas": {},
  "evoluciones": []
}
```

**Errores:**
- `404 Not Found` - Pokémon no existe

---

### 2.3 Obtener Pokémon por Número de Pokédex:

**GET** `/pokemon/numero/{numero}`

Obtiene un Pokémon por su número de Pokédex.

**Autenticación:** No requerida (público)

**Request:**
```http
GET http://localhost:8080/api/pokemon/numero/25
```

**Response (200 OK):**
```json
{
  "id": 7,
  "numero": 25,
  "nombre": "Pikachu",
  "imagenUrl": "/api/pokemon/7/imagen"
}
```

**Errores:**
- `404 Not Found` - No existe Pokémon con ese número

---

### 2.4 Buscar Pokémon por Nombre:

**GET** `/pokemon/buscar?nombre={nombre}`

Busca Pokémon cuyo nombre contenga el texto especificado (case-insensitive).

**Autenticación:** No requerida (público)

**Request:**
```http
GET http://localhost:8080/api/pokemon/buscar?nombre=char
```

**Response (200 OK):**
```json
[
  {
    "id": 4,
    "numero": 4,
    "nombre": "Charmander"
  },
  {
    "id": 5,
    "numero": 5,
    "nombre": "Charmeleon"
  }
]
```

---

### 2.5 Filtrar por Generación:

**GET** `/pokemon/generacion/{generacion}`

Obtiene todos los Pokémon de una generación específica.

**Autenticación:** No requerida (público)

**Request:**
```http
GET http://localhost:8080/api/pokemon/generacion/1
```

**Response (200 OK):**
```json
[
  { "numero": 1, "nombre": "Bulbasaur" },
  { "numero": 2, "nombre": "Ivysaur" }
]
```

---

### 2.6 Filtrar por Tipo:

**GET** `/pokemon/tipo/{tipo}`

Obtiene todos los Pokémon de un tipo específico.

**Autenticación:** No requerida (público)

**Request:**
```http
GET http://localhost:8080/api/pokemon/tipo/Fuego
```

**Response (200 OK):**
```json
[
  {
    "id": 4,
    "numero": 4,
    "nombre": "Charmander",
    "tipos": ["Fuego"]
  },
  {
    "id": 5,
    "numero": 5,
    "nombre": "Charmeleon",
    "tipos": ["Fuego"]
  }
]
```

---

### 2.7 Crear Nuevo Pokémon:

**POST** `/pokemon`

Crea un nuevo Pokémon en la base de datos.

**Autenticación:** Requiere token (USER o ADMIN)

**Request:**
```http
POST http://localhost:8080/api/pokemon
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
  "numero": 25,
  "nombre": "Pikachu",
  "altura": 0.40,
  "peso": 6.00,
  "descripcion": "Cuando varios de estos Pokémon se juntan, su electricidad puede causar tormentas de rayos.",
  "generacion": 1,
  "tipos": ["Eléctrico"],
  "estadisticas": {
    "ps": 35,
    "ataque": 55,
    "defensa": 40,
    "velocidad": 90,
    "ataqueEspecial": 50,
    "defensaEspecial": 50
  }
}
```

**Response (201 Created):**
```json
{
  "id": 7,
  "numero": 25,
  "nombre": "Pikachu",
  "altura": 0.40,
  "peso": 6.00,
  "descripcion": "Cuando varios de estos Pokémon se juntan...",
  "imagenUrl": null,
  "generacion": 1,
  "tipos": ["Eléctrico"],
  "estadisticas": {
    "id": 9,
    "ps": 35,
    "ataque": 55,
    "defensa": 40,
    "velocidad": 90,
    "ataqueEspecial": 50,
    "defensaEspecial": 50,
    "total": 320
  },
  "evoluciones": []
}
```

**Validaciones:**
- ❌ Número no duplicado
- ✅ Al menos 1 tipo, máximo 2
- ✅ Tipos deben existir
- ✅ Generación entre 1-9
- ✅ Estadísticas entre 1-255

**Errores:**
- `403 Forbidden` - Sin autenticación o token inválido
- `400 Bad Request` - Validación fallida
    - "Ya existe un Pokémon con el número X"
    - "El Pokémon debe tener al menos un tipo"
    - "El Pokémon no puede tener más de 2 tipos"
    - "El tipo 'X' no existe"
    - "La generación debe estar entre 1 y 9"
    - "Los PS deben estar entre 1 y 255"

---

### 2.8 Actualizar Pokémon:

**PUT** `/pokemon/{id}`

Actualiza un Pokémon existente. Solo incluir campos a modificar.

**Autenticación:** Requiere token (USER o ADMIN)

**Request:**
```http
PUT http://localhost:8080/api/pokemon/6
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
  "numero": 6,
  "peso": 91.50,
  "descripcion": "Descripción actualizada de Charizard"
}
```

**Response (200 OK):**
```json
{
  "id": 6,
  "numero": 6,
  "nombre": "Charizard",
  "altura": 1.70,
  "peso": 91.50,
  "descripcion": "Descripción actualizada de Charizard"
}
```

**Campos actualizables:**
- `numero` (validar único)
- `nombre`
- `altura`
- `peso`
- `descripcion`
- `generacion`
- `tipos` (reemplaza todos)
- `estadisticas` (actualiza o crea)

**Validaciones:**
- Mismas validaciones que POST
- Número único (si cambió)

**Errores:**
- `403 Forbidden` - Sin autenticación
- `400 Bad Request` - Validación fallida
- `404 Not Found` - Pokémon no existe

---

### 2.9 Eliminar Pokémon:

**DELETE** `/pokemon/{id}`

Elimina un Pokémon y todos sus datos relacionados.

**Autenticación:** Requiere token ADMIN (solo administradores)

**Request:**
```http
DELETE http://localhost:8080/api/pokemon/6
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response (200 OK):**
```
Pokémon eliminado exitosamente
```

**Eliminación en cascada:**
- ✅ Estadísticas
- ✅ Relaciones de tipos
- ✅ Evoluciones (origen y destino)
- ✅ Imagen (si tiene)

**Errores:**
- `403 Forbidden` - Sin autenticación o no es ADMIN
- `400 Bad Request` - "Pokemon no encontrado con id: X"

---

### 2.10 Crear Evolución:

**POST** `/pokemon/{origenId}/evolucion`

Crea una relación de evolución entre dos Pokémon.

**Autenticación:** Requiere token (USER o ADMIN)

**Request:**
```http
POST http://localhost:8080/api/pokemon/5/evolucion
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
  "destinoId": 6,
  "nivel": 36,
  "metodo": "Nivel"
}
```

**Parámetros:**
- `origenId` (URL): ID del Pokémon que evoluciona
- `destinoId` (Body): ID del Pokémon resultante
- `nivel` (Body): Nivel de evolución
- `metodo` (Body): Método ("Nivel", "Piedra", "Intercambio", etc.)

**Response (201 Created):**
```
Evolución creada exitosamente
```

**Validaciones:**
- ❌ No auto-evolución (origen ≠ destino)
- ✅ Ambos Pokémon deben existir

**Errores:**
- `403 Forbidden` - Sin autenticación
- `400 Bad Request`
    - "Un Pokémon no puede evolucionar a sí mismo"
    - "Pokémon origen no existe"
    - "Pokémon destino no existe"

---

## 3. ENDPOINTS DE TIPOS.

### 3.1 Listar Todos los Tipos:

**GET** `/tipos`

Obtiene la lista de los 18 tipos de Pokémon.

**Autenticación:** No requerida (público)

**Request:**
```http
GET http://localhost:8080/api/tipos
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Normal",
    "icono": "⚪",
    "color": "#A8A878"
  },
  {
    "id": 2,
    "nombre": "Fuego",
    "icono": "🔥",
    "color": "#F08030"
  }
]
```

---

### 3.2 Obtener Tipo por ID:

**GET** `/tipos/{id}`

Obtiene un tipo específico por su ID.

**Autenticación:** No requerida (público)

**Request:**
```http
GET http://localhost:8080/api/tipos/2
```

**Response (200 OK):**
```json
{
  "id": 2,
  "nombre": "Fuego",
  "icono": "🔥",
  "color": "#F08030"
}
```

**Errores:**
- `404 Not Found` - Tipo no existe

---

### 3.3 Obtener Tipo por Nombre

**GET** `/tipos/nombre/{nombre}`

Obtiene un tipo por su nombre.

**Autenticación:** No requerida (público)

**Request:**
```http
GET http://localhost:8080/api/tipos/nombre/Fuego
```

**Response (200 OK):**
```json
{
  "id": 2,
  "nombre": "Fuego",
  "icono": "🔥",
  "color": "#F08030"
}
```

**Errores:**
- `404 Not Found` - "Tipo no encontrado: X"

---

## 4. ENDPOINTS DE IMÁGENES.

### Tabla de Permisos:

| Método | Endpoint | Público | USER | ADMIN |
|--------|----------|---------|------|-------|
| GET | /api/pokemon/{id}/imagen | ✅ | ✅ | ✅ |
| POST | /api/pokemon/{id}/imagen | ❌ | ✅ | ✅ |
| DELETE | /api/pokemon/{id}/imagen | ❌ | ❌ | ✅ |

---

### 4.1 Subir Imagen de Pokémon:

**POST** `/pokemon/{id}/imagen`

Sube una imagen para un Pokémon específico.

**Autenticación:** Requiere token (USER o ADMIN)

**Request:**
```http
POST http://localhost:8080/api/pokemon/7/imagen
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: multipart/form-data

file: [archivo de imagen]
```

**Parámetros:**
| Nombre | Tipo | Descripción |
|--------|------|-------------|
| file | File | Imagen PNG, JPG, JPEG o GIF. Máximo 5MB |

**Response (200 OK):**
```
Imagen subida exitosamente: pokemon_7.png
```

**Validaciones:**
- ✅ Solo imágenes (PNG, JPG, JPEG, GIF)
- ✅ Tamaño máximo 5MB
- ✅ El Pokémon debe existir

**Errores:**
- `403 Forbidden` - Sin autenticación
- `400 Bad Request` - "El archivo está vacío"
- `400 Bad Request` - "El archivo debe ser una imagen (PNG, JPG, JPEG, GIF)"
- `400 Bad Request` - "Solo se permiten archivos JPG, JPEG, PNG o GIF"
- `400 Bad Request` - "Pokemon no encontrado con id: X"
- `413 Payload Too Large` - Archivo mayor a 5MB

**Nota:** Si el Pokémon ya tiene imagen, se reemplaza automáticamente.

---

### 4.2 Ver/Descargar Imagen de Pokémon:

**GET** `/pokemon/{id}/imagen`

Obtiene la imagen de un Pokémon.

**Autenticación:** No requerida (público)

**Request:**
```http
GET http://localhost:8080/api/pokemon/7/imagen
```

**Response (200 OK):**
```
Content-Type: image/png
[imagen binaria]
```

**Uso en navegador:**
```
http://localhost:8080/api/pokemon/7/imagen
→ Se muestra la imagen directamente
```

**Uso en HTML:**
```html
<img src="http://localhost:8080/api/pokemon/7/imagen" alt="Squirtle">
```

**Errores:**
- `404 Not Found` - "El Pokémon no tiene imagen"

---

### 4.3 Eliminar Imagen de Pokémon:

**DELETE** `/pokemon/{id}/imagen`

Elimina la imagen de un Pokémon.

**Autenticación:** Requiere token ADMIN (solo administradores)

**Request:**
```http
DELETE http://localhost:8080/api/pokemon/7/imagen
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response (200 OK):**
```
Imagen eliminada exitosamente
```

**Errores:**
- `403 Forbidden` - Sin autenticación o no es ADMIN
- `404 Not Found` - "El Pokémon no tiene imagen"

---

## 5. CÓDIGOS DE ESTADO HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | GET exitoso, PUT exitoso, DELETE exitoso |
| 201 | Created | POST exitoso (recurso creado) |
| 400 | Bad Request | Validación fallida, datos inválidos |
| 401 | Unauthorized | Credenciales incorrectas (login) |
| 403 | Forbidden | Sin permisos (token inválido, expirado, rol insuficiente) |
| 404 | Not Found | Recurso no encontrado |
| 413 | Payload Too Large | Archivo muy grande (>5MB) |
| 500 | Internal Server Error | Error del servidor |

---

## 6. EJEMPLOS DE USO

### 6.1 Ejemplo Completo: Flujo con Autenticación

**1. Registrar usuario:**
```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "pablo",
  "password": "password123",
  "email": "pablo@pokedex.com"
}
```
→ Retorna 201 Created + token

**2. Guardar el token:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "USER"
}
```

**3. Crear Pikachu (con token):**
```http
POST http://localhost:8080/api/pokemon
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
  "numero": 25,
  "nombre": "Pikachu",
  "altura": 0.40,
  "peso": 6.00,
  "descripcion": "Cuando varios de estos Pokémon se juntan...",
  "generacion": 1,
  "tipos": ["Eléctrico"],
  "estadisticas": {
    "ps": 35,
    "ataque": 55,
    "defensa": 40,
    "velocidad": 90,
    "ataqueEspecial": 50,
    "defensaEspecial": 50
  }
}
```
→ Retorna 201 Created

**4. Subir imagen de Pikachu:**
```http
POST http://localhost:8080/api/pokemon/8/imagen
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: multipart/form-data

file: pikachu.png
```
→ Retorna 200 OK

**5. Ver Pikachu con imagen:**
```http
GET http://localhost:8080/api/pokemon/8
```
→ Retorna Pikachu con `"imagenUrl": "/api/pokemon/8/imagen"`

**6. Intentar eliminar (siendo USER):**
```http
DELETE http://localhost:8080/api/pokemon/8
Authorization: Bearer TOKEN_USER
```
→ Retorna 403 Forbidden (solo ADMIN puede eliminar)

**7. Convertir a ADMIN (en MySQL):**
```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'pablo';
```

**8. Login de nuevo (para obtener token ADMIN):**
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "pablo",
  "password": "password123"
}
```
→ Retorna token con role: "ADMIN"

**9. Ahora sí eliminar (siendo ADMIN):**
```http
DELETE http://localhost:8080/api/pokemon/8
Authorization: Bearer TOKEN_ADMIN
```
→ Retorna 200 OK

---

### 6.2 Ejemplo: Validaciones de Error

**Error 1: POST sin autenticación**
```http
POST http://localhost:8080/api/pokemon
Content-Type: application/json

{
  "numero": 150,
  "nombre": "Mewtwo",
  ...
}
```
→ 403 Forbidden

**Error 2: Número duplicado**
```http
POST http://localhost:8080/api/pokemon
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "numero": 1,
  "nombre": "Bulbasaur Falso",
  ...
}
```
→ 400 Bad Request: "Ya existe un Pokémon con el número 1"

**Error 3: Sin tipos**
```http
POST http://localhost:8080/api/pokemon
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "numero": 999,
  "nombre": "Pokemon Sin Tipo",
  "tipos": []
}
```
→ 400 Bad Request: "El Pokémon debe tener al menos un tipo"

**Error 4: Stats inválidas**
```http
POST http://localhost:8080/api/pokemon
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "numero": 998,
  "nombre": "Pokemon Hackeado",
  "estadisticas": {
    "ps": 999,
    ...
  }
}
```
→ 400 Bad Request: "Los PS deben estar entre 1 y 255"

**Error 5: Subir archivo no-imagen**
```http
POST http://localhost:8080/api/pokemon/7/imagen
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

file: documento.pdf
```
→ 400 Bad Request: "El archivo debe ser una imagen (PNG, JPG, JPEG, GIF)"

**Error 6: DELETE con USER (no ADMIN)**
```http
DELETE http://localhost:8080/api/pokemon/7
Authorization: Bearer TOKEN_USER
```
→ 403 Forbidden

---

## 7. MANEJO DE ERRORES

### 7.1 Formato de Respuestas de Error

**Errores de autenticación (401/403):**
```
403 Forbidden (sin body detallado)
```

**Errores de validación (400):**
```
String con mensaje descriptivo
```

Ejemplo:
```
Ya existe un Pokémon con el número 6
```

**Errores de no encontrado (404):**
```
Not Found (sin body)
```

### 7.2 Mensajes de Error Comunes

| Error | Código | Mensaje |
|-------|--------|---------|
| Sin autenticación | 403 | Forbidden |
| Token expirado | 403 | Forbidden |
| Rol insuficiente | 403 | Forbidden |
| Credenciales incorrectas | 401 | "Usuario o contraseña incorrectos" |
| Username duplicado | 400 | "El username ya está en uso" |
| Email duplicado | 400 | "El email ya está en uso" |
| Número duplicado | 400 | "Ya existe un Pokémon con el número X" |
| Sin tipos | 400 | "El Pokémon debe tener al menos un tipo" |
| Demasiados tipos | 400 | "El Pokémon no puede tener más de 2 tipos" |
| Tipo inválido | 400 | "El tipo 'X' no existe" |
| Generación inválida | 400 | "La generación debe estar entre 1 y 9" |
| Stats inválidas | 400 | "Los PS deben estar entre 1 y 255" |
| Auto-evolución | 400 | "Un Pokémon no puede evolucionar a sí mismo" |
| Pokémon no existe | 400/404 | "Pokemon no encontrado con id: X" |
| Tipo no existe | 404 | "Tipo no encontrado: X" |
| Archivo no es imagen | 400 | "El archivo debe ser una imagen" |
| Archivo muy grande | 413 | Payload Too Large |
| Sin imagen | 404 | "El Pokémon no tiene imagen" |

---

## 📝 NOTAS IMPORTANTES

1. **JWT Token expira en 24 horas** - Hacer login de nuevo para renovar
2. **CORS está habilitado** para todos los orígenes (`*`) - cambiar en producción
3. **Todas las respuestas exitosas son JSON** excepto mensajes simples e imágenes
4. **Las validaciones se ejecutan antes de guardar** en la base de datos
5. **La eliminación es en cascada automática** (stats, tipos, evoluciones, imagen)
6. **Los IDs son auto-incrementales** y no se reutilizan
7. **Las imágenes se guardan en** `uploads/pokemon/` con nombre `pokemon_{id}.{ext}`
8. **Tamaño máximo de imagen:** 5 MB
9. **Formatos de imagen permitidos:** PNG, JPG, JPEG, GIF

---

## 🧪 HERRAMIENTAS PARA PROBAR

- **Navegador:** Para tests GET simples y ver imágenes
- **Postman:** Cliente REST completo con soporte Multipart
- **Insomnia:** Cliente REST alternativo
- **cURL:** Línea de comandos

---

## 📚 RECURSOS ADICIONALES

- **Código fuente:** [GitHub](https://github.com/pablitoclavito04/Pokedex)
- **Documentación técnica:** `DOCUMENTACION.md`
- **Documentación de seguridad:** `DOCUMENTACION_SEGURIDAD.md`
- **Documentación de archivos:** `DOCUMENTACION_ARCHIVOS.md`
- **Resultados de pruebas:** `RESULTADOS_PRUEBAS_ENTREGA3.md`

---

**Autor:** Pablo
**Última actualización:** Diciembre 2024