import { Component } from '@angular/core';

/**
 * ToastComponent - Componente de notificaciones toast (LEGACY)
 *
 * NOTA: Este componente ya no es necesario para mostrar toasts.
 * El ToastService ahora crea los elementos directamente en el DOM
 * usando Renderer2 (createElement, appendChild, removeChild).
 *
 * Este componente se mantiene por compatibilidad pero puede eliminarse.
 * Los toasts se muestran automáticamente gracias al ToastService.
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  template: `<!-- ToastService maneja la creación de toasts directamente en el DOM -->`,
  styles: []
})
export class ToastComponent {
  // El ToastService ahora maneja todo mediante Renderer2:
  // - createElement() para crear los elementos toast
  // - appendChild() para añadirlos al DOM
  // - removeChild() para eliminarlos
}
