import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

// ============================================================================
//          INTERFACES - Modelos de datos del Team Builder
// ============================================================================

export interface TeamMember {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    specialAttack: number;
    specialDefense: number;
  };
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

export interface PokemonSearchResult {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

// ============================================================================
//          TEAM BUILDER SERVICE
// ============================================================================

// Mapa de traducción de tipos inglés → español
const TYPE_TRANSLATIONS: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada'
};

@Injectable({
  providedIn: 'root'
})
export class TeamBuilderService {
  private http = inject(HttpClient);

  /**
   * Traduce un tipo de inglés a español
   */
  static translateType(type: string): string {
    return TYPE_TRANSLATIONS[type.toLowerCase()] || type;
  }

  // Claves de localStorage para persistencia
  private readonly STORAGE_KEY_TEAM = 'teamBuilder_team';
  private readonly STORAGE_KEY_TRAINER = 'teamBuilder_trainer';

  // ========== BehaviorSubjects para comunicación entre componentes ==========

  // Equipo actual (máximo 6 miembros)
  private teamMembersSubject = new BehaviorSubject<TeamMember[]>(this.loadFromStorage<TeamMember[]>(this.STORAGE_KEY_TEAM, []));
  public teamMembers$: Observable<TeamMember[]> = this.teamMembersSubject.asObservable();

  // Datos del entrenador
  private trainerDataSubject = new BehaviorSubject<TrainerData | null>(this.loadFromStorage<TrainerData | null>(this.STORAGE_KEY_TRAINER, null));
  public trainerData$: Observable<TrainerData | null> = this.trainerDataSubject.asObservable();

  // ¿Equipo completo? (6 miembros)
  private isTeamCompleteSubject = new BehaviorSubject<boolean>(this.loadFromStorage<TeamMember[]>(this.STORAGE_KEY_TEAM, []).length === 6);
  public isTeamComplete$: Observable<boolean> = this.isTeamCompleteSubject.asObservable();

  // Notificaciones entre componentes hermanos
  private teamNotificationSubject = new BehaviorSubject<string>('');
  public teamNotification$: Observable<string> = this.teamNotificationSubject.asObservable();

  // Estado de búsqueda
  private isSearchingSubject = new BehaviorSubject<boolean>(false);
  public isSearching$: Observable<boolean> = this.isSearchingSubject.asObservable();

  // ========== MÉTODOS DE GESTIÓN DEL EQUIPO ==========

  /**
   * Añade un miembro al equipo (máximo 6)
   */
  addMember(pokemon: TeamMember): boolean {
    const current = this.teamMembersSubject.getValue();
    if (current.length >= 6) {
      this.teamNotificationSubject.next('El equipo ya tiene 6 miembros');
      return false;
    }

    if (current.some(m => m.id === pokemon.id)) {
      this.teamNotificationSubject.next(`${pokemon.name} ya está en el equipo`);
      return false;
    }

    const updated = [...current, pokemon];
    this.teamMembersSubject.next(updated);
    this.isTeamCompleteSubject.next(updated.length === 6);
    this.teamNotificationSubject.next(`${pokemon.name} añadido al equipo`);
    this.saveToStorage(this.STORAGE_KEY_TEAM, updated);
    return true;
  }

  /**
   * Elimina un miembro del equipo por índice
   */
  removeMember(index: number): void {
    const current = this.teamMembersSubject.getValue();
    if (index < 0 || index >= current.length) return;

    const removed = current[index];
    const updated = current.filter((_, i) => i !== index);
    this.teamMembersSubject.next(updated);
    this.isTeamCompleteSubject.next(false);
    this.teamNotificationSubject.next(`${removed.name} eliminado del equipo`);
    this.saveToStorage(this.STORAGE_KEY_TEAM, updated);
  }

  /**
   * Reordena miembros del equipo (drag & drop)
   */
  reorderMembers(fromIndex: number, toIndex: number): void {
    const current = [...this.teamMembersSubject.getValue()];
    if (fromIndex < 0 || fromIndex >= current.length || toIndex < 0 || toIndex >= current.length) return;

    const [moved] = current.splice(fromIndex, 1);
    current.splice(toIndex, 0, moved);
    this.teamMembersSubject.next(current);
    this.teamNotificationSubject.next(`${moved.name} movido a posición ${toIndex + 1}`);
    this.saveToStorage(this.STORAGE_KEY_TEAM, current);
  }

  /**
   * Guarda los datos del entrenador
   */
  setTrainerData(data: TrainerData): void {
    this.trainerDataSubject.next(data);
    this.teamNotificationSubject.next('Datos del entrenador guardados');
    this.saveToStorage(this.STORAGE_KEY_TRAINER, data);
  }

  /**
   * Limpia todo el equipo
   */
  clearTeam(): void {
    this.teamMembersSubject.next([]);
    this.isTeamCompleteSubject.next(false);
    this.teamNotificationSubject.next('Equipo vaciado');
    this.saveToStorage(this.STORAGE_KEY_TEAM, []);
  }

  /**
   * Obtiene los datos actuales del equipo
   */
  getTeamMembers(): TeamMember[] {
    return this.teamMembersSubject.getValue();
  }

  /**
   * Obtiene los datos del entrenador
   */
  getTrainerData(): TrainerData | null {
    return this.trainerDataSubject.getValue();
  }

  /**
   * Calcula estadísticas agregadas del equipo
   */
  getTeamStats(): TeamStats {
    const members = this.teamMembersSubject.getValue();
    const count = members.length;

    if (count === 0) {
      return {
        totalHp: 0, totalAttack: 0, totalDefense: 0, totalSpeed: 0,
        avgHp: 0, avgAttack: 0, avgDefense: 0, avgSpeed: 0,
        typeCoverage: [], memberCount: 0
      };
    }

    const totals = members.reduce((acc, m) => ({
      hp: acc.hp + m.stats.hp,
      attack: acc.attack + m.stats.attack,
      defense: acc.defense + m.stats.defense,
      speed: acc.speed + m.stats.speed
    }), { hp: 0, attack: 0, defense: 0, speed: 0 });

    const types = [...new Set(members.flatMap(m => m.types))];

    return {
      totalHp: totals.hp,
      totalAttack: totals.attack,
      totalDefense: totals.defense,
      totalSpeed: totals.speed,
      avgHp: Math.round(totals.hp / count),
      avgAttack: Math.round(totals.attack / count),
      avgDefense: Math.round(totals.defense / count),
      avgSpeed: Math.round(totals.speed / count),
      typeCoverage: types,
      memberCount: count
    };
  }

  // ========== BÚSQUEDA DE POKÉMON (PokeAPI) ==========

  /**
   * Busca Pokémon por nombre en PokeAPI
   */
  searchPokemon(query: string): Observable<PokemonSearchResult[]> {
    if (!query || query.trim().length < 1) return of([]);

    this.isSearchingSubject.next(true);

    return this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=1025').pipe(
      map(response => {
        const queryLower = query.toLowerCase().trim();
        const numericQuery = parseInt(queryLower, 10);
        const isNumericSearch = /^\d+$/.test(queryLower) && !isNaN(numericQuery) && numericQuery > 0;

        let matched: any[];

        if (isNumericSearch) {
          matched = response.results.filter((p: any) => {
            const id = parseInt(p.url.split('/').filter(Boolean).pop());
            return id === numericQuery;
          });
        } else {
          // Separar: primero los que empiezan por el texto, luego los que lo contienen
          const startsWith: any[] = [];
          const contains: any[] = [];

          response.results.forEach((p: any) => {
            if (p.name.toLowerCase().startsWith(queryLower)) {
              startsWith.push(p);
            } else if (p.name.toLowerCase().includes(queryLower)) {
              contains.push(p);
            }
          });

          matched = [...startsWith, ...contains];
        }

        const filtered = matched
          .slice(0, 8)
          .map((p: any, _index: number) => {
            const id = parseInt(p.url.split('/').filter(Boolean).pop());
            return {
              id,
              name: p.name,
              sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
              types: []
            } as PokemonSearchResult;
          });

        this.isSearchingSubject.next(false);
        return filtered;
      }),
      catchError(() => {
        this.isSearchingSubject.next(false);
        return of([]);
      })
    );
  }

  /**
   * Obtiene los datos completos de un Pokémon por ID
   */
  getPokemonDetails(id: number): Observable<TeamMember | null> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${id}`).pipe(
      map(data => ({
        id: data.id,
        name: data.name,
        sprite: data.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
        types: data.types.map((t: any) => TeamBuilderService.translateType(t.type.name)),
        stats: {
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          specialAttack: data.stats[3].base_stat,
          specialDefense: data.stats[4].base_stat,
          speed: data.stats[5].base_stat
        }
      } as TeamMember)),
      catchError(() => of(null))
    );
  }

  /**
   * Envía una notificación a los componentes hermanos
   */
  sendNotification(message: string): void {
    this.teamNotificationSubject.next(message);
  }

  /**
   * Limpia todos los datos del servicio
   */
  resetAll(): void {
    this.teamMembersSubject.next([]);
    this.trainerDataSubject.next(null);
    this.isTeamCompleteSubject.next(false);
    this.teamNotificationSubject.next('');
    this.isSearchingSubject.next(false);
    localStorage.removeItem(this.STORAGE_KEY_TEAM);
    localStorage.removeItem(this.STORAGE_KEY_TRAINER);
  }

  // ========== PERSISTENCIA EN LOCALSTORAGE ==========

  private loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private saveToStorage(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage lleno o no disponible
    }
  }
}
