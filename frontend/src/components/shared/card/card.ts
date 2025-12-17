import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Interfaz para tipos de Pokémon
 */
export interface PokemonType {
  name: string;
  color: string;
  icon?: string;
}

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.html',
  styleUrls: ['./card.scss']
})
export class CardComponent {
  // ============================================================================
  //                                INPUTS
  // ============================================================================

  // Variante: vertical (default), horizontal, pokemon
  @Input() variant: 'vertical' | 'horizontal' | 'pokemon' = 'vertical';

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
  //                          INPUTS PARA VARIANTE POKEMON
  // ============================================================================

  // Número del Pokémon (ej: "001", "025")
  @Input() pokemonNumber: string = '';

  // Tipos del Pokémon
  @Input() types: PokemonType[] = [];

  // ¿Es favorito?
  @Input() isFavorite: boolean = false;
  
  // ============================================================================
  //                                OUTPUTS
  // ============================================================================

  @Output() cardClick = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<void>();
  @Output() favoriteClick = new EventEmitter<void>();
  
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

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    const button = event.currentTarget as HTMLElement;

    // Añadir clase para animación de onda
    button.classList.add('animate-wave');

    // Remover la clase después de la animación
    setTimeout(() => {
      button.classList.remove('animate-wave');
    }, 600);

    this.favoriteClick.emit();
  }

  // Genera las clases CSS
  get cardClasses(): string {
    const classes = ['card'];

    classes.push(`card--${this.variant}`);

    if (this.clickable) classes.push('card--clickable');
    if (this.elevated) classes.push('card--elevated');
    if (this.imageUrl) classes.push('card--has-image');
    if (this.isFavorite) classes.push('card--favorite');

    return classes.join(' ');
  }
}