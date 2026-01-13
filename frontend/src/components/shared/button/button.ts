import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './button.html',
  styleUrls: ['./button.scss']
})
export class ButtonComponent {
  // ============================================================================
  //                          HOST BINDINGS
  // ============================================================================

  // Evita que el host sea enfocable - el foco va al button/anchor interno
  @HostBinding('attr.tabindex') hostTabIndex = -1;

  // ============================================================================
  //                                INPUTS
  // ============================================================================

  // Variante del botón: primary, secondary, ghost, danger
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';

  // Tamaño del botón: sm, md, lg
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  // Tipo de botón HTML: button, submit, reset
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  // ¿Está deshabilitado?
  @Input() disabled: boolean = false;

  // ¿Está cargando?
  @Input() loading: boolean = false;

  // ¿Ancho completo?
  @Input() fullWidth: boolean = false;

  // Icono izquierdo (nombre del icono)
  @Input() iconLeft: string = '';

  // Icono derecho (nombre del icono)
  @Input() iconRight: string = '';

  // Enlace interno (usa Angular Router)
  @Input() href: string = '';

  // ============================================================================
  // OUTPUTS
  // ============================================================================

  @Output() buttonClick = new EventEmitter<Event>();

  // ============================================================================
  // MÉTODOS
  // ============================================================================

  onClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }

  // Genera las clases CSS del botón
  get buttonClasses(): string {
    const classes = ['button'];

    // Variante
    classes.push(`button--${this.variant}`);

    // Tamaño
    classes.push(`button--${this.size}`);

    // Estados
    if (this.disabled) classes.push('button--disabled');
    if (this.loading) classes.push('button--loading');
    if (this.fullWidth) classes.push('button--full-width');
    if (this.iconLeft || this.iconRight) classes.push('button--with-icon');

    return classes.join(' ');
  }

  // Determina si debe renderizar como enlace
  get isLink(): boolean {
    return !!this.href;
  }
}
