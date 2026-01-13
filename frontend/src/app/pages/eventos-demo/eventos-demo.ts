import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../components/shared/modal/modal';
import { AccordionComponent, AccordionItem } from '../../../components/shared/accordion/accordion';
import { CustomSelectComponent, CustomSelectOption } from '../../../components/shared/custom-select/custom-select';

/**
 * DEMOSTRACIÓN DE RÚBRICAS 2.2, 2.3 Y 2.4
 *
 * Esta página demuestra todas las implementaciones de:
 * - RÚBRICA 2.2: Eventos de teclado, mouse y focus (10+ eventos)
 * - RÚBRICA 2.3: preventDefault() y stopPropagation()
 * - RÚBRICA 2.4: @HostListener para eventos globales
 */
@Component({
  selector: 'app-eventos-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    AccordionComponent,
    CustomSelectComponent
  ],
  templateUrl: './eventos-demo.html',
  styleUrls: ['./eventos-demo.scss']
})
export class EventosDemoComponent {
  // ============================================================================
  // SECCIÓN 1: FORMULARIO CON preventDefault()
  // ============================================================================

  formData = {
    nombre: '',
    email: '',
    mensaje: ''
  };

  formSubmitted = false;
  submitCount = 0;

  /**
   * DEMOSTRACIÓN: preventDefault()
   * Previene la recarga de página al enviar el formulario
   */
  onFormSubmit(event: Event): void {
    // PREVENCIÓN: Prevenir recarga de página
    event.preventDefault();

    this.formSubmitted = true;
    this.submitCount++;

    console.log('Formulario enviado sin recargar página:', this.formData);
    console.log('Contador de envíos:', this.submitCount);

    // Resetear mensaje después de 3 segundos
    setTimeout(() => {
      this.formSubmitted = false;
    }, 3000);
  }

  // ============================================================================
  // SECCIÓN 2: MODAL CON stopPropagation()
  // ============================================================================

  isModalOpen = false;
  modalClickCount = 0;

  openModal(): void {
    this.isModalOpen = true;
    this.modalClickCount = 0;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  /**
   * DEMOSTRACIÓN: stopPropagation()
   * Este método se llama al hacer click dentro del modal
   * y cuenta los clicks para demostrar que stopPropagation funciona
   */
  onModalInnerClick(): void {
    this.modalClickCount++;
    console.log('Click dentro del modal (no cierra gracias a stopPropagation)');
  }

  // ============================================================================
  // SECCIÓN 3: ACCORDION CON preventDefault() + stopPropagation()
  // ============================================================================

  accordionItems: AccordionItem[] = [
    {
      id: '1',
      title: 'Demostración de ArrowUp/ArrowDown',
      content: 'Usa las teclas de flecha ↑ ↓ para navegar. preventDefault() evita el scroll de página.'
    },
    {
      id: '2',
      title: 'Demostración de Home/End',
      content: 'Usa Home/End para ir al primer/último ítem. preventDefault() evita el scroll.'
    },
    {
      id: '3',
      title: 'Demostración de Enter/Space',
      content: 'Usa Enter o Espacio para abrir/cerrar. preventDefault() evita el comportamiento por defecto.'
    }
  ];

  // ============================================================================
  // SECCIÓN 4: CUSTOM SELECT CON EVENTOS GLOBALES
  // ============================================================================

  selectedCountry = '';

  countries: CustomSelectOption[] = [
    { value: 'es', label: 'España' },
    { value: 'mx', label: 'México' },
    { value: 'ar', label: 'Argentina' },
    { value: 'co', label: 'Colombia' },
    { value: 'pe', label: 'Perú' },
    { value: 'cl', label: 'Chile' },
    { value: 've', label: 'Venezuela' }
  ];

  // ============================================================================
  // CONTADORES DE EVENTOS PARA DEMOSTRACIÓN
  // ============================================================================

  escPressCount = 0;
  outsideClickCount = 0;
  resizeCount = 0;

  // ============================================================================
  // SECCIÓN RÚBRICA 2.2: EVENTOS DE TECLADO, MOUSE Y FOCUS
  // ============================================================================

  // Contadores para demostración de eventos
  eventCounts = {
    // Eventos de teclado
    keydownEnter: 0,
    keydownEscape: 0,
    keydownArrowUp: 0,
    keydownArrowDown: 0,
    keyup: 0,
    // Eventos de mouse
    click: 0,
    mouseenter: 0,
    mouseleave: 0,
    // Eventos de focus
    focus: 0,
    blur: 0,
    focusin: 0,
    focusout: 0
  };

  // Estado para demostración visual
  demoBoxHovered = false;
  demoInputFocused = false;
  demoContainerFocused = false;
  lastKeyPressed = '';
  lastKeyUpPressed = '';

  // ==================== EVENTOS DE TECLADO ====================

  /**
   * (keydown.enter) - Detecta cuando se presiona Enter
   */
  onKeydownEnter(event: Event): void {
    this.eventCounts.keydownEnter++;
    this.lastKeyPressed = 'Enter';
    console.log('Evento: keydown.enter', event);
  }

  /**
   * (keydown.escape) - Detecta cuando se presiona Escape
   */
  onKeydownEscape(event: Event): void {
    this.eventCounts.keydownEscape++;
    this.lastKeyPressed = 'Escape';
    console.log('Evento: keydown.escape', event);
  }

  /**
   * (keydown.arrowup) - Detecta cuando se presiona flecha arriba
   */
  onKeydownArrowUp(event: Event): void {
    event.preventDefault(); // Evitar scroll de página
    this.eventCounts.keydownArrowUp++;
    this.lastKeyPressed = 'ArrowUp ↑';
    console.log('Evento: keydown.arrowup', event);
  }

  /**
   * (keydown.arrowdown) - Detecta cuando se presiona flecha abajo
   */
  onKeydownArrowDown(event: Event): void {
    event.preventDefault(); // Evitar scroll de página
    this.eventCounts.keydownArrowDown++;
    this.lastKeyPressed = 'ArrowDown ↓';
    console.log('Evento: keydown.arrowdown', event);
  }

  /**
   * (keyup) - Detecta cuando se suelta cualquier tecla
   */
  onKeyup(event: Event): void {
    const keyEvent = event as KeyboardEvent;
    this.eventCounts.keyup++;
    this.lastKeyUpPressed = keyEvent.key;
    console.log('Evento: keyup', keyEvent.key);
  }

  // ==================== EVENTOS DE MOUSE ====================

  /**
   * (click) - Detecta click en elemento
   */
  onDemoClick(event: MouseEvent): void {
    this.eventCounts.click++;
    console.log('Evento: click', event);
  }

  /**
   * (mouseenter) - Detecta cuando el mouse entra en el elemento
   */
  onMouseEnter(event: MouseEvent): void {
    this.eventCounts.mouseenter++;
    this.demoBoxHovered = true;
    console.log('Evento: mouseenter', event);
  }

  /**
   * (mouseleave) - Detecta cuando el mouse sale del elemento
   */
  onMouseLeave(event: MouseEvent): void {
    this.eventCounts.mouseleave++;
    this.demoBoxHovered = false;
    console.log('Evento: mouseleave', event);
  }

  // ==================== EVENTOS DE FOCUS ====================

  /**
   * (focus) - Detecta cuando un input recibe el foco
   */
  onFocus(event: FocusEvent): void {
    this.eventCounts.focus++;
    this.demoInputFocused = true;
    console.log('Evento: focus', event);
  }

  /**
   * (blur) - Detecta cuando un input pierde el foco
   */
  onBlur(event: FocusEvent): void {
    this.eventCounts.blur++;
    this.demoInputFocused = false;
    console.log('Evento: blur', event);
  }

  /**
   * (focusin) - Detecta cuando cualquier elemento hijo recibe foco (burbujea)
   */
  onFocusIn(event: FocusEvent): void {
    this.eventCounts.focusin++;
    this.demoContainerFocused = true;
    console.log('Evento: focusin (bubbles)', event);
  }

  /**
   * (focusout) - Detecta cuando cualquier elemento hijo pierde foco (burbujea)
   */
  onFocusOut(event: FocusEvent): void {
    this.eventCounts.focusout++;
    this.demoContainerFocused = false;
    console.log('Evento: focusout (bubbles)', event);
  }

  /**
   * Resetear todos los contadores
   */
  resetEventCounts(): void {
    this.eventCounts = {
      keydownEnter: 0,
      keydownEscape: 0,
      keydownArrowUp: 0,
      keydownArrowDown: 0,
      keyup: 0,
      click: 0,
      mouseenter: 0,
      mouseleave: 0,
      focus: 0,
      blur: 0,
      focusin: 0,
      focusout: 0
    };
    this.lastKeyPressed = '';
    this.lastKeyUpPressed = '';
  }

  /**
   * Obtener total de eventos registrados
   */
  getTotalEvents(): number {
    return Object.values(this.eventCounts).reduce((a, b) => a + b, 0);
  }
}
