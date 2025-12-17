import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * CommunicationService - Servicio de comunicación entre componentes
 *
 * Permite compartir datos y notificaciones entre componentes hermanos
 * o no relacionados mediante inyección de dependencias.
 *
 * Usa BehaviorSubject para mantener el último valor emitido,
 * permitiendo suscripciones tardías.
 */
@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  // Subject para notificaciones generales
  private notificationSubject = new BehaviorSubject<string>('');
  public notifications$: Observable<string> = this.notificationSubject.asObservable();

  // Subject para datos compartidos genéricos
  private dataSubject = new BehaviorSubject<any>(null);
  public sharedData$: Observable<any> = this.dataSubject.asObservable();

  // Subject para el Pokémon seleccionado
  private selectedPokemonSubject = new BehaviorSubject<number | null>(null);
  public selectedPokemon$: Observable<number | null> = this.selectedPokemonSubject.asObservable();

  // Subject para filtros de búsqueda
  private searchFilterSubject = new BehaviorSubject<string>('');
  public searchFilter$: Observable<string> = this.searchFilterSubject.asObservable();

  /**
   * Envía una notificación a todos los suscriptores
   * @param message Mensaje de notificación
   */
  sendNotification(message: string): void {
    this.notificationSubject.next(message);
  }

  /**
   * Obtiene el último valor de notificación
   */
  getLastNotification(): string {
    return this.notificationSubject.getValue();
  }

  /**
   * Comparte datos entre componentes
   * @param data Datos a compartir
   */
  setSharedData(data: any): void {
    this.dataSubject.next(data);
  }

  /**
   * Obtiene los datos compartidos actuales
   */
  getSharedData(): any {
    return this.dataSubject.getValue();
  }

  /**
   * Selecciona un Pokémon por su ID
   * @param pokemonId ID del Pokémon seleccionado
   */
  selectPokemon(pokemonId: number | null): void {
    this.selectedPokemonSubject.next(pokemonId);
  }

  /**
   * Obtiene el ID del Pokémon actualmente seleccionado
   */
  getSelectedPokemon(): number | null {
    return this.selectedPokemonSubject.getValue();
  }

  /**
   * Actualiza el filtro de búsqueda
   * @param filter Texto del filtro
   */
  setSearchFilter(filter: string): void {
    this.searchFilterSubject.next(filter);
  }

  /**
   * Obtiene el filtro de búsqueda actual
   */
  getSearchFilter(): string {
    return this.searchFilterSubject.getValue();
  }

  /**
   * Limpia todos los estados del servicio
   */
  clearAll(): void {
    this.notificationSubject.next('');
    this.dataSubject.next(null);
    this.selectedPokemonSubject.next(null);
    this.searchFilterSubject.next('');
  }
}
