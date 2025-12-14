import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Interface para las opciones del select
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-select.html',
  styleUrls: ['./form-select.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true
    }
  ]
})
export class FormSelectComponent implements ControlValueAccessor {
  // ============================================================================
  //                               INPUTS
  // ============================================================================
  
  @Input() selectId: string = '';
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = 'Selecciona una opción';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() options: SelectOption[] = [];
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() showError: boolean = false;
  
  // ============================================================================
  //                                ESTADO
  // ============================================================================
  
  value: string | number = '';
  isFocused: boolean = false;
  isTouched: boolean = false;
  
  // ============================================================================
  //                       CONTROL VALUE ACCESSOR
  // ============================================================================
  
  private onChange: (value: string | number) => void = () => {};
  private onTouched: () => void = () => {};
  
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
  
  // ============================================================================
  //                             MÉTODOS
  // ============================================================================
  
  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
  }
  
  onFocus(): void {
    this.isFocused = true;
  }
  
  onBlur(): void {
    this.isFocused = false;
    this.isTouched = true;
    this.onTouched();
  }
  
  get shouldShowError(): boolean {
    return this.showError && this.isTouched && !!this.errorMessage;
  }
  
  get hasValue(): boolean {
    return this.value !== '' && this.value !== null && this.value !== undefined;
  }
}