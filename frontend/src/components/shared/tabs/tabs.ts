import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

/**
 * Interfaz para definir una pestaña
 */
export interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

/**
 * TabsComponent - Componente de pestañas interactivas
 *
 * Funcionalidades:
 * - Navegación con teclado (flechas izquierda/derecha, Home, End)
 * - Soporte para pestañas deshabilitadas
 * - Emisión de eventos al cambiar de pestaña
 * - Estilos personalizables con variantes
 *
 * Uso:
 * <app-tabs
 *   [tabs]="tabs"
 *   [activeTabId]="activeTab"
 *   (tabChange)="onTabChange($event)">
 * </app-tabs>
 */
@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.html',
  styleUrls: ['./tabs.scss']
})
export class TabsComponent {
  // ============================================================================
  //                               INPUTS
  // ============================================================================

  /** Lista de pestañas a mostrar */
  @Input() tabs: Tab[] = [];

  /** ID de la pestaña activa */
  @Input() activeTabId: string = '';

  /** Variante visual: default, pills, underline */
  @Input() variant: 'default' | 'pills' | 'underline' = 'default';

  /** Tamaño: sm, md, lg */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /** ¿Ocupar todo el ancho disponible? */
  @Input() fullWidth: boolean = false;

  // ============================================================================
  //                               OUTPUTS
  // ============================================================================

  /** Evento emitido cuando cambia la pestaña activa */
  @Output() tabChange = new EventEmitter<string>();

  // ============================================================================
  //                               ESTADO INTERNO
  // ============================================================================

  /** Índice de la pestaña con foco (para navegación con teclado) */
  private focusedIndex: number = 0;

  // ============================================================================
  //                               MÉTODOS
  // ============================================================================

  /**
   * Selecciona una pestaña
   */
  selectTab(tab: Tab): void {
    if (tab.disabled) return;

    this.activeTabId = tab.id;
    this.tabChange.emit(tab.id);
  }

  /**
   * Verifica si una pestaña está activa
   */
  isActive(tab: Tab): boolean {
    return this.activeTabId === tab.id;
  }

  /**
   * Maneja eventos de teclado para navegación accesible
   */
  onKeyDown(event: KeyboardEvent, currentIndex: number): void {
    const enabledTabs = this.tabs.filter(t => !t.disabled);
    const enabledIndices = this.tabs
      .map((t, i) => ({ tab: t, index: i }))
      .filter(item => !item.tab.disabled)
      .map(item => item.index);

    let newIndex: number | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = this.findPreviousEnabledTab(currentIndex, enabledIndices);
        break;

      case 'ArrowRight':
        event.preventDefault();
        newIndex = this.findNextEnabledTab(currentIndex, enabledIndices);
        break;

      case 'Home':
        event.preventDefault();
        newIndex = enabledIndices[0];
        break;

      case 'End':
        event.preventDefault();
        newIndex = enabledIndices[enabledIndices.length - 1];
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.tabs[currentIndex].disabled) {
          this.selectTab(this.tabs[currentIndex]);
        }
        break;
    }

    if (newIndex !== null && newIndex !== currentIndex) {
      this.focusedIndex = newIndex;
      // Activar la pestaña al navegar con teclado
      this.selectTab(this.tabs[newIndex]);
    }
  }

  /**
   * Encuentra el índice de la pestaña habilitada anterior
   */
  private findPreviousEnabledTab(currentIndex: number, enabledIndices: number[]): number {
    const currentPos = enabledIndices.indexOf(currentIndex);
    if (currentPos <= 0) {
      return enabledIndices[enabledIndices.length - 1]; // Wrap al final
    }
    return enabledIndices[currentPos - 1];
  }

  /**
   * Encuentra el índice de la pestaña habilitada siguiente
   */
  private findNextEnabledTab(currentIndex: number, enabledIndices: number[]): number {
    const currentPos = enabledIndices.indexOf(currentIndex);
    if (currentPos >= enabledIndices.length - 1) {
      return enabledIndices[0]; // Wrap al inicio
    }
    return enabledIndices[currentPos + 1];
  }

  /**
   * Devuelve el tabindex para una pestaña
   * Solo la pestaña activa o la primera habilitada tiene tabindex 0
   */
  getTabIndex(tab: Tab, index: number): number {
    if (tab.disabled) return -1;

    // Si hay una pestaña activa, solo esa tiene tabindex 0
    if (this.activeTabId) {
      return this.activeTabId === tab.id ? 0 : -1;
    }

    // Si no hay pestaña activa, la primera habilitada tiene tabindex 0
    const firstEnabledIndex = this.tabs.findIndex(t => !t.disabled);
    return index === firstEnabledIndex ? 0 : -1;
  }

  /**
   * Genera las clases CSS para el contenedor de tabs
   */
  get containerClasses(): string {
    const classes = ['tabs'];
    classes.push(`tabs--${this.variant}`);
    classes.push(`tabs--${this.size}`);
    if (this.fullWidth) classes.push('tabs--full-width');
    return classes.join(' ');
  }

  /**
   * Genera las clases CSS para una pestaña individual
   */
  getTabClasses(tab: Tab): string {
    const classes = ['tabs__tab'];
    if (this.isActive(tab)) classes.push('tabs__tab--active');
    if (tab.disabled) classes.push('tabs__tab--disabled');
    return classes.join(' ');
  }
}
