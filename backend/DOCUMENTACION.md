# Pokédex Backend.

---

## ÍNDICE

1. [Introducción](#1-introducción)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Base de Datos](#3-base-de-datos)
4. [Entidades JPA](#4-entidades-jpa)
5. [DTOs](#5-dtos)
6. [Repositorios](#6-repositorios)
7. [Servicios](#7-servicios)
8. [Controladores](#8-controladores)
9. [Lógica de Negocio](#9-lógica-de-negocio)
10. [Configuración](#10-configuración)
11. [Instalación y Ejecución](#11-instalación-y-ejecución)

---

## 1. INTRODUCCIÓN.

### 1.1 Descripción del proyecto:

Sistema backend para gestión de una Pokédex digital que permite:
- Consultar información detallada de Pokémon
- Crear, modificar y eliminar Pokémon
- Gestionar tipos y estadísticas de combate
- Visualizar y crear cadenas evolutivas
- Validar datos según reglas de negocio

### 1.2 Tecnologías utilizadas:

| Componente | Tecnología | Versión |
|-----------|------------|---------|
| Framework | Spring Boot | 3.2.1 |
| Persistencia | JPA/Hibernate | 6.4.1 |
| Base de Datos | MySQL | 8.x |
| Lenguaje | Java | 17+ |
| Build Tool | Maven | 3.x |
| IDE | IntelliJ IDEA | 2024+ |

### 1.3 Características principales:

- API REST completa con 10+ endpoints
- CRUD completo para todas las entidades
- Validaciones de lógica de negocio
- Relaciones entre entidades (1:1, 1:N, N:M)
- Eliminación en cascada automática
- Manejo de errores con mensajes descriptivos

---

## 2. ARQUITECTURA DEL SISTEMA.

### 2.1 Patrón arquitectónico.

**Arquitectura en capas (Layered Architecture):**

```
                             ┌─────────────────────────────────────┐
                             │        CAPA DE PRESENTACIÓN         │
                             │         Controladores REST          │
                             │   (@RestController, @CrossOrigin)   │
                             └──────────────┬──────────────────────┘
                                            │
                             ┌──────────────▼──────────────────────┐
                             │      CAPA DE LÓGICA DE NEGOCIO      │
                             │             Servicios               │
                             │     (@Service, @Transactional)      │
                             └──────────────┬──────────────────────┘
                                            │
                             ┌──────────────▼──────────────────────┐
                             │       CAPA DE ACCESO A DATOS        │
                             │          Repositorios JPA           │
                             │           (JpaRepository)           │
                             └──────────────┬──────────────────────┘
                                            │
                             ┌──────────────▼──────────────────────┐
                             │        BASE DE DATOS MySQL          │
                             │      (5 tablas relacionales)        │
                             └─────────────────────────────────────┘
```


---

## 3. BASE DE DATOS.

### 3.1 Descripción de tablas:

#### **Pokemon**
Tabla principal que almacena información básica de cada Pokémon.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| idPokemon | INT | PK, AUTO_INCREMENT | ID único |
| numero | INT | NOT NULL, UNIQUE | Número Pokédex |
| nombre | VARCHAR(100) | NOT NULL | Nombre del Pokémon |
| altura | DECIMAL(4,2) | | Altura en metros |
| peso | DECIMAL(5,2) | | Peso en kilogramos |
| descripción | TEXT | | Descripción del Pokémon |
| generacion | INT | | Generación (1-9) |

#### **Tipo**
Catálogo de los 18 tipos de Pokémon.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| idTipo | INT | PK, AUTO_INCREMENT | ID único |
| nombre | VARCHAR(50) | NOT NULL, UNIQUE | Nombre del tipo |
| icono | VARCHAR(50) | | Emoji o icono |
| color | VARCHAR(20) | | Color hexadecimal |

#### **Pokemon_tipo**
Tabla intermedia para relación N:M entre Pokemon y Tipo.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| pokemon_id | INT | PK, FK | ID del Pokémon |
| tipo_id | INT | PK, FK | ID del Tipo |
| orden | TINYINT | | Orden del tipo (1 o 2) |

#### **Estadísticas**
Estadísticas de combate de cada Pokémon.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| idEstadísticas | INT | PK, AUTO_INCREMENT | ID único |
| idPokemon | INT | FK, UNIQUE | ID del Pokémon |
| ps | INT | | Puntos de Salud |
| ataque | INT | | Ataque físico |
| defensa | INT | | Defensa física |
| velocidad | INT | | Velocidad |
| ataque_especial | INT | | Ataque especial |
| defensa_especial | INT | | Defensa especial |

#### **Evolucion**
Cadenas evolutivas entre Pokémon.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| idEvolucion | INT | PK, AUTO_INCREMENT | ID único |
| pokemon_origen_id | INT | FK | Pokémon que evoluciona |
| pokemon_destino_id | INT | FK | Pokémon resultante |
| nivel_evolucion | INT | | Nivel requerido |
| metodo | VARCHAR(50) | | Método de evolución |

### 3.2 Datos Iniciales

La base de datos incluye:
- **18 tipos** de Pokémon (Fuego, Agua, Planta, etc.)
- **5 Pokémon** de ejemplo con estadísticas completas
- **2 cadenas evolutivas** (Bulbasaur → Ivysaur → Venusaur, Charmander → Charmeleon)

---

## 4. ENTIDADES JPA.

### 4.1 Pokemon.java:

Entidad principal que representa un Pokémon.

```java
@Entity
@Table(name = "Pokemon")
public class Pokemon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPokemon")
    private Integer id;
    
    @Column(name = "numero", nullable = false, unique = true)
    private Integer numero;
    
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "altura")
    private Double altura;
    
    @Column(name = "peso")
    private Double peso;
    
    @Column(name = "descripción", columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(name = "generacion")
    private Integer generacion;
    
    // Constructores, getters y setters
}
```

**Características:**
- Mapeo directo a tabla `Pokemon`
- ID auto-incremental
- Número de Pokédex único
- Sin Lombok (getters/setters explícitos)

### 4.2 Tipo.java:

```java
@Entity
@Table(name = "Tipo")
public class Tipo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTipo")
    private Integer id;
    
    @Column(name = "nombre", nullable = false, unique = true, length = 50)
    private String nombre;
    
    @Column(name = "icono", length = 50)
    private String icono;
    
    @Column(name = "color", length = 20)
    private String color;
}
```

### 4.3 PokemonTipo.java (Relación N:M):

```java
@Entity
@Table(name = "Pokemon_tipo")
@IdClass(PokemonTipoId.class)
public class PokemonTipo {
    @Id
    @Column(name = "pokemon_id")
    private Integer pokemonId;
    
    @Id
    @Column(name = "tipo_id")
    private Integer tipoId;
    
    @Column(name = "orden")
    private Byte orden;
}
```

### 4.4 PokemonTipoId.java (Clave Compuesta):

```java
public class PokemonTipoId implements Serializable {
    private Integer pokemonId;
    private Integer tipoId;
    
    // equals() y hashCode() implementados
}
```

### 4.5 Estadisticas.java:

```java
@Entity
@Table(name = "Estadísticas")
public class Estadisticas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idEstadísticas")
    private Integer id;
    
    @Column(name = "idPokemon", unique = true)
    private Integer idPokemon;
    
    @Column(name = "ps")
    private Integer ps;
    
    @Column(name = "ataque")
    private Integer ataque;
    
    @Column(name = "defensa")
    private Integer defensa;
    
    @Column(name = "velocidad")
    private Integer velocidad;
    
    @Column(name = "ataque_especial")
    private Integer ataqueEspecial;
    
    @Column(name = "defensa_especial")
    private Integer defensaEspecial;
    
    public Integer calcularTotal() {
        return ps + ataque + defensa + velocidad + 
               ataqueEspecial + defensaEspecial;
    }
}
```

### 4.6 Evolucion.java

```java
@Entity
@Table(name = "Evolucion")
public class Evolucion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idEvolucion")
    private Integer id;
    
    @Column(name = "pokemon_origen_id")
    private Integer pokemonOrigenId;
    
    @Column(name = "pokemon_destino_id")
    private Integer pokemonDestinoId;
    
    @Column(name = "nivel_evolucion")
    private Integer nivelEvolucion;
    
    @Column(name = "metodo", length = 50)
    private String metodo;
}
```

---

## 5. DTOs

Los DTOs (Data Transfer Objects) se utilizan para transferir datos entre capas sin exponer las entidades JPA directamente.

### 5.1 PokemonDTO.java

```java
public class PokemonDTO {
    private Integer id;
    private Integer numero;
    private String nombre;
    private Double altura;
    private Double peso;
    private String descripcion;
    private Integer generacion;
    private List<String> tipos;
    private EstadisticasDTO estadisticas;
    private List<EvolucionDTO> evoluciones;
    
    // Getters y setters
}
```

### 5.2 EstadisticasDTO.java

```java
public class EstadisticasDTO {
    private Integer id;
    private Integer ps;
    private Integer ataque;
    private Integer defensa;
    private Integer velocidad;
    private Integer ataqueEspecial;
    private Integer defensaEspecial;
    private Integer total; // Calculado
}
```

### 5.3 TipoDTO.java

```java
public class TipoDTO {
    private Integer id;
    private String nombre;
    private String icono;
    private String color;
}
```

### 5.4 EvolucionDTO.java:

```java
public class EvolucionDTO {
    private Integer id;
    private String pokemonOrigen;
    private String pokemonDestino;
    private Integer nivelEvolucion;
    private String metodo;
}
```

---

## 6. REPOSITORIOS.

Interfaces JPA que extienden `JpaRepository` para acceso a datos.

### 6.1 PokemonRepository.java

```java
public interface PokemonRepository extends JpaRepository<Pokemon, Integer> {
    
    // Buscar por número de Pokédex
    Optional<Pokemon> findByNumero(Integer numero);
    
    // Buscar por nombre (case-insensitive, parcial)
    List<Pokemon> findByNombreContainingIgnoreCase(String nombre);
    
    // Obtener todos ordenados por número
    List<Pokemon> findAllByOrderByNumeroAsc();
    
    // Filtrar por generación
    List<Pokemon> findByGeneracionOrderByNumeroAsc(Integer generacion);
    
    // Query personalizada: buscar por tipo
    @Query("SELECT p FROM Pokemon p JOIN PokemonTipo pt ON p.id = pt.pokemonId " +
           "JOIN Tipo t ON pt.tipoId = t.id WHERE t.nombre = :nombreTipo " +
           "ORDER BY p.numero")
    List<Pokemon> findByTipo(@Param("nombreTipo") String nombreTipo);
}
```

### 6.2 TipoRepository.java

```java
public interface TipoRepository extends JpaRepository<Tipo, Integer> {
    Optional<Tipo> findByNombre(String nombre);
}
```

### 6.3 Otros repositorios:

- **EstadisticasRepository:** `Optional<Estadisticas> findByIdPokemon(Integer idPokemon)`
- **EvolucionRepository:** `List<Evolucion> findByPokemonOrigenId(Integer id)`
- **PokemonTipoRepository:** `List<PokemonTipo> findByPokemonIdOrderByOrdenAsc(Integer id)`

---

## 7. SERVICIOS.

Capa de lógica de negocio que implementa las reglas y validaciones.

### 7.1 PokemonService.java

**Métodos principales:**

```java
@Service
@Transactional
public class PokemonService {
    
    // READ
    public PokemonDTO obtenerPorId(Integer id);
    public PokemonDTO obtenerPorNumero(Integer numero);
    public List<PokemonDTO> buscarPorNombre(String nombre);
    public List<PokemonDTO> obtenerPorGeneracion(Integer generacion);
    public List<PokemonDTO> obtenerPorTipo(String tipo);
    
    // CREATE
    public PokemonDTO crear(PokemonDTO dto);
    
    // UPDATE
    public PokemonDTO actualizar(Integer id, PokemonDTO dto);
    
    // DELETE
    public void eliminar(Integer id);
    
    // EVOLUCIONES
    public void crearEvolucion(Integer origenId, Integer destinoId, 
                               Integer nivel, String metodo);
}
```

**Validaciones implementadas:**
- No permitir números Pokédex duplicados
- Requiere 1-2 tipos válidos
- Estadísticas entre 1-255
- Generación entre 1-9
- No auto-evolución

### 7.2 TipoService.java

```java
@Service
@Transactional
public class TipoService {
    public List<TipoDTO> obtenerTodos();
    public TipoDTO obtenerPorId(Integer id);
    public TipoDTO obtenerPorNombre(String nombre);
    public boolean existeTipo(Integer id);
}
```

---

## 8. CONTROLADORES.

### 8.1 PokemonController.java

```java
@RestController
@RequestMapping("/api/pokemon")
@CrossOrigin(origins = "*")
public class PokemonController {
    
    @GetMapping
    public ResponseEntity<List<PokemonDTO>> obtenerTodos();
    
    @GetMapping("/{id}")
    public ResponseEntity<PokemonDTO> obtenerPorId(@PathVariable Integer id);
    
    @GetMapping("/numero/{numero}")
    public ResponseEntity<PokemonDTO> obtenerPorNumero(@PathVariable Integer numero);
    
    @GetMapping("/buscar")
    public ResponseEntity<List<PokemonDTO>> buscarPorNombre(@RequestParam String nombre);
    
    @GetMapping("/generacion/{generacion}")
    public ResponseEntity<List<PokemonDTO>> obtenerPorGeneracion(@PathVariable Integer generacion);
    
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<PokemonDTO>> obtenerPorTipo(@PathVariable String tipo);
    
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody PokemonDTO pokemonDTO);
    
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, 
                                       @RequestBody PokemonDTO pokemonDTO);
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id);
    
    @PostMapping("/{origenId}/evolucion")
    public ResponseEntity<?> crearEvolucion(@PathVariable Integer origenId,
                                           @RequestBody EvolucionRequest request);
}
```

### 8.2 TipoController.java

```java
@RestController
@RequestMapping("/api/tipos")
@CrossOrigin(origins = "*")
public class TipoController {
    
    @GetMapping
    public ResponseEntity<List<TipoDTO>> obtenerTodos();
    
    @GetMapping("/{id}")
    public ResponseEntity<TipoDTO> obtenerPorId(@PathVariable Integer id);
    
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<TipoDTO> obtenerPorNombre(@PathVariable String nombre);
}
```

---

## 9. LÓGICA DE NEGOCIO.

### 9.1 Reglas implementadas:

#### **1. No Duplicados**
```
No permitir dos Pokémon con el mismo número de Pokédex
```

**Validación:**
```
if (pokemonRepository.findByNumero(dto.getNumero()).isPresent()) {
    throw new RuntimeException("Ya existe un Pokémon con el número " + dto.getNumero());
}
```

#### **2. Validación de tipos:**
```
Mínimo 1 tipo, máximo 2 tipos
Los tipos deben existir en la BD
```

**Validación:**
```
if (dto.getTipos() == null || dto.getTipos().isEmpty()) {
    throw new RuntimeException("El Pokémon debe tener al menos un tipo");
}
if (dto.getTipos().size() > 2) {
    throw new RuntimeException("El Pokémon no puede tener más de 2 tipos");
}
for (String tipo : dto.getTipos()) {
    if (!tipoRepository.findByNombre(tipo).isPresent()) {
        throw new RuntimeException("El tipo '" + tipo + "' no existe");
    }
}
```

#### **3. Validación de estadísticas**
```
Cada stat debe estar entre 1 y 255
```

**Validación:**
```
if (stats.getPs() < 1 || stats.getPs() > 255) {
    throw new RuntimeException("Los PS deben estar entre 1 y 255");
}
// Similar para ataque, defensa, velocidad, etc.
```

#### **4. Validación de generación**
```
Solo generaciones 1-9 permitidas
```

**Validación:**
```
if (dto.getGeneracion() < 1 || dto.getGeneracion() > 9) {
    throw new RuntimeException("La generación debe estar entre 1 y 9");
}
```

#### **5. Validación de evolución**
```
Un Pokémon no puede evolucionar a sí mismo
```

**Validación:**
```
if (origenId.equals(destinoId)) {
    throw new RuntimeException("Un Pokémon no puede evolucionar a sí mismo");
}
```

#### **6. Eliminación en cascada:**
```
Al eliminar un Pokémon, se eliminan automáticamente:
  Estadísticas (1:1)
  Relaciones de tipos (N:M)
  Evoluciones (donde aparece)
```

**Implementación:**
```java
public void eliminar(Integer id) {
    // Eliminar evoluciones
    evolucionRepository.findByPokemonOrigenId(id)
        .forEach(evolucionRepository::delete);
    evolucionRepository.findByPokemonDestinoId(id)
        .forEach(evolucionRepository::delete);
    
    // Eliminar estadísticas
    estadisticasRepository.findByIdPokemon(id)
        .ifPresent(estadisticasRepository::delete);
    
    // Eliminar tipos
    pokemonTipoRepository.deleteByPokemonId(id);
    
    // Eliminar Pokémon
    pokemonRepository.deleteById(id);
}
```

---

## 10. CONFIGURACIÓN.

### 10.1 application.properties

```properties
# Configuración MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/pokedex_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password_here
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Configuración JPA
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl

# Servidor
server.port=8080

# Logging
logging.level.com.pokedex=DEBUG
```

### 10.2 pom.xml (Dependencias principales)

```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- MySQL Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
    </dependency>
    
    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

---

## 11. INSTALACIÓN Y EJECUCIÓN.

### 11.1 Requisitos Previos:

- Java 17 o superior
- MySQL 8.0 o superior
- Maven 3.6 o superior
- IntelliJ IDEA (recomendado) o Eclipse

### 11.2 Instalación Paso a Paso

#### **1. Clonar el repositorio**
```bash
git clone https://github.com/pablitoclavito04/Pokedex.git
cd Pokedex/backend
```

#### **2. Configurar MySQL**
```sql
-- Crear base de datos
CREATE DATABASE pokedex_db;

-- Usar la base de datos
USE pokedex_db;

-- Ejecutar scripts de creación
SOURCE database/create_tables.sql;

-- Insertar datos iniciales
SOURCE database/insert_data.sql;
```

#### **3. Configurar application.properties**
Editar `src/main/resources/application.properties`:
```properties
spring.datasource.password=TU_PASSWORD_MYSQL
```

#### **4. Compilar el proyecto**
```bash
mvn clean install
```

#### **5. Ejecutar la aplicación**

**Opción A: Maven**
```bash
mvn spring-boot:run
```

**Opción B: IntelliJ IDEA**
1. Abrir proyecto en IntelliJ
2. Localizar `PokedexApplication.java`
3. Click derecho → Run 'PokedexApplication'

#### **6. Verificar funcionamiento**

Abrir navegador en:
```
http://localhost:8080/api/pokemon
```

Debería retornar JSON con 5 Pokémon.

### 11.3 Solución de Problemas Comunes

#### **Error: Cannot connect to MySQL**
- Verificar que MySQL esté corriendo
- Verificar usuario/contraseña en `application.properties`
- Verificar que existe la base de datos `pokedex_db`

#### **Error: Port 8080 already in use**
Cambiar puerto en `application.properties`:
```properties
server.port=8081
```

#### **Error: Cannot find symbol**
- Ejecutar `mvn clean install`
- Rebuild Project en IntelliJ

---

## CONCLUSIÓN.

Este documento describe la arquitectura completa del backend de la Pokédex, desde la base de datos hasta la API REST, incluyendo todas las validaciones de lógica de negocio implementadas.
