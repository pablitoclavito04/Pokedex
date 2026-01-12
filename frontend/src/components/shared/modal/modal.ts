import { Component, Input, Output, EventEmitter, HostListener, PLATFORM_ID, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  // ============================================================================
  //                               INPUTS
  // ============================================================================
  
  // ¿Está abierto el modal?
  @Input() isOpen: boolean = false;
  
  // Título del modal
  @Input() title: string = '';
  
  // Tamaño: sm, md, lg, xl, full
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  
  // ¿Cerrar al hacer clic en el overlay?
  @Input() closeOnOverlay: boolean = true;
  
  // ¿Cerrar con tecla ESC?
  @Input() closeOnEsc: boolean = true;
  
  // ¿Mostrar botón de cerrar?
  @Input() showCloseButton: boolean = true;

  // ¿Bloquear scroll del body cuando está abierto?
  @Input() blockScroll: boolean = true;
  
  // ============================================================================
  //                               OUTPUTS
  // ============================================================================
  
  @Output() closed = new EventEmitter<void>();
  
  // ============================================================================
  //                               MÉTODOS
  // ============================================================================
  
  close(): void {
    this.closed.emit();
  }

  /**
   * Maneja clicks en el overlay
   * CONTROL DE PROPAGACIÓN: Solo cierra si el click fue directamente en el overlay,
   * no en elementos hijos (el contenido del modal)
   */
  onOverlayClick(event: Event): void {
    if (this.closeOnOverlay && event.target === event.currentTarget) {
      this.close();
    }
  }

  /**
   * Previene la propagación de clicks dentro del modal
   * Esto evita que clicks en botones o elementos internos cierren el modal
   */
  onModalContentClick(event: MouseEvent): void {
    // PREVENCIÓN DE PROPAGACIÓN: Detener la propagación para que no llegue al overlay
    event.stopPropagation();
  }

  // ============================================================================
  //                        EVENTOS GLOBALES CON @HostListener
  // ============================================================================

  /**
   * Cerrar modal con tecla ESC
   * EVENTO GLOBAL: Escucha el evento keydown.escape en todo el documento
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen && this.closeOnEsc) {
      this.close();
    }
  }

  /**
   * Prevenir scroll de la página cuando el modal está abierto
   * EVENTO GLOBAL: Escucha el evento wheel (scroll del mouse) en todo el documento
   */
  @HostListener('document:wheel', ['$event'])
  onDocumentWheel(event: WheelEvent): void {
    if (this.isOpen && this.blockScroll) {
      // PREVENCIÓN DE DEFAULT: Prevenir el scroll del body cuando el modal está abierto
      const target = event.target as HTMLElement;
      const modalElement = target.closest('.modal');

      // Si el scroll no es dentro del modal, prevenir el comportamiento por defecto
      if (!modalElement) {
        event.preventDefault();
      }
    }
  }

  /**
   * Mantener el foco dentro del modal (trap focus)
   * EVENTO GLOBAL: Escucha el evento keydown en todo el documento para capturar Tab
   */
  @HostListener('document:keydown', ['$event'])
  onTabKey(event: KeyboardEvent): void {
    // Solo procesar si es la tecla Tab y el modal está abierto
    if (!this.isOpen || event.key !== 'Tab') return;

    // Obtener todos los elementos focuseables dentro del modal
    const modalElement = document.querySelector('.modal');
    if (!modalElement) return;

    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // PREVENCIÓN DE PROPAGACIÓN: Mantener el foco dentro del modal
    if (event.shiftKey) {
      // Tab + Shift: ir hacia atrás
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: ir hacia adelante
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Maneja el cambio de tamaño de ventana
   * EVENTO GLOBAL: Escucha el evento resize en la ventana
   * Útil para ajustar el modal en dispositivos móviles cuando cambia la orientación
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.isOpen || !this.isBrowser) return;

    // Verificar si el modal necesita ajustes en viewport pequeños
    const modalElement = document.querySelector('.modal') as HTMLElement;
    if (!modalElement) return;

    // Ajustar la altura máxima del modal según el viewport
    const viewportHeight = window.innerHeight;
    const maxModalHeight = viewportHeight * 0.9; // 90% del viewport

    if (modalElement.offsetHeight > maxModalHeight) {
      modalElement.style.maxHeight = `${maxModalHeight}px`;
    }
  }

  // Prevenir scroll del body cuando el modal está abierto
  ngOnChanges(): void {
    if (this.isBrowser && this.blockScroll) {
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }
  
  get modalClasses(): string {
    return `modal modal--${this.size}`;
  }
}