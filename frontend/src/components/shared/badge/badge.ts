import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.html',
  styleUrls: ['./badge.scss']
})
export class BadgeComponent {
  // ============================================================================
  //                                 INPUTS
  // ============================================================================
  
  // Variante: primary, secondary, success, error, warning, info
  @Input() variant: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' = 'primary';
  
  // Tamaño: sm, md, lg
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  
  // ¿Es un punto/dot sin texto?
  @Input() dot: boolean = false;

  // Color de fondo personalizado
  @Input() color: string | null = null;

  // Color del texto personalizado
  @Input() textColor: string = '#ffffff';
  
  // ¿Estilo outline?
  @Input() outline: boolean = false;
  
  // ¿Es un contador de notificaciones?
  @Input() count: number | null = null;
  
  // Máximo a mostrar (ej: 99+)
  @Input() maxCount: number = 99;
  
  // ============================================================================
  //                              GETTERS
  // ============================================================================
  
  get badgeClasses(): string {
    const classes = ['badge', `badge--${this.size}`];
    if (!this.color) classes.push(`badge--${this.variant}`);
    if (this.dot) classes.push('badge--dot');
    if (this.outline) classes.push('badge--outline');
    if (this.count !== null) classes.push('badge--count');
    return classes.join(' ');
  }

  get customStyles(): Record<string, string> | null {
    if (!this.color) return null;
    return {
      'background-color': this.color,
      'color': this.textColor
    };
  }
  
  get displayCount(): string {
    if (this.count === null) return '';
    if (this.count > this.maxCount) return `${this.maxCount}+`;
    return this.count.toString();
  }
}