import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-textarea.html',
  styleUrls: ['./form-textarea.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextareaComponent),
      multi: true
    }
  ]
})
export class FormTextareaComponent implements ControlValueAccessor {
  // ============================================================================
  //                                INPUTS
  // ============================================================================
  
  @Input() textareaId: string = '';
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() rows: number = 4;
  @Input() maxlength: number | null = null;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() showError: boolean = false;
  @Input() showCharCount: boolean = false;
  
  // ============================================================================
  //                                ESTADO
  // ============================================================================
  
  value: string = '';
  isFocused: boolean = false;
  isTouched: boolean = false;
  
  // ============================================================================
  //                       CONTROL VALUE ACCESSOR
  // ============================================================================
  
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  
  writeValue(value: string): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  // ============================================================================
  //                               MÉTODOS
  // ============================================================================
  
  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
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
    return this.value !== '';
  }
  
  get charCount(): number {
    return this.value?.length || 0;
  }
}