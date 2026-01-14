import { Injectable, Inject, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

/**
 * Interfaz para mensajes de toast
 */
export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
  element?: HTMLElement;
}

/**
 * ToastService - Servicio de notificaciones con manipulación directa del DOM
 *
 * Implementa createElement(), appendChild() y removeChild() usando Renderer2
 * para crear y eliminar toasts dinámicamente.
 *
 * Características:
 * - Crea elementos DOM dinámicamente con Renderer2
 * - Elimina elementos correctamente cuando expiran o se cierran
 * - SSR-safe con verificación de plataforma
 * - Gestión de múltiples toasts simultáneos
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private renderer: Renderer2;
  private isBrowser: boolean;
  private container: HTMLElement | null = null;
  private toasts: ToastMessage[] = [];
  private idCounter = 0;
  private timeoutIds: Map<number, any> = new Map();

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    // Crear Renderer2 usando RendererFactory2 (necesario en servicios)
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isBrowser = isPlatformBrowser(platformId);

    // Crear contenedor de toasts al inicializar
    if (this.isBrowser) {
      this.createContainer();
    }
  }

  /**
   * Crea el contenedor principal de toasts usando Renderer2
   * Usa: renderer.createElement(), renderer.addClass(), renderer.appendChild()
   */
  private createContainer(): void {
    if (this.container) return;

    // Renderer2.createElement() - Crear elemento div para el contenedor
    this.container = this.renderer.createElement('div');

    // Renderer2.addClass() - Añadir clase CSS al contenedor
    this.renderer.addClass(this.container, 'toast-container');
    this.renderer.addClass(this.container, 'toast-container--top-right');

    // Renderer2.setStyle() - Establecer estilos del contenedor
    this.renderer.setStyle(this.container, 'position', 'fixed');
    this.renderer.setStyle(this.container, 'top', '80px');
    this.renderer.setStyle(this.container, 'right', '20px');
    this.renderer.setStyle(this.container, 'z-index', '9999');
    this.renderer.setStyle(this.container, 'display', 'flex');
    this.renderer.setStyle(this.container, 'flex-direction', 'column');
    this.renderer.setStyle(this.container, 'gap', '10px');
    this.renderer.setStyle(this.container, 'max-width', '350px');
    this.renderer.setStyle(this.container, 'pointer-events', 'none');

    // Renderer2.appendChild() - Añadir contenedor al body
    this.renderer.appendChild(this.document.body, this.container);
  }

  /**
   * Muestra un toast creando elementos DOM dinámicamente
   * Usa: renderer.createElement(), renderer.addClass(), renderer.appendChild(), renderer.createText()
   */
  show(message: string, type: ToastMessage['type'] = 'info', duration = 5000): void {
    if (!this.isBrowser) return;

    // Crear contenedor si no existe (lazy initialization)
    if (!this.container) {
      this.createContainer();
    }

    if (!this.container) return;

    const id = ++this.idCounter;

    // ========== CREAR ELEMENTO TOAST ==========
    // Renderer2.createElement() - Crear elemento principal del toast
    const toastElement = this.renderer.createElement('div');
    this.renderer.addClass(toastElement, 'toast');
    this.renderer.addClass(toastElement, `toast--${type}`);
    this.renderer.setStyle(toastElement, 'display', 'flex');
    this.renderer.setStyle(toastElement, 'align-items', 'center');
    this.renderer.setStyle(toastElement, 'gap', '12px');
    this.renderer.setStyle(toastElement, 'padding', '14px 18px');
    this.renderer.setStyle(toastElement, 'border-radius', '8px');
    this.renderer.setStyle(toastElement, 'box-shadow', '0 4px 12px rgba(0, 0, 0, 0.15)');
    this.renderer.setStyle(toastElement, 'pointer-events', 'auto');
    this.renderer.setStyle(toastElement, 'animation', 'toastSlideIn 0.3s ease-out');
    this.renderer.setStyle(toastElement, 'cursor', 'pointer');

    // Colores según tipo
    const colors = {
      success: { bg: '#10B981', icon: '✓' },
      error: { bg: '#EF4444', icon: '✕' },
      warning: { bg: '#F59E0B', icon: '⚠' },
      info: { bg: '#3B82F6', icon: 'ℹ' }
    };

    this.renderer.setStyle(toastElement, 'background-color', colors[type].bg);
    this.renderer.setStyle(toastElement, 'color', 'white');

    // ========== CREAR ICONO ==========
    // Renderer2.createElement() - Crear span para el icono
    const iconElement = this.renderer.createElement('span');
    this.renderer.addClass(iconElement, 'toast__icon');
    this.renderer.setStyle(iconElement, 'font-size', '18px');
    this.renderer.setStyle(iconElement, 'font-weight', 'bold');

    // Renderer2.createText() - Crear nodo de texto para el icono
    const iconText = this.renderer.createText(colors[type].icon);
    this.renderer.appendChild(iconElement, iconText);

    // ========== CREAR MENSAJE ==========
    // Renderer2.createElement() - Crear span para el mensaje
    const messageElement = this.renderer.createElement('span');
    this.renderer.addClass(messageElement, 'toast__message');
    this.renderer.setStyle(messageElement, 'flex', '1');
    this.renderer.setStyle(messageElement, 'font-size', '14px');
    this.renderer.setStyle(messageElement, 'line-height', '1.4');

    // Renderer2.createText() - Crear nodo de texto para el mensaje
    const messageText = this.renderer.createText(message);
    this.renderer.appendChild(messageElement, messageText);

    // ========== CREAR BOTÓN CERRAR ==========
    // Renderer2.createElement() - Crear botón de cierre
    const closeButton = this.renderer.createElement('button');
    this.renderer.addClass(closeButton, 'toast__close');
    this.renderer.setStyle(closeButton, 'background', 'transparent');
    this.renderer.setStyle(closeButton, 'border', 'none');
    this.renderer.setStyle(closeButton, 'color', 'white');
    this.renderer.setStyle(closeButton, 'cursor', 'pointer');
    this.renderer.setStyle(closeButton, 'font-size', '18px');
    this.renderer.setStyle(closeButton, 'opacity', '0.8');
    this.renderer.setStyle(closeButton, 'padding', '0');
    this.renderer.setStyle(closeButton, 'line-height', '1');

    const closeText = this.renderer.createText('×');
    this.renderer.appendChild(closeButton, closeText);

    // Renderer2.listen() - Añadir evento click al botón cerrar
    this.renderer.listen(closeButton, 'click', (event: Event) => {
      event.stopPropagation();
      this.dismiss(id);
    });

    // ========== ENSAMBLAR TOAST ==========
    // Renderer2.appendChild() - Añadir elementos hijos al toast
    this.renderer.appendChild(toastElement, iconElement);
    this.renderer.appendChild(toastElement, messageElement);
    this.renderer.appendChild(toastElement, closeButton);

    // Renderer2.appendChild() - Añadir toast al contenedor
    this.renderer.appendChild(this.container, toastElement);

    // Guardar referencia del toast
    const toast: ToastMessage = { id, message, type, duration, element: toastElement };
    this.toasts.push(toast);

    // Auto-dismiss después de la duración
    if (duration > 0) {
      const timeoutId = setTimeout(() => this.dismiss(id), duration);
      this.timeoutIds.set(id, timeoutId);
    }
  }

  /**
   * Elimina un toast del DOM
   * Usa: renderer.removeChild()
   */
  dismiss(id: number): void {
    const toastIndex = this.toasts.findIndex(t => t.id === id);
    if (toastIndex === -1) return;

    const toast = this.toasts[toastIndex];

    // Limpiar timeout si existe
    if (this.timeoutIds.has(id)) {
      clearTimeout(this.timeoutIds.get(id));
      this.timeoutIds.delete(id);
    }

    // Animar salida
    if (toast.element) {
      this.renderer.setStyle(toast.element, 'animation', 'toastSlideOut 0.3s ease-in forwards');

      // Renderer2.removeChild() - Eliminar elemento del DOM después de la animación
      setTimeout(() => {
        if (toast.element && this.container) {
          this.renderer.removeChild(this.container, toast.element);
        }
      }, 300);
    }

    // Eliminar de la lista
    this.toasts.splice(toastIndex, 1);
  }

  /**
   * Elimina todos los toasts
   * Usa: renderer.removeChild() en bucle
   */
  dismissAll(): void {
    // Limpiar todos los timeouts
    this.timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    this.timeoutIds.clear();

    // Renderer2.removeChild() - Eliminar todos los elementos
    this.toasts.forEach(toast => {
      if (toast.element && this.container) {
        this.renderer.removeChild(this.container, toast.element);
      }
    });

    this.toasts = [];
  }

  // ========== MÉTODOS DE CONVENIENCIA ==========

  /**
   * Muestra un toast de éxito
   */
  success(message: string, duration = 4000): void {
    this.show(message, 'success', duration);
  }

  /**
   * Muestra un toast de error
   */
  error(message: string, duration = 8000): void {
    this.show(message, 'error', duration);
  }

  /**
   * Muestra un toast informativo
   */
  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  /**
   * Muestra un toast de advertencia
   */
  warning(message: string, duration = 6000): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Limpieza del servicio - Eliminar contenedor y todos los toasts
   * Gestión correcta del ciclo de vida
   */
  destroy(): void {
    this.dismissAll();

    // Renderer2.removeChild() - Eliminar contenedor del body
    if (this.container && this.isBrowser) {
      this.renderer.removeChild(this.document.body, this.container);
      this.container = null;
    }
  }
}
