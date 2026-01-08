// ============================================================================
//          PENDING CHANGES GUARD - Protección de formularios sin guardar
// ============================================================================

import { CanDeactivateFn } from '@angular/router';
import { FormGroup } from '@angular/forms';

/**
 * Interfaz que deben implementar los componentes con formularios
 * que necesitan protección contra pérdida de datos.
 */
export interface FormComponent {
  form: FormGroup;
}

/**
 * Guard para prevenir la navegación cuando hay cambios sin guardar.
 * Muestra un confirm() pidiendo confirmación al usuario.
 */
export const pendingChangesGuard: CanDeactivateFn<FormComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  // Verificar si el componente tiene un formulario y si está sucio
  if (component.form?.dirty) {
    return confirm('Hay cambios sin guardar. ¿Seguro que quieres salir?');
  }
  return true;
};
