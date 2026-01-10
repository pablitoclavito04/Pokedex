# Documentación de archivos - Sistema de imágenes.

---

## ÍNDICE.

1. [¿Qué es el Upload de Archivos?](#1-qué-es-el-upload-de-archivos)
2. [¿Para qué sirve en el proyecto?](#2-para-qué-sirve-en-el-proyecto)
3. [Arquitectura del Sistema](#3-arquitectura-del-sistema)
4. [Endpoints de Archivos](#4-endpoints-de-archivos)
5. [Validaciones Implementadas](#5-validaciones-implementadas)
6. [Clases Implementadas](#6-clases-implementadas)
7. [Cómo Usar el Sistema](#8-cómo-usar-el-sistema)
8. [Ejemplos Prácticos](#9-ejemplos-prácticos)
9. [Integración con Frontend](#10-integración-con-frontend)

---

## 1. ¿QUÉ ES EL UPLOAD DE ARCHIVOS?

### Definición:

El **upload de archivos** es la capacidad de enviar archivos (imágenes, documentos, etc.) desde un cliente (navegador, app móvil) hacia el servidor para almacenarlos.

### Analogía simple:

Es como **adjuntar una foto en WhatsApp**:
1. Seleccionas la foto de tu galería
2. La envías
3. Se guarda en los servidores de WhatsApp
4. Cualquiera puede verla después

En nuestra Pokédex:
1. Seleccionas una imagen de Squirtle
2. La envías al servidor
3. Se guarda en la carpeta `uploads/pokemon/`
4. Cualquiera puede verla en `/api/pokemon/7/imagen`

---

## 2. ¿PARA QUÉ SIRVE EN EL PROYECTO?

### Antes (Solo texto):

```json
{
  "id": 7,
  "numero": 7,
  "nombre": "Squirtle",
  "tipos": ["Agua"],
  "estadisticas": {}
}
```

**Resultado:** Una Pokédex aburrida, solo con texto.

### Después (Con imágenes):

```json
{
  "id": 7,
  "numero": 7,
  "nombre": "Squirtle",
  "imagenUrl": "/api/pokemon/7/imagen",  
  "tipos": ["Agua"],
  "estadisticas": {}
}
```

**Resultado:** Una Pokédex visual con las fotos de cada Pokémon.


---

## 3. ARQUITECTURA DEL SISTEMA.

### Flujo de upload:

```
┌──────────────┐      ┌────────────────┐      ┌─────────────────┐
│   CLIENTE    │      │   SERVIDOR     │      │  SISTEMA DE     │
│  (Insomnia)  │      │  (Spring Boot) │      │  ARCHIVOS       │
└──────┬───────┘      └───────┬────────┘      └────────┬────────┘
       │                      │                        │
       │  POST /pokemon/7/imagen                       │
       │  + archivo squirtle.png                       │
       │─────────────────────>│                        │
       │                      │                        │
       │                      │  Validar archivo       │
       │                      │  (tipo, tamaño)        │
       │                      │                        │
       │                      │  Guardar archivo       │
       │                      │───────────────────────>│
       │                      │                        │
       │                      │  Actualizar Pokemon    │
       │                      │  (imagenUrl)           │
       │                      │                        │
       │  200 OK              │                        │
       │  "Imagen subida"     │                        │
       │<─────────────────────│                        │
       │                      │                        │
```

### Flujo de descarga:

```
┌──────────────┐      ┌────────────────┐      ┌─────────────────┐
│   CLIENTE    │      │   SERVIDOR     │      │  SISTEMA DE     │
│ (Navegador)  │      │  (Spring Boot) │      │  ARCHIVOS       │
└──────┬───────┘      └───────┬────────┘      └────────┬────────┘
       │                      │                        │
       │ GET /pokemon/7/imagen│                        │
       │─────────────────────>│                        │
       │                      │                        │
       │                      │  Buscar archivo        │
       │                      │───────────────────────>│
       │                      │                        │
       │                      │  pokemon_7.png         │
       │                      │<───────────────────────│
       │                      │                        │
       │  200 OK              │                        │
       │  [imagen binaria]    │                        │
       │<─────────────────────│                        │
       │                      │                        │
       │   Mostrar imagen     │                        │
       │                      │                        │
```

---

## 4. ENDPOINTS DE ARCHIVOS.

### POST /api/pokemon/{id}/imagen

**Descripción:** Subir imagen de un Pokémon

**Autenticación:** Requiere token (USER o ADMIN)

**Request:**
```http
POST http://localhost:8080/api/pokemon/7/imagen
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

file: [archivo de imagen]
```

**Response (200 OK):**
```
Imagen subida exitosamente: pokemon_7.png
```

**Errores:**
- 403 Forbidden: Sin autenticación
- 400 Bad Request: Archivo no es imagen
- 400 Bad Request: Pokémon no existe

---

### GET /api/pokemon/{id}/imagen

**Descripción:** Ver/descargar imagen de un Pokémon

**Autenticación:** No requiere (público)

**Request:**
```http
GET http://localhost:8080/api/pokemon/7/imagen
```

**Response:**
- 200 OK: Imagen binaria (se muestra en navegador)
- 404 Not Found: Pokémon no tiene imagen

**Uso en navegador:**
```
http://localhost:8080/api/pokemon/7/imagen
→ Muestra la imagen directamente
```

---

### DELETE /api/pokemon/{id}/imagen

**Descripción:** Eliminar imagen de un Pokémon

**Autenticación:** Requiere token ADMIN

**Request:**
```http
DELETE http://localhost:8080/api/pokemon/7/imagen
Authorization: Bearer TOKEN_ADMIN
```

**Response (200 OK):**
```
Imagen eliminada exitosamente
```

---

## 5. VALIDACIONES IMPLEMENTADAS.

### Validaciones de Seguridad

| Validación | Descripción | Respuesta si falla |
|------------|-------------|-------------------|
| **Autenticación** | POST requiere login | 403 Forbidden |
| **Autorización** | DELETE solo ADMIN | 403 Forbidden |
| **Pokémon existe** | ID debe existir | 400 Bad Request |

### Validaciones de Archivo

| Validación | Descripción | Respuesta si falla |
|------------|-------------|-------------------|
| **Tipo de archivo** | Solo imágenes | 400 "Debe ser imagen" |
| **Extensión** | .png, .jpg, .jpeg, .gif | 400 "Solo JPG, PNG, GIF" |
| **Tamaño máximo** | 5 MB | 413 Payload Too Large |
| **Archivo vacío** | No puede estar vacío | 400 "Archivo vacío" |
| **Path traversal** | Nombres maliciosos | 400 "Nombre inválido" |

### Ejemplo de Validación

```
// Validar que sea imagen
if (!contentType.startsWith("image/")) {
    throw new RuntimeException("El archivo debe ser una imagen");
}

// Validar extensión
if (!extension.matches("\\.(jpg|jpeg|png|gif)$")) {
    throw new RuntimeException("Solo se permiten JPG, PNG o GIF");
}


```
---

## 6. CLASES IMPLEMENTADAS.

### Descripción de Cada Clase

| Clase | Responsabilidad |
|-------|-----------------|
| **FileStorageProperties** | Configuración del directorio de uploads |
| **FileStorageService** | Guardar, cargar y eliminar archivos |
| **FileController** | Endpoints POST/GET/DELETE de imágenes |
| **Pokemon (actualizado)** | Nuevo campo `imagenUrl` |
| **PokemonDTO (actualizado)** | Nuevo campo `imagenUrl` |
| **PokemonService (actualizado)** | Método `actualizarImagenUrl()` |

---


## 7. CÓMO USAR EL SISTEMA.

### Subir una imagen

**Paso 1:** Tener una imagen del Pokémon (ej: `squirtle.png`)

**Paso 2:** Obtener token de autenticación

**Paso 3:** Hacer POST con Multipart Form

```
POST /api/pokemon/7/imagen
Headers:
  Authorization: Bearer TOKEN
Body (Multipart Form):
  file: squirtle.png
```

**Paso 4:** Verificar respuesta
```
200 OK: "Imagen subida exitosamente: pokemon_7.png"
```

### Ver la imagen

**Opción 1: Navegador**
```
http://localhost:8080/api/pokemon/7/imagen
```

**Opción 2: En el JSON del Pokémon**
```json
{
  "id": 7,
  "nombre": "Squirtle",
  "imagenUrl": "/api/pokemon/7/imagen"
}
```

### Eliminar imagen (solo ADMIN)

```
DELETE /api/pokemon/7/imagen
Headers:
  Authorization: Bearer TOKEN_ADMIN
```

---

## 8. EJEMPLOS PRÁCTICOS.

### Ejemplo 1: Subir imagen de Pikachu

```http
POST http://localhost:8080/api/pokemon/25/imagen
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: multipart/form-data

file: pikachu.png
```

**Respuesta:**
```
Imagen subida exitosamente: pokemon_25.png
```

### Ejemplo 2: Ver imagen en HTML

```html
<img src="http://localhost:8080/api/pokemon/25/imagen" alt="Pikachu">
```

### Ejemplo 3: Error - archivo no es imagen

```http
POST http://localhost:8080/api/pokemon/7/imagen
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

file: documento.pdf
```

**Respuesta:**
```
400 Bad Request
"El archivo debe ser una imagen (PNG, JPG, JPEG, GIF)"
```

### Ejemplo 4: Error - sin autenticación

```http
POST http://localhost:8080/api/pokemon/7/imagen
(sin header Authorization)
Content-Type: multipart/form-data

file: squirtle.png
```

**Respuesta:**
```
403 Forbidden
```

---

## 9. INTEGRACIÓN CON FRONTEND.

### Uso en React

```jsx
function PokemonCard({ pokemon }) {
  return (
    <div className="pokemon-card">
      <img 
        src={`http://localhost:8080${pokemon.imagenUrl}`}
        alt={pokemon.nombre}
        onError={(e) => e.target.src = '/placeholder.png'}
      />
      <h3>{pokemon.nombre}</h3>
      <p>#{pokemon.numero}</p>
    </div>
  );
}
```

### Uso en Angular

```typescript
@Component({
  template: `
    <div class="pokemon-card">
      <img [src]="getImageUrl(pokemon)" [alt]="pokemon.nombre">
      <h3>{{ pokemon.nombre }}</h3>
    </div>
  `
})
export class PokemonCardComponent {
  getImageUrl(pokemon: Pokemon): string {
    return pokemon.imagenUrl 
      ? `http://localhost:8080${pokemon.imagenUrl}`
      : '/assets/placeholder.png';
  }
}
```

### Formulario de Upload (React)

```jsx
function UploadImageForm({ pokemonId, token }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    await fetch(`http://localhost:8080/api/pokemon/${pokemonId}/imagen`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
  };
  
  return <input type="file" onChange={handleUpload} accept="image/*" />;
}
```

---

## RESUMEN.

| Concepto | Descripción |
|----------|-------------|
| **Upload** | Subir archivos al servidor |
| **Multipart** | Formato para enviar archivos por HTTP |
| **imagenUrl** | Campo que guarda la ruta de la imagen |
| **Carpeta uploads** | Donde se guardan físicamente las imágenes |
| **Validaciones** | Tipo, tamaño, extensión de archivos |
