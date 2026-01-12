import { Component, Renderer2, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * COMPONENTE 2: TOAST CONTAINER
 * Demuestra creación y eliminación automática de notificaciones
 */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.html',
  styleUrls: ['./toast-container.scss']
})
export class ToastContainerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('toastContainer', { read: ElementRef }) toastContainer!: ElementRef;

  private createdToasts: any[] = [];
  private timeoutIds: any[] = [];
  toastCount = 0;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Mostrar un toast de bienvenida
    setTimeout(() => {
      this.showToast('¡Sistema de notificaciones listo!', 'success');
    }, 500);
  }

  /**
   * DEMOSTRACIÓN: createElement() + appendChild() + removeChild()
   * Crea una notificación toast que se elimina automáticamente
   */
  showToast(message: string, type: 'success' | 'info' | 'warning' | 'error'): void {
    // 1. Crear elemento toast
    const toast = this.renderer.createElement('div');
    this.renderer.addClass(toast, 'toast');
    this.renderer.addClass(toast, `toast--${type}`);

    // 2. Crear icono
    const icon = this.renderer.createElement('span');
    this.renderer.addClass(icon, 'toast__icon');
    const iconText = this.renderer.createText(this.getIcon(type));
    this.renderer.appendChild(icon, iconText);

    // 3. Crear mensaje
    const messageEl = this.renderer.createElement('span');
    this.renderer.addClass(messageEl, 'toast__message');
    const messageText = this.renderer.createText(message);
    this.renderer.appendChild(messageEl, messageText);

    // 4. Crear botón de cerrar
    const closeBtn = this.renderer.createElement('button');
    this.renderer.addClass(closeBtn, 'toast__close');
    const closeText = this.renderer.createText('×');
    this.renderer.appendChild(closeBtn, closeText);

    // 5. Event listener para cerrar manualmente
    this.renderer.listen(closeBtn, 'click', () => {
      this.removeToast(toast);
    });

    // 6. Ensamblar
    this.renderer.appendChild(toast, icon);
    this.renderer.appendChild(toast, messageEl);
    this.renderer.appendChild(toast, closeBtn);

    // 7. Agregar al DOM con animación
    this.renderer.setStyle(toast, 'opacity', '0');
    this.renderer.setStyle(toast, 'transform', 'translateX(100%)');
    this.renderer.appendChild(this.toastContainer.nativeElement, toast);

    setTimeout(() => {
      this.renderer.setStyle(toast, 'opacity', '1');
      this.renderer.setStyle(toast, 'transform', 'translateX(0)');
    }, 10);

    // 8. Guardar referencia
    this.createdToasts.push(toast);
    this.toastCount++;

    // 9. Eliminar automáticamente después de 3 segundos
    const timeoutId = setTimeout(() => {
      this.removeToast(toast);
    }, 3000);

    this.timeoutIds.push(timeoutId);

    console.log(`✓ Toast ${type} creado con Renderer2`);
  }

  /**
   * DEMOSTRACIÓN: removeChild()
   * Elimina un toast del DOM
   */
  removeToast(toast: any): void {
    // Animar salida
    this.renderer.setStyle(toast, 'opacity', '0');
    this.renderer.setStyle(toast, 'transform', 'translateX(100%)');

    setTimeout(() => {
      if (toast.parentNode === this.toastContainer.nativeElement) {
        // Eliminar del DOM
        this.renderer.removeChild(this.toastContainer.nativeElement, toast);

        // Eliminar de referencias
        const index = this.createdToasts.indexOf(toast);
        if (index > -1) {
          this.createdToasts.splice(index, 1);
        }

        this.toastCount--;
        console.log('✓ Toast eliminado con Renderer2.removeChild()');
      }
    }, 300);
  }

  /**
   * Métodos de conveniencia para diferentes tipos de toast
   */
  showSuccess(): void {
    this.showToast('¡Operación exitosa!', 'success');
  }

  showInfo(): void {
    this.showToast('Información importante', 'info');
  }

  showWarning(): void {
    this.showToast('Advertencia: Revisa esto', 'warning');
  }

  showError(): void {
    this.showToast('Error: Algo salió mal', 'error');
  }

  /**
   * Retorna el icono según el tipo
   */
  private getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '✓',
      info: 'ℹ',
      warning: '⚠',
      error: '✕'
    };
    return icons[type] || 'ℹ';
  }

  /**
   * DEMOSTRACIÓN: Limpieza en ngOnDestroy()
   */
  ngOnDestroy(): void {
    console.log('🧹 ToastContainer: Limpiando toasts y timers...');

    // Limpiar todos los timeouts
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.timeoutIds = [];

    // Eliminar todos los toasts
    this.createdToasts.forEach(toast => {
      if (toast && toast.parentNode) {
        this.renderer.removeChild(toast.parentNode, toast);
      }
    });

    this.createdToasts = [];
    console.log('✓ ToastContainer: Limpieza completada');
  }
}
