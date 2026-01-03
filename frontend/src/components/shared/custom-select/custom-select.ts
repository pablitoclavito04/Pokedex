import { Component, Input, Output, EventEmitter, ElementRef, HostListener, forwardRef, ViewEncapsulation, ViewChild, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface CustomSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-select.html',
  styleUrls: ['./custom-select.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})
export class CustomSelectComponent implements ControlValueAccessor, AfterViewChecked, OnDestroy {
  @Input() selectId: string = '';
  @Input() name: string = '';
  @Input() placeholder: string = '---';
  @Input() options: CustomSelectOption[] = [];
  @Input() disabled: boolean = false;
  @Input() hasError: boolean = false;

  @Output() valueChange = new EventEmitter<string | number>();

  @ViewChild('optionsContainer') optionsContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollbarTrack') scrollbarTrack!: ElementRef<HTMLDivElement>;

  isOpen: boolean = false;
  openUpward: boolean = false;
  value: string | number = '';

  // Estados del scroll para las sombras
  isScrolledFromTop: boolean = false;
  isScrolledToBottom: boolean = false;
  hasScroll: boolean = false;
  
  // Estados para scrollbar custom (móviles)
  scrollThumbHeight: number = 30;
  scrollThumbPosition: number = 0;
  
  // Estados para drag del scrollbar
  private isDragging: boolean = false;
  private dragStartY: number = 0;
  private dragStartScrollTop: number = 0;
  
  // Bound functions para poder remover los listeners
  private boundOnMouseMove: (e: MouseEvent) => void;
  private boundOnMouseUp: () => void;
  private boundOnTouchMove: (e: TouchEvent) => void;
  private boundOnTouchEnd: () => void;

  private onChange: (value: string | number) => void = () => {};
  private onTouched: () => void = () => {};
  private needsScrollCheck: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    // Bind de funciones para eventos de drag
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnMouseUp = this.onMouseUp.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchEnd = this.onTouchEnd.bind(this);
  }

  ngOnDestroy(): void {
    // Limpiar event listeners al destruir el componente
    this.removeGlobalListeners();
  }

  // Cerrar dropdown al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  // Cerrar con Escape
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.isOpen = false;
  }

  ngAfterViewChecked(): void {
    // Verificar scroll después de que el dropdown se renderice
    if (this.needsScrollCheck && this.optionsContainer) {
      // Usar setTimeout para asegurar que el DOM está completamente renderizado
      setTimeout(() => {
        this.checkScrollState();
        this.cdr.detectChanges();
      }, 0);
      this.needsScrollCheck = false;
    }
  }

  writeValue(value: string | number): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      if (!this.isOpen) {
        // Calcular si hay espacio suficiente abajo
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = 220; // altura aproximada del dropdown
        this.openUpward = spaceBelow < dropdownHeight;
        
        // Marcar que necesitamos verificar el scroll
        this.needsScrollCheck = true;
        
        // Reset estados de scroll
        this.isScrolledFromTop = false;
        this.isScrolledToBottom = false;
      }
      this.isOpen = !this.isOpen;
      if (!this.isOpen) {
        this.onTouched();
      }
    }
  }

  selectOption(option: CustomSelectOption): void {
    if (option.disabled) return;

    this.value = option.value;
    this.isOpen = false;
    this.onChange(this.value);
    this.onTouched();
    this.valueChange.emit(this.value);
  }

  // Manejar el evento de scroll para actualizar las sombras
  onOptionsScroll(event: Event): void {
    const target = event.target as HTMLDivElement;
    this.updateScrollState(target);
  }

  // ========== SCROLLBAR DRAG HANDLERS ==========
  
  // Iniciar drag con mouse
  onScrollbarMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.startDrag(event.clientY);
    
    // Añadir listeners globales
    document.addEventListener('mousemove', this.boundOnMouseMove);
    document.addEventListener('mouseup', this.boundOnMouseUp);
  }
  
  // Iniciar drag con touch
  onScrollbarTouchStart(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const touch = event.touches[0];
    this.startDrag(touch.clientY);
    
    // Añadir listeners globales
    document.addEventListener('touchmove', this.boundOnTouchMove, { passive: false });
    document.addEventListener('touchend', this.boundOnTouchEnd);
  }
  
  // Click en el track del scrollbar (no en el thumb)
  onScrollbarTrackClick(event: MouseEvent): void {
    // Ignorar si el click fue en el thumb
    if ((event.target as HTMLElement).classList.contains('custom-select__scrollbar-thumb')) {
      return;
    }
    
    if (!this.optionsContainer?.nativeElement || !this.scrollbarTrack?.nativeElement) return;
    
    const track = this.scrollbarTrack.nativeElement;
    const trackRect = track.getBoundingClientRect();
    const clickY = event.clientY - trackRect.top;
    const trackHeight = trackRect.height;
    
    // Calcular posición de scroll basada en donde se hizo click
    const clickPercentage = clickY / trackHeight;
    const container = this.optionsContainer.nativeElement;
    const maxScroll = container.scrollHeight - container.clientHeight;
    
    container.scrollTop = clickPercentage * maxScroll;
    this.updateScrollState(container);
  }
  
  private startDrag(clientY: number): void {
    this.isDragging = true;
    this.dragStartY = clientY;
    
    if (this.optionsContainer?.nativeElement) {
      this.dragStartScrollTop = this.optionsContainer.nativeElement.scrollTop;
    }
  }
  
  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    this.handleDrag(event.clientY);
  }
  
  private onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    const touch = event.touches[0];
    this.handleDrag(touch.clientY);
  }
  
  private handleDrag(clientY: number): void {
    if (!this.optionsContainer?.nativeElement || !this.scrollbarTrack?.nativeElement) return;
    
    const container = this.optionsContainer.nativeElement;
    const track = this.scrollbarTrack.nativeElement;
    const trackHeight = track.clientHeight;
    
    // Calcular el delta del drag
    const deltaY = clientY - this.dragStartY;
    
    // Calcular el ratio entre el track y el contenido scrolleable
    const scrollableHeight = container.scrollHeight - container.clientHeight;
    const thumbHeight = (trackHeight * this.scrollThumbHeight) / 100;
    const availableTrackHeight = trackHeight - thumbHeight;
    
    // Calcular cuánto scroll corresponde al delta
    const scrollDelta = (deltaY / availableTrackHeight) * scrollableHeight;
    
    // Aplicar el scroll
    container.scrollTop = this.dragStartScrollTop + scrollDelta;
    
    // Actualizar estados visuales
    this.updateScrollState(container);
  }
  
  private onMouseUp(): void {
    this.endDrag();
    document.removeEventListener('mousemove', this.boundOnMouseMove);
    document.removeEventListener('mouseup', this.boundOnMouseUp);
  }
  
  private onTouchEnd(): void {
    this.endDrag();
    document.removeEventListener('touchmove', this.boundOnTouchMove);
    document.removeEventListener('touchend', this.boundOnTouchEnd);
  }
  
  private endDrag(): void {
    this.isDragging = false;
  }
  
  private removeGlobalListeners(): void {
    document.removeEventListener('mousemove', this.boundOnMouseMove);
    document.removeEventListener('mouseup', this.boundOnMouseUp);
    document.removeEventListener('touchmove', this.boundOnTouchMove);
    document.removeEventListener('touchend', this.boundOnTouchEnd);
  }

  // Verificar el estado inicial del scroll
  private checkScrollState(): void {
    if (this.optionsContainer?.nativeElement) {
      const container = this.optionsContainer.nativeElement;
      
      // Verificar si hay scroll
      this.hasScroll = container.scrollHeight > container.clientHeight;
      
      if (this.hasScroll) {
        // Calcular tamaño inicial del thumb
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        this.scrollThumbHeight = Math.max((clientHeight / scrollHeight) * 100, 15);
        this.scrollThumbPosition = 0; // Empieza arriba
        
        // Actualizar estados de sombras
        this.isScrolledFromTop = false;
        this.isScrolledToBottom = false;
      }
    }
  }

  // Actualizar estados de scroll basado en la posición
  private updateScrollState(container: HTMLDivElement): void {
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    // Umbral para considerar que está en el borde (5px)
    const threshold = 5;
    
    // ¿Está scrolleado desde arriba? (mostrar sombra superior)
    this.isScrolledFromTop = scrollTop > threshold;
    
    // ¿Está scrolleado hasta abajo? (ocultar sombra inferior)
    this.isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    
    // Calcular tamaño y posición del thumb del scrollbar custom
    if (scrollHeight > clientHeight) {
      // Altura del thumb proporcional al contenido visible
      this.scrollThumbHeight = Math.max((clientHeight / scrollHeight) * 100, 15);
      
      // Posición del thumb basada en el scroll
      const maxScroll = scrollHeight - clientHeight;
      const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0;
      this.scrollThumbPosition = scrollPercentage * (100 - this.scrollThumbHeight);
    }
  }

  get selectedLabel(): string {
    const selected = this.options.find(opt => opt.value === this.value);
    return selected ? selected.label : this.placeholder;
  }

  get hasValue(): boolean {
    return this.value !== '' && this.value !== null && this.value !== undefined;
  }
}