// ============================================================================
//          SEARCH HISTORY SERVICE - Gestión del historial de búsquedas
// ============================================================================

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchHistoryService {
  private readonly STORAGE_KEY = 'pokemon_search_history';
  private readonly MAX_HISTORY_ITEMS = 6;

  /**
   * Obtiene el historial de búsquedas
   * @returns Array de búsquedas recientes (más reciente primero)
   */
  getHistory(): string[] {
    const history = localStorage.getItem(this.STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  }

  /**
   * Añade una búsqueda al historial
   * @param query Término de búsqueda
   */
  addSearch(query: string): void {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    let history = this.getHistory();

    // Eliminar si ya existe (para moverlo al principio)
    history = history.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase());

    // Añadir al principio
    history.unshift(trimmedQuery);

    // Mantener solo los últimos MAX_HISTORY_ITEMS
    if (history.length > this.MAX_HISTORY_ITEMS) {
      history = history.slice(0, this.MAX_HISTORY_ITEMS);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  /**
   * Elimina todo el historial de búsquedas
   */
  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Verifica si hay historial de búsquedas
   */
  hasHistory(): boolean {
    return this.getHistory().length > 0;
  }
}
