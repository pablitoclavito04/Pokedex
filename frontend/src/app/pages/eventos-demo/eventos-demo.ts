import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../components/shared/modal/modal';
import { AccordionComponent, AccordionItem } from '../../../components/shared/accordion/accordion';
import { CustomSelectComponent, CustomSelectOption } from '../../../components/shared/custom-select/custom-select';

/**
 * DEMOSTRACIÓN DE RÚBRICAS 2.3 Y 2.4
 *
 * Esta página demuestra todas las implementaciones de:
 * - preventDefault() en formularios
 * - stopPropagation() en componentes interactivos
 * - @HostListener para eventos globales
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

  // Estos se actualizarán automáticamente por los @HostListener de los componentes
}
