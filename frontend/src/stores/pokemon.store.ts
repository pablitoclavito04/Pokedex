// ============================================================================
//          POKEMON STORE - Gestión de estado con Signals (Fase 6)
// ============================================================================

import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

/**
 * Interfaz para los datos básicos de un Pokémon
 */
export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: PokemonType[];
  stats: PokemonStat[];
  height: number;
  weight: number;
  spanishName?: string;
}

export interface PokemonType {
  name: string;
  color: string;
}

export interface PokemonStat {
  name: string;
  value: number;
}

/**
 * Estado de la paginación
 */
interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  hasMore: boolean;
}

/**
 * PokemonStore - Store centralizado con Signals para gestión de estado reactiva
 *
 * Ventajas de usar Signals sobre BehaviorSubject:
 * - Sintaxis más simple (no necesita async pipe)
 * - Mejor rendimiento (change detection más eficiente)
 * - Integración nativa con Angular 17+
 * - Computed values automáticos
 */
@Injectable({
  providedIn: 'root'
})
export class PokemonStore {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  private readonly API_URL = 'https://pokeapi.co/api/v2/pokemon';
  private readonly SPECIES_URL = 'https://pokeapi.co/api/v2/pokemon-species';
  private readonly TOTAL_POKEMON = 1025; // Total de Pokémon en PokeAPI

  // ============================================================================
  // SIGNALS - Estado privado (escritura)
  // ============================================================================

  private _pokemons = signal<Pokemon[]>([]);
  private _allPokemonNames = signal<{ id: number; name: string }[]>([]);
  private _selectedPokemon = signal<Pokemon | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _searchQuery = signal('');

  // Estado de paginación
  private _pagination = signal<PaginationState>({
    currentPage: 1,
    pageSize: 20,
    totalItems: this.TOTAL_POKEMON,
    hasMore: true
  });

  // Cache de Pokémon para evitar llamadas repetidas
  private pokemonCache = new Map<number, Pokemon>();
  private spanishNamesCache = new Map<number, string>();

  // Mapa de colores por tipo de Pokémon
  private readonly typeColors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  };

  // ============================================================================
  // SIGNALS - Estado público (solo lectura)
  // ============================================================================

  readonly pokemons = this._pokemons.asReadonly();
  readonly allPokemonNames = this._allPokemonNames.asReadonly();
  readonly selectedPokemon = this._selectedPokemon.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly pagination = this._pagination.asReadonly();

  // ============================================================================
  // COMPUTED SIGNALS - Valores derivados (se recalculan automáticamente)
  // ============================================================================

  /**
   * Total de Pokémon cargados actualmente
   */
  readonly totalLoaded = computed(() => this._pokemons().length);

  /**
   * Pokémon filtrados por búsqueda
   */
  readonly filteredPokemons = computed(() => {
    const query = this._searchQuery().toLowerCase().trim();
    if (!query) {
      return this._pokemons();
    }
    return this._pokemons().filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.spanishName?.toLowerCase().includes(query) ||
      p.id.toString().includes(query)
    );
  });

  /**
   * Indica si hay más Pokémon por cargar
   */
  readonly hasMore = computed(() => this._pagination().hasMore);

  /**
   * Página actual
   */
  readonly currentPage = computed(() => this._pagination().currentPage);

  /**
   * Indica si la lista está vacía
   */
  readonly isEmpty = computed(() => this._pokemons().length === 0 && !this._loading());

  // ============================================================================
  // MÉTODOS PÚBLICOS - Actualización de estado
  // ============================================================================

  /**
   * Carga la primera página de Pokémon
   */
  loadInitialPage(): void {
    this._pagination.set({
      currentPage: 1,
      pageSize: 20,
      totalItems: this.TOTAL_POKEMON,
      hasMore: true
    });
    this._pokemons.set([]);
    this.loadPage(1);
  }

  /**
   * Carga una página específica de Pokémon
   */
  loadPage(page: number): void {
    const pageSize = this._pagination().pageSize;
    const offset = (page - 1) * pageSize;

    if (offset >= this.TOTAL_POKEMON) {
      this._pagination.update(p => ({ ...p, hasMore: false }));
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.http.get<{ results: any[] }>(
      `${this.API_URL}?offset=${offset}&limit=${pageSize}`
    ).subscribe({
      next: (response) => {
        const newPokemons = response.results.map((p: any) => {
          const id = parseInt(p.url.split('/').slice(-2)[0]);
          return this.createPokemonFromBasicData(id, p.name);
        });

        // Actualizar lista de forma inmutable
        this._pokemons.update(list => [...list, ...newPokemons]);

        // Actualizar estado de paginación
        this._pagination.update(p => ({
          ...p,
          currentPage: page,
          hasMore: (page * pageSize) < this.TOTAL_POKEMON
        }));

        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading Pokemon page:', error);
        this._error.set('Error al cargar los Pokémon');
        this._loading.set(false);
        this.toastService.error('Error al cargar los Pokémon');
      }
    });
  }

  /**
   * Carga la siguiente página de Pokémon
   */
  loadNextPage(): void {
    const currentPage = this._pagination().currentPage;
    if (this._pagination().hasMore && !this._loading()) {
      this.loadPage(currentPage + 1);
    }
  }

  /**
   * Selecciona un Pokémon por ID y carga sus detalles completos
   */
  selectPokemonById(id: number): Observable<Pokemon> {
    this._loading.set(true);
    this._error.set(null);

    // Verificar cache primero
    if (this.pokemonCache.has(id)) {
      const cached = this.pokemonCache.get(id)!;
      this._selectedPokemon.set(cached);
      this._loading.set(false);
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }

    // Cargar desde API
    return forkJoin({
      pokemon: this.http.get<any>(`${this.API_URL}/${id}`),
      species: this.http.get<any>(`${this.SPECIES_URL}/${id}`)
    }).pipe(
      map(({ pokemon, species }) => this.transformPokemonData(pokemon, species)),
      tap(pokemon => {
        this.pokemonCache.set(id, pokemon);
        this._selectedPokemon.set(pokemon);
        this._loading.set(false);
      })
    );
  }

  /**
   * Actualiza la consulta de búsqueda
   * (Los resultados filtrados se actualizan automáticamente vía computed)
   */
  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  /**
   * Limpia la búsqueda
   */
  clearSearch(): void {
    this._searchQuery.set('');
  }

  /**
   * Carga todos los nombres de Pokémon (para búsqueda)
   */
  loadAllPokemonNames(): void {
    if (this._allPokemonNames().length > 0) {
      return; // Ya cargado
    }

    this.http.get<{ results: any[] }>(
      `${this.API_URL}?limit=${this.TOTAL_POKEMON}`
    ).subscribe({
      next: (response) => {
        const names = response.results.map((p: any, index: number) => ({
          id: index + 1,
          name: this.capitalizeFirstLetter(p.name)
        }));
        this._allPokemonNames.set(names);
      },
      error: (error) => {
        console.error('Error loading Pokemon names:', error);
      }
    });
  }

  /**
   * Limpia el cache de Pokémon
   */
  clearCache(): void {
    this.pokemonCache.clear();
    this.spanishNamesCache.clear();
  }

  /**
   * Reinicia el store a su estado inicial
   */
  reset(): void {
    this._pokemons.set([]);
    this._selectedPokemon.set(null);
    this._loading.set(false);
    this._error.set(null);
    this._searchQuery.set('');
    this._pagination.set({
      currentPage: 1,
      pageSize: 20,
      totalItems: this.TOTAL_POKEMON,
      hasMore: true
    });
  }

  // ============================================================================
  // MÉTODOS PRIVADOS - Transformación de datos
  // ============================================================================

  private createPokemonFromBasicData(id: number, name: string): Pokemon {
    return {
      id,
      name: this.capitalizeFirstLetter(name),
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      types: [],
      stats: [],
      height: 0,
      weight: 0
    };
  }

  private transformPokemonData(pokemonData: any, speciesData: any): Pokemon {
    const types: PokemonType[] = pokemonData.types.map((typeData: any) => ({
      name: this.translateType(typeData.type.name),
      color: this.typeColors[typeData.type.name] || '#A8A878'
    }));

    const stats: PokemonStat[] = pokemonData.stats.map((statData: any) => ({
      name: this.translateStat(statData.stat.name),
      value: statData.base_stat
    }));

    const spanishName = speciesData.names?.find((n: any) => n.language.name === 'es')?.name
      || this.capitalizeFirstLetter(pokemonData.name);

    return {
      id: pokemonData.id,
      name: this.capitalizeFirstLetter(pokemonData.name),
      spanishName,
      image: pokemonData.sprites.other['official-artwork'].front_default,
      types,
      stats,
      height: pokemonData.height,
      weight: pokemonData.weight
    };
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private translateType(type: string): string {
    const translations: Record<string, string> = {
      normal: 'Normal', fire: 'Fuego', water: 'Agua', electric: 'Eléctrico',
      grass: 'Planta', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
      ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
      rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro',
      steel: 'Acero', fairy: 'Hada'
    };
    return translations[type] || type;
  }

  private translateStat(stat: string): string {
    const translations: Record<string, string> = {
      hp: 'PS', attack: 'Ataque', defense: 'Defensa',
      'special-attack': 'At. Esp.', 'special-defense': 'Def. Esp.', speed: 'Velocidad'
    };
    return translations[stat] || stat;
  }
}
