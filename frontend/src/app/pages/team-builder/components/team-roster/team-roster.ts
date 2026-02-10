import {
  Component, inject, ViewChild, ElementRef, Renderer2,
  HostListener, AfterViewInit, OnDestroy, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

// Servicios
import { TeamBuilderService, TeamMember, PokemonSearchResult } from '../../../../../services/team-builder.service';
import { ToastService } from '../../../../../services/toast.service';
import { LoadingService } from '../../../../../services/loading.service';
import { CommunicationService } from '../../../../../services/communication.service';

// Componentes
import { ModalComponent } from '../../../../../components/shared/modal/modal';
import { ButtonComponent } from '../../../../../components/shared/button/button';

@Component({
  selector: 'app-team-roster',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, ButtonComponent],
  templateUrl: './team-roster.html',
  styleUrls: ['./team-roster.scss']
})
export class TeamRosterComponent implements AfterViewInit, OnDestroy {
  private renderer = inject(Renderer2);
  private teamService = inject(TeamBuilderService);
  private toastService = inject(ToastService);
  private loadingService = inject(LoadingService);
  private communicationService = inject(CommunicationService);

  // ========== @ViewChild - Acceso al DOM ==========
  @ViewChild('teamGrid') teamGrid!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchDropdown') searchDropdown!: ElementRef;
  @ViewChild('typeBadgesContainer') typeBadgesContainer!: ElementRef;

  // ========== Estado del componente ==========
  teamMembers: TeamMember[] = [];
  searchQuery = '';
  searchResults: PokemonSearchResult[] = [];
  isSearchOpen = false;
  isSearching = signal(false);

  // Modal de confirmación
  isDeleteModalOpen = false;
  memberToDelete: { index: number; name: string } | null = null;

  // Tooltip
  tooltipMember: TeamMember | null = null;
  tooltipPosition = { top: 0, left: 0 };
  showTooltip = false;

  // Drag & Drop
  dragIndex: number | null = null;
  dragOverIndex: number | null = null;

  // Navegación por teclado en el grid
  focusedSlot = -1;

  // Suscripciones
  private subscriptions: Subscription[] = [];

  constructor() {
    // Suscribirse a cambios del equipo vía servicio (comunicación entre hermanos)
    this.subscriptions.push(
      this.teamService.teamMembers$.subscribe(members => {
        this.teamMembers = members;
      })
    );

    // Suscribirse al estado de búsqueda
    this.subscriptions.push(
      this.teamService.isSearching$.subscribe(searching => {
        this.isSearching.set(searching);
      })
    );
  }

  ngAfterViewInit(): void {
    // Acceso al DOM después de la inicialización
    if (this.searchInput) {
      // Renderer2.setProperty - Establecer placeholder dinámicamente
      this.renderer.setProperty(
        this.searchInput.nativeElement,
        'placeholder',
        'Buscar por nombre o número...'
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // ========== @HostListener - Eventos globales del documento ==========

  /**
   * Cerrar dropdown de búsqueda al hacer click fuera
   * Usa @HostListener para escuchar clicks en el documento
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isSearchOpen) return;

    const target = event.target as HTMLElement;
    const isInsideSearch = this.searchInput?.nativeElement.contains(target);
    const isInsideDropdown = this.searchDropdown?.nativeElement?.contains(target);

    if (!isInsideSearch && !isInsideDropdown) {
      this.closeSearch();
    }
  }

  /**
   * Cerrar búsqueda/modal con tecla Escape
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isDeleteModalOpen) {
      this.closeDeleteModal();
      return;
    }
    if (this.isSearchOpen) {
      this.closeSearch();
      // Devolver foco al input
      this.searchInput?.nativeElement.focus();
    }
  }

  // ========== BÚSQUEDA DE POKÉMON ==========

  /**
   * Evento (keydown) - Bloquear más de 4 dígitos numéricos
   */
  onSearchKeydown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const key = event.key;

    // Permitir teclas de control
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End', 'Enter'].includes(key)) {
      return;
    }

    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    // Si el contenido actual es solo números y ya tiene 4 dígitos, bloquear más números
    const isCurrentlyNumeric = /^\d*$/.test(currentValue);
    const isKeyNumeric = /^\d$/.test(key);

    if (isCurrentlyNumeric && isKeyNumeric && currentValue.length >= 4) {
      event.preventDefault();
    }
  }

  /**
   * Buscar Pokémon mientras se escribe
   * Evento: (input) en el campo de búsqueda
   */
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Si es solo números y tiene más de 4 dígitos, truncar a 4 (por si se pega texto)
    if (/^\d+$/.test(value) && value.length > 4) {
      value = value.slice(0, 4);
      input.value = value;
      this.searchQuery = value;
    }

    if (this.searchQuery.trim().length >= 1) {
      this.isSearchOpen = true;
      this.loadingService.show('Buscando Pokémon...');
      this.teamService.searchPokemon(this.searchQuery).subscribe(results => {
        this.searchResults = results;
        this.loadingService.hide();
      });
    } else {
      this.searchResults = [];
      this.isSearchOpen = false;
    }
  }

  /**
   * Evento (focus) - Resaltar campo de búsqueda
   */
  onSearchFocus(): void {
    // Renderer2.addClass - Añadir clase de foco al contenedor
    if (this.searchInput) {
      this.renderer.addClass(this.searchInput.nativeElement.parentElement, 'team-roster__search--focused');
    }
    if (this.searchResults.length > 0) {
      this.isSearchOpen = true;
    }
  }

  /**
   * Evento (blur) - Quitar resaltado del campo de búsqueda
   */
  onSearchBlur(): void {
    // Renderer2.removeClass - Quitar clase de foco
    if (this.searchInput) {
      this.renderer.removeClass(this.searchInput.nativeElement.parentElement, 'team-roster__search--focused');
    }
  }

  /**
   * Cerrar búsqueda
   */
  closeSearch(): void {
    this.isSearchOpen = false;
    this.searchResults = [];
  }

  // ========== SELECCIÓN DE POKÉMON ==========

  /**
   * Seleccionar Pokémon del dropdown de búsqueda
   * Evento: (click) en resultado de búsqueda
   * Usa event.stopPropagation() para evitar que se cierre el dropdown
   */
  selectPokemon(result: PokemonSearchResult, event: MouseEvent): void {
    event.stopPropagation();

    this.loadingService.show('Cargando datos del Pokémon...');
    this.teamService.getPokemonDetails(result.id).subscribe(pokemon => {
      this.loadingService.hide();
      if (pokemon) {
        const added = this.teamService.addMember(pokemon);
        if (added) {
          this.closeSearch();
          this.searchQuery = '';
          // Crear badges de tipo dinámicamente con Renderer2
          this.createTypeBadges(pokemon);
        }
      }
    });
  }

  // ========== MANIPULACIÓN DEL DOM CON RENDERER2 ==========

  /**
   * Crear badges de tipo dinámicamente usando Renderer2
   * createElement, createText, appendChild, setStyle, addClass
   */
  private createTypeBadges(pokemon: TeamMember): void {
    if (!this.typeBadgesContainer) return;

    // Limpiar badges anteriores
    const container = this.typeBadgesContainer.nativeElement;
    while (container.firstChild) {
      this.renderer.removeChild(container, container.firstChild);
    }

    // Crear badges para cada tipo del equipo actual
    const allTypes = [...new Set(this.teamMembers.flatMap(m => m.types))];

    allTypes.forEach(type => {
      // Renderer2.createElement - Crear elemento span para el badge
      const badge = this.renderer.createElement('span');

      // Renderer2.addClass - Añadir clases CSS
      this.renderer.addClass(badge, 'team-roster__type-badge');
      this.renderer.addClass(badge, `team-roster__type-badge--${type}`);

      // Renderer2.setStyle - Estilos dinámicos según tipo
      const color = this.getTypeColor(type);
      this.renderer.setStyle(badge, 'backgroundColor', color);
      this.renderer.setStyle(badge, 'color', 'white');
      this.renderer.setStyle(badge, 'padding', '4px 10px');
      this.renderer.setStyle(badge, 'borderRadius', '12px');
      this.renderer.setStyle(badge, 'fontSize', '0.75rem');
      this.renderer.setStyle(badge, 'fontWeight', '600');
      this.renderer.setStyle(badge, 'textTransform', 'capitalize');

      // Renderer2.createText + appendChild - Añadir texto
      const text = this.renderer.createText(type);
      this.renderer.appendChild(badge, text);

      // Renderer2.appendChild - Añadir badge al contenedor
      this.renderer.appendChild(container, badge);
    });
  }

  /**
   * Efecto hover en tarjetas del equipo usando Renderer2
   * Eventos: (mouseenter) / (mouseleave)
   */
  onCardMouseEnter(event: MouseEvent, member: TeamMember, index: number): void {
    const card = event.currentTarget as HTMLElement;

    // Renderer2.setStyle - Aplicar estilos de hover dinámicos
    this.renderer.setStyle(card, 'transform', 'translateY(-4px) scale(1.02)');
    this.renderer.setStyle(card, 'boxShadow', `0 8px 24px ${this.getTypeColor(member.types[0])}40`);

    // Mostrar tooltip
    this.tooltipMember = member;
    const rect = card.getBoundingClientRect();
    this.tooltipPosition = {
      top: rect.top - 10,
      left: rect.left + rect.width / 2
    };
    this.showTooltip = true;
  }

  onCardMouseLeave(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;

    // Renderer2.setStyle - Restaurar estilos
    this.renderer.setStyle(card, 'transform', 'none');
    this.renderer.setStyle(card, 'boxShadow', 'none');

    // Ocultar tooltip
    this.showTooltip = false;
    this.tooltipMember = null;
  }

  // ========== DRAG & DROP ==========

  /**
   * Inicio del arrastre
   * Evento: (dragstart)
   */
  onDragStart(event: DragEvent, index: number): void {
    this.dragIndex = index;
    const target = event.currentTarget as HTMLElement;

    // Renderer2.addClass - Marcar elemento arrastrado
    this.renderer.addClass(target, 'team-roster__slot--dragging');

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  /**
   * Arrastrar sobre un slot
   * Evento: (dragover)
   * Usa event.preventDefault() para permitir el drop
   */
  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault(); // NECESARIO para permitir drop
    this.dragOverIndex = index;

    const target = event.currentTarget as HTMLElement;
    this.renderer.addClass(target, 'team-roster__slot--drag-over');
  }

  /**
   * Salir del área de drop
   * Evento: (dragleave)
   */
  onDragLeave(event: DragEvent): void {
    const target = event.currentTarget as HTMLElement;
    this.renderer.removeClass(target, 'team-roster__slot--drag-over');
    this.dragOverIndex = null;
  }

  /**
   * Soltar Pokémon en nuevo slot
   * Evento: (drop)
   */
  onDrop(event: DragEvent, toIndex: number): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    this.renderer.removeClass(target, 'team-roster__slot--drag-over');

    if (this.dragIndex !== null && this.dragIndex !== toIndex) {
      this.teamService.reorderMembers(this.dragIndex, toIndex);
    }

    this.dragIndex = null;
    this.dragOverIndex = null;
  }

  /**
   * Fin del arrastre
   * Evento: (dragend)
   */
  onDragEnd(event: DragEvent): void {
    const target = event.currentTarget as HTMLElement;
    this.renderer.removeClass(target, 'team-roster__slot--dragging');
    this.dragIndex = null;
    this.dragOverIndex = null;
  }

  // ========== NAVEGACIÓN POR TECLADO EN EL GRID ==========

  /**
   * Navegación con flechas por los slots del equipo
   * Evento: (keydown)
   */
  onSlotKeydown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.focusSlot(Math.min(index + 1, 5));
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.focusSlot(Math.max(index - 1, 0));
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.focusSlot(Math.min(index + 3, 5)); // 3 columnas
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusSlot(Math.max(index - 3, 0));
        break;
      case 'Delete':
      case 'Backspace':
        event.preventDefault();
        if (this.teamMembers[index]) {
          this.openDeleteModal(index);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.teamMembers[index]) {
          this.openDeleteModal(index);
        }
        break;
    }
  }

  private focusSlot(index: number): void {
    this.focusedSlot = index;
    const slots = this.teamGrid?.nativeElement.querySelectorAll('.team-roster__slot');
    if (slots && slots[index]) {
      (slots[index] as HTMLElement).focus();
    }
  }

  // ========== ELIMINACIÓN CON MODAL ==========

  /**
   * Doble click para eliminar rápidamente
   * Evento: (dblclick)
   */
  onSlotDblClick(index: number): void {
    if (this.teamMembers[index]) {
      this.openDeleteModal(index);
    }
  }

  /**
   * Abrir modal de confirmación para eliminar
   * Evento: (click) en botón eliminar
   * Usa event.stopPropagation() para no disparar click del slot
   */
  onDeleteClick(event: MouseEvent, index: number): void {
    event.stopPropagation(); // No propagar al slot padre
    this.openDeleteModal(index);
  }

  openDeleteModal(index: number): void {
    this.memberToDelete = {
      index,
      name: this.teamMembers[index].name
    };
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.memberToDelete = null;
  }

  confirmDelete(): void {
    if (this.memberToDelete) {
      this.teamService.removeMember(this.memberToDelete.index);
      // Actualizar badges de tipo
      setTimeout(() => this.refreshTypeBadges(), 100);
    }
    this.closeDeleteModal();
  }

  // ========== LIMPIAR EQUIPO ==========

  clearTeam(): void {
    this.teamService.clearTeam();
    // Limpiar badges con Renderer2
    if (this.typeBadgesContainer) {
      const container = this.typeBadgesContainer.nativeElement;
      while (container.firstChild) {
        this.renderer.removeChild(container, container.firstChild);
      }
    }
  }

  // ========== HELPERS ==========

  private refreshTypeBadges(): void {
    if (this.teamMembers.length > 0) {
      this.createTypeBadges(this.teamMembers[this.teamMembers.length - 1]);
    } else if (this.typeBadgesContainer) {
      const container = this.typeBadgesContainer.nativeElement;
      while (container.firstChild) {
        this.renderer.removeChild(container, container.firstChild);
      }
    }
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'Normal': '#A8A77A', 'Fuego': '#EE8130', 'Agua': '#6390F0',
      'Eléctrico': '#F7D02C', 'Planta': '#7AC74C', 'Hielo': '#96D9D6',
      'Lucha': '#C22E28', 'Veneno': '#A33EA1', 'Tierra': '#E2BF65',
      'Volador': '#A98FF3', 'Psíquico': '#F95587', 'Bicho': '#A6B91A',
      'Roca': '#B6A136', 'Fantasma': '#735797', 'Dragón': '#6F35FC',
      'Siniestro': '#705746', 'Acero': '#B7B7CE', 'Hada': '#D685AD'
    };
    return colors[type] || '#888888';
  }

  getEmptySlots(): number[] {
    return Array(6 - this.teamMembers.length).fill(0).map((_, i) => i + this.teamMembers.length);
  }
}
