import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * LoadingService - Servicio de gestión de estados de carga
 *
 * Permite mostrar/ocultar un spinner global durante operaciones async.
 * Soporta múltiples peticiones concurrentes con contador de requests.
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  private messageSubject = new BehaviorSubject<string>('Cargando...');
  public message$: Observable<string> = this.messageSubject.asObservable();

  private requestCount = 0;

  /**
   * Indica si hay alguna operación en curso
   */
  get isLoading(): boolean {
    return this.loadingSubject.getValue();
  }

  /**
   * Muestra el spinner de carga
   * Incrementa el contador de peticiones
   * @param message Mensaje personalizado (opcional)
   */
  show(message: string = 'Cargando...'): void {
    this.requestCount++;
    this.messageSubject.next(message);
    this.loadingSubject.next(true);
  }

  /**
   * Oculta el spinner de carga
   * Solo oculta cuando todas las peticiones han terminado
   */
  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
    }
  }

  /**
   * Fuerza la ocultación del spinner
   * Útil para casos de error o reset
   */
  forceHide(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }

  /**
   * Obtiene el número de peticiones activas
   */
  getActiveRequests(): number {
    return this.requestCount;
  }
}
