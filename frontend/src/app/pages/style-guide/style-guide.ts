import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importar todos los componentes
import { ButtonComponent } from '../../../components/shared/button/button';
import { CardComponent } from '../../../components/shared/card/card';
import { FormInputComponent } from '../../../components/shared/form-input/form-input';
import { FormTextareaComponent } from '../../../components/shared/form-textarea/form-textarea';
import { FormSelectComponent, SelectOption } from '../../../components/shared/form-select/form-select';
import { AlertComponent } from '../../../components/shared/alert/alert';
import { BadgeComponent } from '../../../components/shared/badge/badge';
import { ModalComponent } from '../../../components/shared/modal/modal';

@Component({
  selector: 'app-style-guide',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    FormInputComponent,
    FormTextareaComponent,
    FormSelectComponent,
    AlertComponent,
    BadgeComponent,
    ModalComponent
  ],
  templateUrl: './style-guide.html',
  styleUrls: ['./style-guide.scss']
})
export class StyleGuideComponent {
  // ============================================================================
  //                            DATOS DE EJEMPLO
  // ============================================================================
  
  // Opciones para el select
  selectOptions: SelectOption[] = [
    { value: 'fire', label: 'Fuego' },
    { value: 'water', label: 'Agua' },
    { value: 'grass', label: 'Planta' },
    { value: 'electric', label: 'Eléctrico' },
    { value: 'psychic', label: 'Psíquico' }
  ];
  
  // Estado del modal
  isModalOpen: boolean = false;
  
  // ============================================================================
  //                               MÉTODOS
  // ============================================================================
  
  openModal(): void {
    this.isModalOpen = true;
  }
  
  closeModal(): void {
    this.isModalOpen = false;
  }
  
  onButtonClick(type: string): void {
    console.log(`Button clicked: ${type}`);
  }
  
  onAlertClosed(type: string): void {
    console.log(`Alert closed: ${type}`);
  }
}