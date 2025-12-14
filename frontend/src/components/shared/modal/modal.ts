import { Component, Input, Output, EventEmitter, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss']
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
  
  onOverlayClick(event: Event): void {
    if (this.closeOnOverlay && event.target === event.currentTarget) {
      this.close();
    }
  }
  
  // Cerrar con ESC
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen && this.closeOnEsc) {
      this.close();
    }
  }
  
  // Prevenir scroll del body cuando el modal está abierto
  ngOnChanges(): void {
    if (this.isBrowser) {
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