import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrls: ['./alert.scss']
})
export class AlertComponent {
  // ============================================================================
  //                                INPUTS
  // ============================================================================
  
  // Tipo de alerta: success, error, warning, info
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  
  // Título de la alerta (opcional)
  @Input() title: string = '';
  
  // Mensaje de la alerta
  @Input() message: string = '';
  
  // ¿Mostrar botón de cerrar?
  @Input() dismissible: boolean = true;
  
  // ¿Mostrar icono?
  @Input() showIcon: boolean = true;

  // ¿Usar variante compacta con Container Queries?
  @Input() compact: boolean = false;
  
  // ============================================================================
  //                                 ESTADO
  // ============================================================================
  
  isVisible: boolean = true;
  
  // ============================================================================
  //                                OUTPUTS
  // ============================================================================
  
  @Output() closed = new EventEmitter<void>();
  
  // ============================================================================
  //                               MÉTODOS
  // ============================================================================
  
  close(): void {
    this.isVisible = false;
    this.closed.emit();
  }
  
  // Genera las clases CSS
  get alertClasses(): string {
    const classes = ['alert', `alert--${this.type}`];
    if (this.dismissible) classes.push('alert--dismissible');
    if (this.compact) classes.push('alert--compact');
    return classes.join(' ');
  }
  
  // Título por defecto según el tipo
  get defaultTitle(): string {
    const titles: Record<string, string> = {
      success: '¡Éxito!',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información'
    };
    return this.title || titles[this.type];
  }
}