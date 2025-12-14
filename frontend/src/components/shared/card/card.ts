import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrls: ['./card.scss']
})
export class CardComponent {
  // ============================================================================
  //                                INPUTS
  // ============================================================================
  
  // Variante: vertical (default), horizontal
  @Input() variant: 'vertical' | 'horizontal' = 'vertical';
  
  // URL de la imagen
  @Input() imageUrl: string = '';
  
  // Alt de la imagen
  @Input() imageAlt: string = '';
  
  // Título de la card
  @Input() title: string = '';
  
  // Subtítulo o metadata
  @Input() subtitle: string = '';
  
  // Descripción
  @Input() description: string = '';
  
  // Texto del botón de acción
  @Input() actionText: string = '';
  
  // ¿Es clickeable toda la card?
  @Input() clickable: boolean = false;
  
  // ¿Mostrar sombra elevada?
  @Input() elevated: boolean = false;
  
  // ============================================================================
  //                                OUTPUTS
  // ============================================================================
  
  @Output() cardClick = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<void>();
  
  // ============================================================================
  //                                MÉTODOS
  // ============================================================================
  
  onCardClick(): void {
    if (this.clickable) {
      this.cardClick.emit();
    }
  }
  
  onActionClick(event: Event): void {
    event.stopPropagation();
    this.actionClick.emit();
  }
  
  // Genera las clases CSS
  get cardClasses(): string {
    const classes = ['card'];
    
    classes.push(`card--${this.variant}`);
    
    if (this.clickable) classes.push('card--clickable');
    if (this.elevated) classes.push('card--elevated');
    if (this.imageUrl) classes.push('card--has-image');
    
    return classes.join(' ');
  }
}