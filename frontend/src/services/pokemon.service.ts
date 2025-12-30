import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, map, tap, of } from 'rxjs';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';

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
 * Respuesta de la PokeAPI para un Pokémon
 */
interface PokeApiResponse {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
}

/**
 * PokemonService - Servicio de lógica de negocio para Pokémon
 */
@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);

  private readonly API_URL = 'https://pokeapi.co/api/v2/pokemon';

  // Cache de Pokémon para evitar llamadas repetidas
  private pokemonCache = new Map<number, Pokemon>();

  // Estado del Pokémon actual
  private currentPokemonSubject = new BehaviorSubject<Pokemon | null>(null);
  public currentPokemon$ = this.currentPokemonSubject.asObservable();

  // Estado de carga específico del servicio
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

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

  // Mapa de nombres de stats en español
  private readonly statNames: Record<string, string> = {
    'hp': 'PS',
    'attack': 'Ataque',
    'defense': 'Defensa',
    'special-attack': 'At. Esp.',
    'special-defense': 'Def. Esp.',
    'speed': 'Velocidad'
  };

  // Mapa de nombres de tipos en español
  private readonly typeNamesSpanish: Record<string, string> = {
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

  /**
   * Obtiene un Pokémon por su ID
   */
  getPokemonById(id: number): Observable<Pokemon> {
    if (this.pokemonCache.has(id)) {
      const cached = this.pokemonCache.get(id)!;
      this.currentPokemonSubject.next(cached);
      return of(cached);
    }

    this.isLoadingSubject.next(true);
    this.loadingService.show();

    return this.http.get<PokeApiResponse>(`${this.API_URL}/${id}`).pipe(
      map(response => this.transformPokemonData(response)),
      tap(pokemon => {
        this.pokemonCache.set(id, pokemon);
        this.currentPokemonSubject.next(pokemon);
        this.isLoadingSubject.next(false);
        this.loadingService.hide();
      }),
      catchError(error => {
        this.isLoadingSubject.next(false);
        this.loadingService.hide();
        this.toastService.error(`Error al cargar el Pokémon #${id}`);
        console.error('Error fetching Pokemon:', error);
        throw error;
      })
    );
  }

  /**
   * Obtiene un Pokémon por su nombre
   */
  getPokemonByName(name: string): Observable<Pokemon> {
    this.isLoadingSubject.next(true);
    this.loadingService.show();

    return this.http.get<PokeApiResponse>(`${this.API_URL}/${name.toLowerCase()}`).pipe(
      map(response => this.transformPokemonData(response)),
      tap(pokemon => {
        this.pokemonCache.set(pokemon.id, pokemon);
        this.currentPokemonSubject.next(pokemon);
        this.isLoadingSubject.next(false);
        this.loadingService.hide();
      }),
      catchError(error => {
        this.isLoadingSubject.next(false);
        this.loadingService.hide();
        this.toastService.error(`Error al cargar el Pokémon "${name}"`);
        console.error('Error fetching Pokemon:', error);
        throw error;
      })
    );
  }

  /**
   * Obtiene una lista de Pokémon con paginación
   */
  getPokemonList(offset: number = 0, limit: number = 20): Observable<Pokemon[]> {
    this.isLoadingSubject.next(true);

    return this.http.get<{ results: { name: string; url: string }[] }>(
      `${this.API_URL}?offset=${offset}&limit=${limit}`
    ).pipe(
      map(response => {
        return response.results.map(p => {
          const urlParts = p.url.split('/');
          const id = parseInt(urlParts[urlParts.length - 2]);
          return {
            id,
            name: this.capitalizeFirstLetter(this.cleanPokemonName(p.name)),
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            types: [],
            stats: [],
            height: 0,
            weight: 0
          } as Pokemon;
        });
      }),
      tap(() => this.isLoadingSubject.next(false)),
      catchError(error => {
        this.isLoadingSubject.next(false);
        this.toastService.error('Error al cargar los Pokémon');
        console.error('Error fetching Pokemon list:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene la lista completa de todos los Pokémon (solo nombres e IDs)
   */
  getAllPokemonNames(): Observable<{id: number, name: string}[]> {
    return this.http.get<{ results: { name: string; url: string }[] }>(
      `${this.API_URL}?limit=1025`
    ).pipe(
      map(response => {
        return response.results.map(p => {
          const urlParts = p.url.split('/');
          const id = parseInt(urlParts[urlParts.length - 2]);
          return {
            id,
            name: this.capitalizeFirstLetter(this.cleanPokemonName(p.name))
          };
        });
      }),
      catchError(error => {
        console.error('Error fetching all Pokemon names:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene los detalles completos de un Pokémon (incluye tipos)
   */
  getPokemonDetails(id: number): Observable<Pokemon> {
    if (this.pokemonCache.has(id)) {
      return of(this.pokemonCache.get(id)!);
    }

    return this.http.get<PokeApiResponse>(`${this.API_URL}/${id}`).pipe(
      map(response => this.transformPokemonData(response)),
      tap(pokemon => this.pokemonCache.set(id, pokemon)),
      catchError(error => {
        console.error('Error fetching Pokemon details:', error);
        throw error;
      })
    );
  }

  /**
   * Busca Pokémon por nombre o número
   */
  searchPokemon(query: string, pokemonList: any[]): any[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return pokemonList;

    return pokemonList.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.id.toString().includes(lowerQuery)
    );
  }

  /**
   * Transforma los datos de la API al formato de la aplicación
   */
  private transformPokemonData(response: PokeApiResponse): Pokemon {
    return {
      id: response.id,
      name: this.capitalizeFirstLetter(this.cleanPokemonName(response.name)),
      image: response.sprites.other['official-artwork'].front_default,
      types: response.types.map(t => ({
        name: this.capitalizeFirstLetter(t.type.name),
        color: this.typeColors[t.type.name] || '#777777'
      })),
      stats: response.stats.map(s => ({
        name: this.statNames[s.stat.name] || s.stat.name,
        value: s.base_stat
      })),
      height: response.height / 10,
      weight: response.weight / 10
    };
  }

  /**
   * Capitaliza la primera letra de un string
   */
  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Limpia el nombre del Pokémon eliminando sufijos de forma
   */
  private cleanPokemonName(name: string): string {
    // Lista de sufijos de forma que deben eliminarse
    const formSuffixes = [
      '-altered', '-origin', '-land', '-sky', '-normal', '-attack', '-defense', '-speed',
      '-plant', '-sandy', '-trash', '-heat', '-wash', '-frost', '-fan', '-mow',
      '-standard', '-zen', '-ordinary', '-resolute', '-aria', '-pirouette',
      '-incarnate', '-therian', '-black', '-white', '-50', '-10',
      '-average', '-small', '-large', '-super', '-confined', '-unbound',
      '-baile', '-pom-pom', '-pau', '-sensu', '-midday', '-midnight', '-dusk',
      '-solo', '-school', '-meteor', '-core', '-disguised', '-busted',
      '-red-striped', '-blue-striped', '-shield', '-blade', '-male', '-female',
      '-single-strike', '-rapid-strike', '-ice', '-shadow', '-hero',
      '-full-belly', '-hangry', '-green-plumage', '-yellow-plumage', '-blue-plumage', '-white-plumage',
      '-chest', '-roaming', '-combat', '-blaze', '-aqua',
      '-family-of-three', '-family-of-four', '-curly', '-droopy', '-stretchy',
      '-three-segment', '-four-segment', '-zero', '-counterfeit', '-artisan', '-masterpiece'
    ];

    let cleanName = name.toLowerCase();
    for (const suffix of formSuffixes) {
      if (cleanName.endsWith(suffix)) {
        cleanName = cleanName.replace(suffix, '');
        break;
      }
    }
    return cleanName;
  }

  /**
   * Obtiene el color de un tipo
   */
  getTypeColor(typeName: string): string {
    return this.typeColors[typeName.toLowerCase()] || '#777777';
  }

  /**
   * Obtiene el nombre en español de un tipo
   */
  getTypeNameSpanish(typeName: string): string {
    return this.typeNamesSpanish[typeName.toLowerCase()] || typeName;
  }

  /**
   * Obtiene el Pokémon actual sin hacer una nueva petición
   */
  getCurrentPokemon(): Pokemon | null {
    return this.currentPokemonSubject.getValue();
  }

  /**
   * Limpia el Pokémon actual
   */
  clearCurrentPokemon(): void {
    this.currentPokemonSubject.next(null);
  }

  /**
   * Limpia el cache de Pokémon
   */
  clearCache(): void {
    this.pokemonCache.clear();
  }
}