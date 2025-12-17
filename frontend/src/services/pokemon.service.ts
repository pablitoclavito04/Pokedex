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
 *
 * Este servicio demuestra la separación de responsabilidades:
 * - Encapsula toda la lógica de acceso a datos (API calls)
 * - Transforma los datos de la API al formato de la aplicación
 * - Maneja el estado de carga y errores
 * - Los componentes solo se preocupan por la presentación
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

  /**
   * Obtiene un Pokémon por su ID
   * Demuestra: encapsulación de lógica de API, transformación de datos, manejo de errores
   */
  getPokemonById(id: number): Observable<Pokemon> {
    // Verificar cache primero
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
   * Transforma los datos de la API al formato de la aplicación
   * Esta es la lógica de negocio que NO debe estar en los componentes
   */
  private transformPokemonData(response: PokeApiResponse): Pokemon {
    return {
      id: response.id,
      name: this.capitalizeFirstLetter(response.name),
      image: response.sprites.other['official-artwork'].front_default,
      types: response.types.map(t => ({
        name: this.capitalizeFirstLetter(t.type.name),
        color: this.typeColors[t.type.name] || '#777777'
      })),
      stats: response.stats.map(s => ({
        name: this.statNames[s.stat.name] || s.stat.name,
        value: s.base_stat
      })),
      height: response.height / 10, // Convertir a metros
      weight: response.weight / 10  // Convertir a kg
    };
  }

  /**
   * Capitaliza la primera letra de un string
   */
  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
