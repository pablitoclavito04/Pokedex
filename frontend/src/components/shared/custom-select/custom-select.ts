import { Component, Input, Output, EventEmitter, ElementRef, HostListener, forwardRef, ViewEncapsulation, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
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
export class CustomSelectComponent implements ControlValueAccessor, AfterViewChecked {
  @Input() selectId: string = '';
  @Input() name: string = '';
  @Input() placeholder: string = '---';
  @Input() options: CustomSelectOption[] = [];
  @Input() disabled: boolean = false;
  @Input() hasError: boolean = false;

  @Output() valueChange = new EventEmitter<string | number>();

  @ViewChild('optionsContainer') optionsContainer!: ElementRef<HTMLDivElement>;

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

  private onChange: (value: string | number) => void = () => {};
  private onTouched: () => void = () => {};
  private needsScrollCheck: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

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