import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Interfaz para definir un ítem del acordeón
 */
export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  icon?: string;
  disabled?: boolean;
}

/**
 * AccordionComponent - Componente de acordeón interactivo
 *
 * Funcionalidades:
 * - Modo único (solo un panel abierto) o múltiple
 * - Navegación con teclado (flechas, Home, End, Enter, Space)
 * - Animación de apertura/cierre
 * - Soporte para ítems deshabilitados
 *
 * Uso:
 * <app-accordion
 *   [items]="accordionItems"
 *   [multiple]="false"
 *   (itemToggle)="onItemToggle($event)">
 * </app-accordion>
 */
@Component({
  selector: 'app-accordion',
  standalone: true,
  templateUrl: './accordion.html',
  styleUrls: ['./accordion.scss']
})
export class AccordionComponent {
  // ============================================================================
  //                               INPUTS
  // ============================================================================

  /** Lista de ítems del acordeón */
  @Input() items: AccordionItem[] = [];

  /** ¿Permitir múltiples paneles abiertos? */
  @Input() multiple: boolean = false;

  /** Variante visual: default, bordered, separated */
  @Input() variant: 'default' | 'bordered' | 'separated' = 'default';

  /** IDs de los paneles inicialmente abiertos */
  @Input() set openItems(value: string[]) {
    this._openItems = new Set(value);
  }

  // ============================================================================
  //                               OUTPUTS
  // ============================================================================

  /** Evento emitido cuando se abre/cierra un panel */
  @Output() itemToggle = new EventEmitter<{ id: string; isOpen: boolean }>();

  // ============================================================================
  //                               ESTADO
  // ============================================================================

  /** Set de IDs de paneles abiertos */
  private _openItems: Set<string> = new Set();

  // ============================================================================
  //                               MÉTODOS
  // ============================================================================

  /**
   * Alterna el estado de un panel
   */
  toggleItem(item: AccordionItem): void {
    if (item.disabled) return;

    const isCurrentlyOpen = this.isOpen(item);

    if (!this.multiple) {
      // Modo único: cerrar todos excepto el seleccionado
      this._openItems.clear();
    }

    if (isCurrentlyOpen) {
      this._openItems.delete(item.id);
    } else {
      this._openItems.add(item.id);
    }

    this.itemToggle.emit({ id: item.id, isOpen: !isCurrentlyOpen });
  }

  /**
   * Verifica si un panel está abierto
   */
  isOpen(item: AccordionItem): boolean {
    return this._openItems.has(item.id);
  }

  /**
   * Maneja eventos de teclado para navegación accesible
   * PREVENCIÓN DE PROPAGACIÓN: Previene el comportamiento por defecto de las teclas
   * para implementar navegación personalizada con flechas, Home, End, Enter y Espacio
   */
  onKeyDown(event: KeyboardEvent, currentIndex: number): void {
    const enabledIndices = this.items
      .map((item, i) => ({ item, index: i }))
      .filter(({ item }) => !item.disabled)
      .map(({ index }) => index);

    let targetIndex: number | null = null;

    switch (event.key) {
      case 'ArrowUp':
        // PREVENCIÓN: Evitar scroll de página al usar flecha arriba
        event.preventDefault();
        // CONTROL DE PROPAGACIÓN: Evitar que el evento se propague a otros listeners
        event.stopPropagation();
        targetIndex = this.findPreviousEnabled(currentIndex, enabledIndices);
        break;

      case 'ArrowDown':
        // PREVENCIÓN: Evitar scroll de página al usar flecha abajo
        event.preventDefault();
        event.stopPropagation();
        targetIndex = this.findNextEnabled(currentIndex, enabledIndices);
        break;

      case 'Home':
        // PREVENCIÓN: Evitar scroll al inicio de la página
        event.preventDefault();
        event.stopPropagation();
        targetIndex = enabledIndices[0];
        break;

      case 'End':
        // PREVENCIÓN: Evitar scroll al final de la página
        event.preventDefault();
        event.stopPropagation();
        targetIndex = enabledIndices[enabledIndices.length - 1];
        break;

      case 'Enter':
      case ' ':
        // PREVENCIÓN: Evitar comportamiento por defecto del Enter y Espacio
        event.preventDefault();
        event.stopPropagation();
        if (!this.items[currentIndex].disabled) {
          this.toggleItem(this.items[currentIndex]);
        }
        break;
    }

    if (targetIndex !== null && targetIndex !== currentIndex) {
      // Enfocar el botón del ítem objetivo
      const buttons = document.querySelectorAll('.accordion__button');
      (buttons[targetIndex] as HTMLElement)?.focus();
    }
  }

  /**
   * Encuentra el índice habilitado anterior
   */
  private findPreviousEnabled(currentIndex: number, enabledIndices: number[]): number {
    const currentPos = enabledIndices.indexOf(currentIndex);
    if (currentPos <= 0) {
      return enabledIndices[enabledIndices.length - 1];
    }
    return enabledIndices[currentPos - 1];
  }

  /**
   * Encuentra el índice habilitado siguiente
   */
  private findNextEnabled(currentIndex: number, enabledIndices: number[]): number {
    const currentPos = enabledIndices.indexOf(currentIndex);
    if (currentPos >= enabledIndices.length - 1) {
      return enabledIndices[0];
    }
    return enabledIndices[currentPos + 1];
  }

  /**
   * Genera las clases CSS para el contenedor
   */
  get containerClasses(): string {
    return `accordion accordion--${this.variant}`;
  }

  /**
   * Genera las clases CSS para un ítem
   */
  getItemClasses(item: AccordionItem): string {
    const classes = ['accordion__item'];
    if (this.isOpen(item)) classes.push('accordion__item--open');
    if (item.disabled) classes.push('accordion__item--disabled');
    return classes.join(' ');
  }
}
