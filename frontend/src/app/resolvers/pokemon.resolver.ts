// ============================================================================
//          POKEMON RESOLVER - Precarga de datos de Pokémon
// ============================================================================

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Interfaz para los datos básicos del Pokémon resueltos
 */
export interface ResolvedPokemon {
  id: number;
  name: string;
  spanishName: string;
  types: string[];
  image: string;
  error?: string;
}

/**
 * Resolver que precarga los datos básicos de un Pokémon antes de navegar.
 * Esto permite mostrar información inmediatamente al entrar a la página.
 */
export const pokemonResolver: ResolveFn<ResolvedPokemon | null> = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const id = route.paramMap.get('id');

  // Validar ID
  if (!id || isNaN(Number(id)) || Number(id) < 1 || Number(id) > 1025) {
    router.navigate(['/pokedex'], {
      state: { error: `ID de Pokémon inválido: ${id}` }
    });
    return of(null);
  }

  const pokemonId = Number(id);

  // Cargar datos básicos y especie en paralelo
  return forkJoin({
    pokemon: http.get<any>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`),
    species: http.get<any>(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
  }).pipe(
    map(({ pokemon, species }) => {
      // Obtener nombre en español
      const spanishName = species.names?.find((n: any) => n.language.name === 'es')?.name
        || pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

      return {
        id: pokemon.id,
        name: pokemon.name,
        spanishName,
        types: pokemon.types.map((t: any) => t.type.name),
        image: pokemon.sprites.other['official-artwork'].front_default
      };
    }),
    catchError(error => {
      console.error('Error en pokemonResolver:', error);
      router.navigate(['/pokedex'], {
        state: { error: `No se pudo cargar el Pokémon con ID ${id}` }
      });
      return of(null);
    })
  );
};
