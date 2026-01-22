// ============================================================================
//          POKEMON OF THE DAY SERVICE - Gestión del Pokémon del día
// ============================================================================

import { Injectable } from '@angular/core';

interface PokemonOfDay {
  id: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonOfDayService {
  private readonly STORAGE_KEY = 'pokemon_of_day';
  private readonly TOTAL_POKEMON = 1025;
  private readonly DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

  /**
   * Obtiene el ID del Pokémon del día
   * Si han pasado más de 24 horas, genera uno nuevo
   */
  getPokemonOfDayId(): number {
    const stored = this.getStoredPokemon();
    const now = Date.now();

    // Si no hay Pokémon guardado o han pasado más de 24 horas
    if (!stored || (now - stored.timestamp) >= this.DAY_IN_MS) {
      const newPokemon = this.generateNewPokemon();
      this.storePokemon(newPokemon);
      return newPokemon.id;
    }

    return stored.id;
  }

  /**
   * Obtiene el tiempo restante hasta el próximo Pokémon del día
   * @returns Objeto con horas, minutos y segundos restantes
   */
  getTimeUntilNextPokemon(): { hours: number; minutes: number; seconds: number } {
    const stored = this.getStoredPokemon();

    if (!stored) {
      return { hours: 24, minutes: 0, seconds: 0 };
    }

    const now = Date.now();
    const elapsed = now - stored.timestamp;
    const remaining = Math.max(0, this.DAY_IN_MS - elapsed);

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }

  /**
   * Genera un nuevo Pokémon aleatorio
   */
  private generateNewPokemon(): PokemonOfDay {
    const randomId = Math.floor(Math.random() * this.TOTAL_POKEMON) + 1;
    return {
      id: randomId,
      timestamp: Date.now()
    };
  }

  /**
   * Obtiene el Pokémon guardado en localStorage
   */
  private getStoredPokemon(): PokemonOfDay | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Guarda el Pokémon en localStorage
   */
  private storePokemon(pokemon: PokemonOfDay): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pokemon));
  }
}
