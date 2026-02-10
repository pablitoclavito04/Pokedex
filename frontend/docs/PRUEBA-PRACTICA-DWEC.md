# PRUEBA-PRACTICA-DWEC

## 1. Routing y navegacion

### Nueva ruta

Se ha creado la ruta `/team-builder` en el archivo `app.routes.ts`:

```typescript
{
  path: 'team-builder',
  loadComponent: () => import('./pages/team-builder/team-builder').then(m => m.TeamBuilderComponent),
  title: 'Constructor de Equipos - Pokédex',
  data: { breadcrumb: 'Constructor de Equipos' }
}
```

### Lazy loading

El componente se carga con **lazy loading** usando `loadComponent()`, por lo que solo se descarga cuando el usuario navega a esa ruta.

### Integracion en header y footer

En el **Header** se ha añadido el enlace "Constructor" en la barra de navegación, que lleva a `/team-builder`. También aparece en el **Footer** dentro de la sección de navegación.


## 2. Arquitectura de componentes (Padre-Hijo)

### Jerarquia

```
TeamBuilderComponent (PADRE - Contenedor)
TrainerFormComponent (Hijo)
TeamRosterComponent (Hijo)
TeamStatsComponent (Hijo)
```

### Componente padre: `TeamBuilderComponent`

- **Archivo:** `src/app/pages/team-builder/team-builder.ts`
- Es el componente contenedor que inyecta los servicios (`TeamBuilderService`, `CommunicationService`, `ToastService`).
- Gestiona el sistema de tabs (Entrenador, Equipo, Estadísticas) y controla qué componente hijo se muestra.
- Maneja la navegación por teclado entre las tabs (flechas, Home, End).

### Componentes hijos

**TrainerFormComponent** (`components/trainer-form/trainer-form.ts`)
- Standalone: `standalone: true`
- Formulario reactivo para el perfil del entrenador (nombre, NIF, región, especialidad...).
- Envía los datos al padre a través del `TeamBuilderService`.

**TeamRosterComponent** (`components/team-roster/team-roster.ts`)
- Standalone: `standalone: true`
- Buscador de Pokémon que consume la PokeAPI.
- Gestión del equipo (máximo 6 miembros, sin duplicados).
- Drag & Drop para reordenar y navegación por teclado.

**TeamStatsComponent** (`components/team-stats/team-stats.ts`)
- Standalone: `standalone: true`
- Recibe los datos del equipo desde el servicio y muestra las estadísticas medias, cobertura de tipos, fortalezas y debilidades.

### Tipado con interfaces

Las interfaces están definidas en `src/services/team-builder.service.ts`. No se usa `any` en ningún componente:

```typescript
export interface TeamMember {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: { hp: number; attack: number; defense: number; speed: number; specialAttack: number; specialDefense: number; };
}

export interface TrainerData {
  username: string;
  email: string;
  nombre: string;
  apellidos: string;
  nif: string;
  region: string;
  especialidad: string;
  pokemonFavoritos: string[];
  medallas: { nombre: string; gimnasio: string }[];
}

export interface TeamStats {
  totalHp: number;
  totalAttack: number;
  totalDefense: number;
  totalSpeed: number;
  avgHp: number;
  avgAttack: number;
  avgDefense: number;
  avgSpeed: number;
  typeCoverage: string[];
  memberCount: number;
}
```


## 3. Instrucciones de ejecucion

1. Entrar en la carpeta del frontend:
   ```
   cd frontend
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

3. Arrancar el servidor de desarrollo:
   ```
   ng serve
   ```

4. Abrir en el navegador: `http://localhost:4200/team-builder`
