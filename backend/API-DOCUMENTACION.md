# 📖 API REST Pokédex - Documentación de Endpoints.

**Base URL:** `http://localhost:8080/api/pokemon`
**Formato de respuesta:** JSON

---

## 📑 ÍNDICE

1. [Endpoints de Pokemon](#1-endpoints-de-pokemon)
2. [Endpoints de Tipos](#2-endpoints-de-tipos)
3. [Códigos de Estado HTTP](#3-códigos-de-estado-http)
4. [Ejemplos de Uso](#4-ejemplos-de-uso)
5. [Manejo de Errores](#5-manejo-de-errores)

---

## 1. ENDPOINTS DE POKEMON.

### 1.1 Listar Todos los Pokémon:

**GET** `/pokemon`

Obtiene la lista completa de Pokémon ordenados por número de Pokédex.

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

### 1.2 Obtener Pokémon por ID:

**GET** `/pokemon/{id}`

Obtiene un Pokémon específico por su ID.

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
  "generacion": 1,
  "tipos": ["Planta", "Veneno"],
  "estadisticas": {},
  "evoluciones": []
}
```

**Errores:**
- `404 Not Found` - Pokémon no existe

---

### 1.3 Obtener Pokémon por Número de Pokédex:

**GET** `/pokemon/numero/{numero}`

Obtiene un Pokémon por su número de Pokédex.

**Request:**
```http
GET http://localhost:8080/api/pokemon/numero/25
```

**Response (200 OK):**
```json
{
  "id": 7,
  "numero": 25,
  "nombre": "Pikachu"
}
```

**Errores:**
- `404 Not Found` - No existe Pokémon con ese número

---

### 1.4 Buscar Pokémon por Nombre:

**GET** `/pokemon/buscar?nombre={nombre}`

Busca Pokémon cuyo nombre contenga el texto especificado (case-insensitive).

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

### 1.5 Filtrar por Generación:

**GET** `/pokemon/generacion/{generacion}`

Obtiene todos los Pokémon de una generación específica.

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

### 1.6 Filtrar por Tipo:

**GET** `/pokemon/tipo/{tipo}`

Obtiene todos los Pokémon de un tipo específico.

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

### 1.7 Crear Nuevo Pokémon:

**POST** `/pokemon`

Crea un nuevo Pokémon en la base de datos.

**Request:**
```http
POST http://localhost:8080/api/pokemon
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
- `400 Bad Request` - Validación fallida
    - "Ya existe un Pokémon con el número X"
    - "El Pokémon debe tener al menos un tipo"
    - "El Pokémon no puede tener más de 2 tipos"
    - "El tipo 'X' no existe"
    - "La generación debe estar entre 1 y 9"
    - "Los PS deben estar entre 1 y 255"

---

### 1.8 Actualizar Pokémon:

**PUT** `/pokemon/{id}`

Actualiza un Pokémon existente. Solo incluir campos a modificar.

**Request:**
```http
PUT http://localhost:8080/api/pokemon/6
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
- `400 Bad Request` - Validación fallida
- `404 Not Found` - Pokémon no existe

---

### 1.9 Eliminar Pokémon:

**DELETE** `/pokemon/{id}`

Elimina un Pokémon y todos sus datos relacionados.

**Request:**
```http
DELETE http://localhost:8080/api/pokemon/6
```

**Response (200 OK):**
```
Pokémon eliminado exitosamente
```

**Eliminación en cascada:**
- ✅ Estadísticas
- ✅ Relaciones de tipos
- ✅ Evoluciones (origen y destino)

**Errores:**
- `400 Bad Request` - "Pokemon no encontrado con id: X"

---

### 1.10 Crear Evolución:

**POST** `/pokemon/{origenId}/evolucion`

Crea una relación de evolución entre dos Pokémon.

**Request:**
```http
POST http://localhost:8080/api/pokemon/5/evolucion
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
- `400 Bad Request`
    - "Un Pokémon no puede evolucionar a sí mismo"
    - "Pokémon origen no existe"
    - "Pokémon destino no existe"

---

## 2. ENDPOINTS DE TIPOS.

### 2.1 Listar Todos los Tipos:

**GET** `/tipos`

Obtiene la lista de los 18 tipos de Pokémon.

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

### 2.2 Obtener Tipo por ID:

**GET** `/tipos/{id}`

Obtiene un tipo específico por su ID.

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

### 2.3 Obtener Tipo por Nombre

**GET** `/tipos/nombre/{nombre}`

Obtiene un tipo por su nombre.

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

## 3. CÓDIGOS DE ESTADO HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | GET exitoso, PUT exitoso, DELETE exitoso |
| 201 | Created | POST exitoso (recurso creado) |
| 400 | Bad Request | Validación fallida, datos inválidos |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

---

## 4. EJEMPLOS DE USO

### 4.1 Ejemplo Completo: Crear Charizard

**1. Verificar que no existe:**
```http
GET http://localhost:8080/api/pokemon/numero/6
```
→ Debería dar 404

**2. Crear Charizard:**
```http
POST http://localhost:8080/api/pokemon
Content-Type: application/json

{
  "numero": 6,
  "nombre": "Charizard",
  "altura": 1.70,
  "peso": 90.50,
  "descripcion": "Escupe fuego que es tan caliente que puede derretir rocas.",
  "generacion": 1,
  "tipos": ["Fuego", "Volador"],
  "estadisticas": {
    "ps": 78,
    "ataque": 84,
    "defensa": 78,
    "velocidad": 100,
    "ataqueEspecial": 109,
    "defensaEspecial": 85
  }
}
```
→ Retorna 201 Created

**3. Verificar creación:**
```http
GET http://localhost:8080/api/pokemon/6
```
→ Retorna Charizard completo

**4. Actualizar peso:**
```http
PUT http://localhost:8080/api/pokemon/6
Content-Type: application/json

{
  "numero": 6,
  "peso": 91.50
}
```
→ Retorna 200 OK

**5. Crear evolución Charmeleon → Charizard:**
```http
POST http://localhost:8080/api/pokemon/5/evolucion
Content-Type: application/json

{
  "destinoId": 6,
  "nivel": 36,
  "metodo": "Nivel"
}
```
→ Retorna 201 Created

**6. Ver Charmeleon con evolución:**
```http
GET http://localhost:8080/api/pokemon/5
```
→ Incluye evolución a Charizard

**7. Eliminar Charizard:**
```http
DELETE http://localhost:8080/api/pokemon/6
```
→ Retorna 200 OK

**8. Verificar eliminación:**
```http
GET http://localhost:8080/api/pokemon/6
```
→ Retorna 404 Not Found

---

### 4.2 Ejemplo: Validaciones de Error

**Error 1: Número duplicado**
```http
POST http://localhost:8080/api/pokemon
Content-Type: application/json

{
  "numero": 1,
  "nombre": "Bulbasaur Falso",
  ...
}
```
→ 400 Bad Request: "Ya existe un Pokémon con el número 1"

**Error 2: Sin tipos**
```http
POST http://localhost:8080/api/pokemon
Content-Type: application/json

{
  "numero": 999,
  "nombre": "Pokemon Sin Tipo",
  "tipos": []
}
```
→ 400 Bad Request: "El Pokémon debe tener al menos un tipo"

**Error 3: Stats inválidas**
```http
POST http://localhost:8080/api/pokemon
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

**Error 4: Auto-evolución**
```http
POST http://localhost:8080/api/pokemon/1/evolucion
Content-Type: application/json

{
  "destinoId": 1,
  "nivel": 16,
  "metodo": "Nivel"
}
```
→ 400 Bad Request: "Un Pokémon no puede evolucionar a sí mismo"

---

## 5. MANEJO DE ERRORES

### 5.1 Formato de Respuestas de Error

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

### 5.2 Mensajes de Error Comunes

| Error | Código | Mensaje |
|-------|--------|---------|
| Número duplicado | 400 | "Ya existe un Pokémon con el número X" |
| Sin tipos | 400 | "El Pokémon debe tener al menos un tipo" |
| Demasiados tipos | 400 | "El Pokémon no puede tener más de 2 tipos" |
| Tipo inválido | 400 | "El tipo 'X' no existe" |
| Generación inválida | 400 | "La generación debe estar entre 1 y 9" |
| Stats inválidas | 400 | "Los PS deben estar entre 1 y 255" |
| Auto-evolución | 400 | "Un Pokémon no puede evolucionar a sí mismo" |
| Pokémon no existe | 400/404 | "Pokemon no encontrado con id: X" |
| Tipo no existe | 404 | "Tipo no encontrado: X" |

---

## 📝 NOTAS IMPORTANTES

1. **CORS está habilitado** para todos los orígenes (`*`) - cambiar en producción
2. **Todas las respuestas exitosas son JSON** excepto mensajes simples
3. **Las validaciones se ejecutan antes de guardar** en la base de datos
4. **La eliminación es en cascada automática**
5. **Los IDs son auto-incrementales** y no se reutilizan

---

## 🧪 HERRAMIENTAS PARA PROBAR

- **Navegador:** Para tests GET simples
- **Postman:** Cliente REST completo
- **Insomnia:** Cliente REST alternativo
- **cURL:** Línea de comandos

---

## 📚 RECURSOS ADICIONALES

- **Código fuente:** [GitHub](https://github.com/pablitoclavito04/Pokedex)
- **Documentación técnica:** `DOCUMENTACION.md`
- **Resultados de pruebas:** `Pruebas/RESULTADOS_PRUEBAS.md`

---
 
**Autor:** Pablo