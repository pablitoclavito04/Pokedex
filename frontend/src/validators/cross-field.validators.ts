import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador de confirmación de contraseña
 *
 * Verifica que dos campos de contraseña coincidan.
 * Se aplica a nivel de FormGroup.
 *
 * @param passwordField Nombre del campo de contraseña
 * @param confirmField Nombre del campo de confirmación
 */
export function passwordMatch(
  passwordField: string = 'password',
  confirmField: string = 'confirmPassword'
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordField);
    const confirm = group.get(confirmField);

    if (!password || !confirm) {
      return null;
    }

    // No validar si los campos no han sido tocados
    if (!confirm.touched && !confirm.dirty) {
      return null;
    }

    // No validar si la confirmación está vacía
    if (!confirm.value) {
      return null;
    }

    if (password.value !== confirm.value) {
      // Marcar el campo de confirmación con el error
      confirm.setErrors({ ...confirm.errors, mismatch: true });
      return { passwordMismatch: true };
    }

    // Limpiar el error de mismatch si coinciden
    if (confirm.errors) {
      const { mismatch, ...otherErrors } = confirm.errors;
      confirm.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }

    return null;
  };
}

/**
 * Validador de total mínimo
 *
 * Verifica que el producto de cantidad x precio sea mayor o igual a un mínimo.
 * Se aplica a nivel de FormGroup.
 *
 * @param min Valor mínimo requerido
 * @param priceField Nombre del campo de precio
 * @param quantityField Nombre del campo de cantidad
 */
export function totalMinimo(
  min: number,
  priceField: string = 'price',
  quantityField: string = 'quantity'
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const price = group.get(priceField)?.value || 0;
    const quantity = group.get(quantityField)?.value || 0;
    const total = price * quantity;

    if (total < min) {
      return {
        totalMinimo: {
          min,
          actual: total,
          message: `El total debe ser al menos ${min}`
        }
      };
    }

    return null;
  };
}

/**
 * Validador de al menos uno requerido
 *
 * Verifica que al menos uno de los campos especificados tenga valor.
 * Se aplica a nivel de FormGroup.
 *
 * @param fields Nombres de los campos a verificar
 */
export function atLeastOneRequired(...fields: string[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const hasValue = fields.some(field => {
      const control = group.get(field);
      return control && control.value && control.value.toString().trim() !== '';
    });

    if (!hasValue) {
      return {
        atLeastOneRequired: {
          fields,
          message: `Debe completar al menos uno: ${fields.join(', ')}`
        }
      };
    }

    return null;
  };
}

/**
 * Validador de rango de fechas
 *
 * Verifica que la fecha de fin sea posterior a la fecha de inicio.
 * Se aplica a nivel de FormGroup.
 *
 * @param startField Nombre del campo de fecha de inicio
 * @param endField Nombre del campo de fecha de fin
 */
export function dateRange(
  startField: string = 'startDate',
  endField: string = 'endDate'
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startField)?.value;
    const end = group.get(endField)?.value;

    if (!start || !end) {
      return null;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate <= startDate) {
      return {
        invalidDateRange: {
          start: startDate.toLocaleDateString(),
          end: endDate.toLocaleDateString(),
          message: 'La fecha de fin debe ser posterior a la de inicio'
        }
      };
    }

    return null;
  };
}

/**
 * Validador de edad mínima
 *
 * Verifica que la fecha de nacimiento corresponda a una edad mínima.
 * Se aplica a nivel de FormControl o FormGroup.
 *
 * @param minAge Edad mínima requerida
 * @param birthdateField Nombre del campo (si se aplica a grupo)
 */
export function edadMinima(minAge: number, birthdateField?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = birthdateField
      ? control.get(birthdateField)?.value
      : control.value;

    if (!value) {
      return null;
    }

    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < minAge) {
      return {
        edadMinima: {
          required: minAge,
          actual: age,
          message: `Debe tener al menos ${minAge} años`
        }
      };
    }

    return null;
  };
}

/**
 * Validador condicional
 *
 * Aplica un validador solo si una condición se cumple.
 *
 * @param condition Función que determina si aplicar el validador
 * @param validator Validador a aplicar si la condición es verdadera
 */
export function conditionalValidator(
  condition: (group: AbstractControl) => boolean,
  validator: ValidatorFn
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (condition(control)) {
      return validator(control);
    }
    return null;
  };
}
