import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Interfaz para mensajes de toast
 */
export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

/**
 * ToastService - Servicio centralizado de notificaciones
 *
 * Permite mostrar mensajes toast desde cualquier componente.
 * Soporta múltiples toasts simultáneos y auto-dismiss configurable.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$: Observable<ToastMessage[]> = this.toastsSubject.asObservable();

  private idCounter = 0;

  /**
   * Muestra un toast genérico
   * @param message Mensaje a mostrar
   * @param type Tipo de toast
   * @param duration Duración en ms (0 = sin auto-dismiss)
   */
  show(message: string, type: ToastMessage['type'], duration = 5000): void {
    const toast: ToastMessage = {
      id: ++this.idCounter,
      message,
      type,
      duration
    };

    const currentToasts = this.toastsSubject.getValue();
    this.toastsSubject.next([...currentToasts, toast]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(toast.id), duration);
    }
  }

  /**
   * Muestra un toast de éxito
   * @param message Mensaje a mostrar
   * @param duration Duración en ms (default: 4000)
   */
  success(message: string, duration = 4000): void {
    this.show(message, 'success', duration);
  }

  /**
   * Muestra un toast de error
   * @param message Mensaje a mostrar
   * @param duration Duración en ms (default: 8000)
   */
  error(message: string, duration = 8000): void {
    this.show(message, 'error', duration);
  }

  /**
   * Muestra un toast informativo
   * @param message Mensaje a mostrar
   * @param duration Duración en ms (default: 3000)
   */
  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  /**
   * Muestra un toast de advertencia
   * @param message Mensaje a mostrar
   * @param duration Duración en ms (default: 6000)
   */
  warning(message: string, duration = 6000): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Cierra un toast específico por su ID
   * @param id ID del toast a cerrar
   */
  dismiss(id: number): void {
    const currentToasts = this.toastsSubject.getValue();
    this.toastsSubject.next(currentToasts.filter(t => t.id !== id));
  }

  /**
   * Cierra todos los toasts
   */
  dismissAll(): void {
    this.toastsSubject.next([]);
  }
}
