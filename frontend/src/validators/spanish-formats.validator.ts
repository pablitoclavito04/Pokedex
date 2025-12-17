import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador de NIF/DNI español
 *
 * Valida el formato y la letra de control del NIF español.
 * Formato válido: 8 dígitos + 1 letra (ej: 12345678Z)
 */
export function nif(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const nifValue = value.toString().toUpperCase().trim();

    // Validar formato básico: 8 dígitos + 1 letra
    const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;

    if (!nifRegex.test(nifValue)) {
      return { invalidNif: { message: 'Formato incorrecto (8 dígitos + letra)' } };
    }

    // Validar letra de control
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const number = parseInt(nifValue.substring(0, 8), 10);
    const expectedLetter = letters[number % 23];
    const actualLetter = nifValue[8];

    if (expectedLetter !== actualLetter) {
      return { invalidNif: { message: 'Letra de control incorrecta' } };
    }

    return null;
  };
}

/**
 * Validador de NIE español (Número de Identidad de Extranjero)
 *
 * Formato válido: X/Y/Z + 7 dígitos + 1 letra
 */
export function nie(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const nieValue = value.toString().toUpperCase().trim();

    // Validar formato: X/Y/Z + 7 dígitos + letra
    const nieRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;

    if (!nieRegex.test(nieValue)) {
      return { invalidNie: { message: 'Formato incorrecto (X/Y/Z + 7 dígitos + letra)' } };
    }

    // Convertir primera letra a número para validar
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    let nieNumber = nieValue.substring(0, 8);
    nieNumber = nieNumber
      .replace('X', '0')
      .replace('Y', '1')
      .replace('Z', '2');

    const number = parseInt(nieNumber, 10);
    const expectedLetter = letters[number % 23];
    const actualLetter = nieValue[8];

    if (expectedLetter !== actualLetter) {
      return { invalidNie: { message: 'Letra de control incorrecta' } };
    }

    return null;
  };
}

/**
 * Validador de teléfono móvil español
 *
 * Valida teléfonos móviles españoles (empiezan por 6 o 7)
 * Formato: 9 dígitos empezando por 6 o 7
 */
export function telefonoMovil(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    // Eliminar espacios y guiones
    const phone = value.toString().replace(/[\s\-]/g, '');

    // Validar formato: 9 dígitos empezando por 6 o 7
    if (!/^[67]\d{8}$/.test(phone)) {
      return {
        invalidTelefono: {
          message: 'Debe empezar por 6 o 7 y tener 9 dígitos'
        }
      };
    }

    return null;
  };
}

/**
 * Validador de teléfono fijo español
 *
 * Valida teléfonos fijos españoles (empiezan por 8 o 9)
 * Formato: 9 dígitos empezando por 8 o 9
 */
export function telefonoFijo(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const phone = value.toString().replace(/[\s\-]/g, '');

    if (!/^[89]\d{8}$/.test(phone)) {
      return {
        invalidTelefonoFijo: {
          message: 'Debe empezar por 8 o 9 y tener 9 dígitos'
        }
      };
    }

    return null;
  };
}

/**
 * Validador de código postal español
 *
 * Valida códigos postales españoles (5 dígitos, 01-52)
 */
export function codigoPostal(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const cp = value.toString().trim();

    // Validar formato: 5 dígitos
    if (!/^\d{5}$/.test(cp)) {
      return { invalidCP: { message: 'Debe tener 5 dígitos' } };
    }

    // Validar rango de provincias (01-52)
    const provincia = parseInt(cp.substring(0, 2), 10);
    if (provincia < 1 || provincia > 52) {
      return { invalidCP: { message: 'Código de provincia inválido (01-52)' } };
    }

    return null;
  };
}

/**
 * Validador de IBAN español
 *
 * Valida el formato de IBAN español (ES + 22 caracteres)
 */
export function iban(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    // Eliminar espacios
    const ibanValue = value.toString().replace(/\s/g, '').toUpperCase();

    // Validar formato español: ES + 22 dígitos
    if (!/^ES\d{22}$/.test(ibanValue)) {
      return { invalidIban: { message: 'Formato: ES + 22 dígitos' } };
    }

    // Validar dígitos de control (algoritmo mod 97)
    const rearranged = ibanValue.substring(4) + '1428' + ibanValue.substring(2, 4); // ES = 14 28
    let remainder = '';

    for (const char of rearranged) {
      remainder += char;
      remainder = (parseInt(remainder, 10) % 97).toString();
    }

    if (parseInt(remainder, 10) !== 1) {
      return { invalidIban: { message: 'Dígitos de control incorrectos' } };
    }

    return null;
  };
}
