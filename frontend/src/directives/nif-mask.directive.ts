import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Directiva que aplica una máscara de entrada para NIF español.
 *
 * Reglas:
 * - Solo permite 8 dígitos numéricos
 * - Después de los 8 dígitos, solo permite 1 letra
 * - La letra se convierte automáticamente a mayúscula
 * - No permite más caracteres después de los 9 (8 números + 1 letra)
 *
 * Uso:
 * <input appNifMask formControlName="nif">
 */
@Directive({
  selector: '[appNifMask]',
  standalone: true
})
export class NifMaskDirective {
  private el = inject(ElementRef);
  private control = inject(NgControl, { optional: true });

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Aplicar la máscara
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

    // Permitir teclas de control (backspace, delete, arrows, tab, etc.)
    if (this.isControlKey(event)) {
      return;
    }

    // Si ya tiene 9 caracteres (8 números + 1 letra), bloquear
    if (currentValue.length >= 9) {
      event.preventDefault();
      return;
    }

    // Si tiene menos de 8 caracteres, solo permitir números
    if (currentValue.length < 8) {
      if (!/^\d$/.test(key)) {
        event.preventDefault();
        return;
      }
    }

    // Si tiene exactamente 8 caracteres, solo permitir letras
    if (currentValue.length === 8) {
      if (!/^[a-zA-Z]$/.test(key)) {
        event.preventDefault();
        return;
      }
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
   * Aplica la máscara NIF al valor
   */
  private applyMask(value: string): string {
    // Eliminar todo excepto números y letras
    let cleaned = value.replace(/[^0-9a-zA-Z]/g, '');

    // Tomar solo los primeros 8 dígitos
    let numbers = '';
    let letter = '';

    for (const char of cleaned) {
      if (/\d/.test(char) && numbers.length < 8) {
        numbers += char;
      } else if (/[a-zA-Z]/.test(char) && numbers.length === 8 && !letter) {
        letter = char.toUpperCase();
        break; // Solo una letra
      }
    }

    return numbers + letter;
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
