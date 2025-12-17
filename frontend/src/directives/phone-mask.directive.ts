import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Directiva que aplica una máscara de entrada para teléfonos españoles.
 *
 * Reglas:
 * - Solo permite dígitos numéricos (0-9)
 * - Máximo 9 dígitos
 * - No permite letras ni caracteres especiales
 *
 * Uso:
 * <input appPhoneMask formControlName="telefono">
 */
@Directive({
  selector: '[appPhoneMask]',
  standalone: true
})
export class PhoneMaskDirective {
  private el = inject(ElementRef);
  private control = inject(NgControl, { optional: true });

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Aplicar la máscara: solo números, máximo 9
    value = this.applyMask(value);

    // Actualizar el valor del input
    input.value = value;

    // Actualizar el FormControl si existe
    if (this.control?.control) {
      this.control.control.setValue(value, { emitEvent: true });
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const currentValue = input.value;
    const key = event.key;

    // Permitir teclas de control
    if (this.isControlKey(event)) {
      return;
    }

    // Si ya tiene 9 dígitos, bloquear
    if (currentValue.length >= 9) {
      event.preventDefault();
      return;
    }

    // Solo permitir números
    if (!/^\d$/.test(key)) {
      event.preventDefault();
      return;
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const input = this.el.nativeElement as HTMLInputElement;

    // Aplicar la máscara al texto pegado
    const maskedValue = this.applyMask(pastedText);

    input.value = maskedValue;

    if (this.control?.control) {
      this.control.control.setValue(maskedValue, { emitEvent: true });
    }
  }

  /**
   * Aplica la máscara: solo números, máximo 9 dígitos
   */
  private applyMask(value: string): string {
    // Eliminar todo excepto números
    const onlyNumbers = value.replace(/\D/g, '');

    // Limitar a 9 dígitos
    return onlyNumbers.substring(0, 9);
  }

  /**
   * Verifica si es una tecla de control
   */
  private isControlKey(event: KeyboardEvent): boolean {
    return (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key === 'Tab' ||
      event.key === 'Escape' ||
      event.key === 'Enter' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      event.ctrlKey ||
      event.metaKey
    );
  }
}
