import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador de fortaleza de contraseña
 *
 * Verifica que la contraseña cumpla con requisitos de seguridad:
 * - Mínimo 8 caracteres (configurable)
 * - Al menos una letra mayúscula
 * - Al menos una letra minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export function passwordStrength(minLength: number = 8): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // No validar si está vacío (usar Validators.required para eso)
    }

    const errors: ValidationErrors = {};

    // Verificar longitud mínima
    if (value.length < minLength) {
      errors['minLength'] = {
        requiredLength: minLength,
        actualLength: value.length
      };
    }

    // Verificar mayúsculas
    if (!/[A-Z]/.test(value)) {
      errors['noUppercase'] = true;
    }

    // Verificar minúsculas
    if (!/[a-z]/.test(value)) {
      errors['noLowercase'] = true;
    }

    // Verificar números
    if (!/\d/.test(value)) {
      errors['noNumber'] = true;
    }

    // Verificar caracteres especiales
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(value)) {
      errors['noSpecial'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}

/**
 * Obtiene mensajes de error legibles para passwordStrength
 */
export function getPasswordStrengthErrors(errors: ValidationErrors | null): string[] {
  if (!errors) return [];

  const messages: string[] = [];

  if (errors['minLength']) {
    messages.push(`Mínimo ${errors['minLength'].requiredLength} caracteres`);
  }
  if (errors['noUppercase']) {
    messages.push('Debe contener al menos una mayúscula');
  }
  if (errors['noLowercase']) {
    messages.push('Debe contener al menos una minúscula');
  }
  if (errors['noNumber']) {
    messages.push('Debe contener al menos un número');
  }
  if (errors['noSpecial']) {
    messages.push('Debe contener al menos un carácter especial (!@#$%...)');
  }

  return messages;
}
