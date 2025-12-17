import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../services/toast.service';

/**
 * ToastComponent - Componente de notificaciones toast
 *
 * Se suscribe al ToastService y muestra los mensajes automáticamente.
 * Soporta múltiples toasts simultáneos con animaciones.
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts$ = this.toastService.toasts$;

  /**
   * Cierra un toast específico
   * @param id ID del toast a cerrar
   */
  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  /**
   * Obtiene el icono según el tipo de toast
   * @param type Tipo de toast
   */
  getIcon(type: ToastMessage['type']): string {
    const icons: Record<ToastMessage['type'], string> = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'alert-triangle',
      info: 'info'
    };
    return icons[type];
  }

  /**
   * TrackBy para optimizar el rendering de la lista
   */
  trackByToastId(_index: number, toast: ToastMessage): number {
    return toast.id;
  }
}
