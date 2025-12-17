/**
 * Exportaciones de todos los validadores
 *
 * Uso:
 * import { passwordStrength, nif, passwordMatch } from '../validators';
 */

// Validadores de contraseña
export {
  passwordStrength,
  getPasswordStrengthErrors
} from './password-strength.validator';

// Validadores de formatos españoles
export {
  nif,
  nie,
  telefonoMovil,
  telefonoFijo,
  codigoPostal,
  iban
} from './spanish-formats.validator';

// Validadores cross-field
export {
  passwordMatch,
  totalMinimo,
  atLeastOneRequired,
  dateRange,
  edadMinima,
  conditionalValidator
} from './cross-field.validators';

// Validadores asíncronos
export {
  AsyncValidatorsService,
  createEmailUniqueValidator,
  createUsernameAvailableValidator
} from './async.validators';
