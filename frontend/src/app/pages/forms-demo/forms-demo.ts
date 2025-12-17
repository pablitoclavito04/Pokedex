import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

// Componentes UI
import { ButtonComponent } from '../../../components/shared/button/button';
import { SelectOption } from '../../../components/shared/form-select/form-select';
import { AlertComponent } from '../../../components/shared/alert/alert';

// Validadores
import {
  passwordStrength,
  getPasswordStrengthErrors,
  nif,
  telefonoMovil,
  codigoPostal,
  passwordMatch,
  atLeastOneRequired,
  edadMinima,
  AsyncValidatorsService
} from '../../../validators';

// Servicios
import { ToastService } from '../../../services/toast.service';

// Directivas
import { NifMaskDirective, PhoneMaskDirective, PostalCodeMaskDirective } from '../../../directives';

@Component({
  selector: 'app-forms-demo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    AlertComponent,
    NifMaskDirective,
    PhoneMaskDirective,
    PostalCodeMaskDirective
  ],
  templateUrl: './forms-demo.html',
  styleUrls: ['./forms-demo.scss']
})
export class FormsDemoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private asyncValidators = inject(AsyncValidatorsService);
  private toastService = inject(ToastService);

  // Formulario de registro
  registroForm!: FormGroup;

  // Formulario de factura con FormArray
  facturaForm!: FormGroup;

  // Opciones para selects
  provinciaOptions: SelectOption[] = [
    { value: '', label: 'Selecciona una provincia' },
    { value: 'madrid', label: 'Madrid' },
    { value: 'barcelona', label: 'Barcelona' },
    { value: 'valencia', label: 'Valencia' },
    { value: 'sevilla', label: 'Sevilla' },
    { value: 'bilbao', label: 'Bilbao' }
  ];

  // Estado de submit
  registroSubmitted = false;
  facturaSubmitted = false;

  ngOnInit(): void {
    this.initRegistroForm();
    this.initFacturaForm();
  }

  // ============================================================================
  //                    FORMULARIO DE REGISTRO
  // ============================================================================

  private initRegistroForm(): void {
    this.registroForm = this.fb.group({
      // Datos personales
      username: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
        asyncValidators: [this.asyncValidators.usernameAvailable()],
        updateOn: 'blur'
      }],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.asyncValidators.emailUnique()],
        updateOn: 'blur'
      }],
      password: ['', [Validators.required, passwordStrength(8)]],
      confirmPassword: ['', [Validators.required]],

      // Datos personales españoles
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      nif: ['', [Validators.required, nif()]],
      fechaNacimiento: ['', [Validators.required, edadMinima(18)]],

      // Contacto (al menos uno requerido)
      telefonoMovil: ['', [telefonoMovil()]],
      telefonoFijo: [''],

      // Dirección
      direccion: this.fb.group({
        calle: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        piso: [''],
        codigoPostal: ['', [Validators.required, codigoPostal()]],
        ciudad: ['', [Validators.required]],
        provincia: ['', [Validators.required]]
      }),

      // Términos
      aceptaTerminos: [false, [Validators.requiredTrue]]
    }, {
      validators: [
        passwordMatch('password', 'confirmPassword'),
        atLeastOneRequired('telefonoMovil', 'telefonoFijo')
      ]
    });
  }

  // Getters para acceso fácil a controles
  get username() { return this.registroForm.get('username'); }
  get email() { return this.registroForm.get('email'); }
  get password() { return this.registroForm.get('password'); }
  get confirmPassword() { return this.registroForm.get('confirmPassword'); }
  get nombre() { return this.registroForm.get('nombre'); }
  get apellidos() { return this.registroForm.get('apellidos'); }
  get nifControl() { return this.registroForm.get('nif'); }
  get fechaNacimiento() { return this.registroForm.get('fechaNacimiento'); }
  get telefonoMovil() { return this.registroForm.get('telefonoMovil'); }
  get direccion() { return this.registroForm.get('direccion') as FormGroup; }
  get aceptaTerminos() { return this.registroForm.get('aceptaTerminos'); }

  /**
   * Obtiene los errores de fortaleza de contraseña
   */
  getPasswordErrors(): string[] {
    return getPasswordStrengthErrors(this.password?.errors || null);
  }

  /**
   * Verifica si un campo tiene error y ha sido tocado
   */
  hasError(controlName: string, errorName?: string): boolean {
    const control = this.registroForm.get(controlName);
    if (!control) return false;

    const touched = control.touched || control.dirty || this.registroSubmitted;

    if (errorName) {
      return control.hasError(errorName) && touched;
    }

    return control.invalid && touched;
  }

  /**
   * Envía el formulario de registro
   */
  onRegistroSubmit(): void {
    this.registroSubmitted = true;

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.toastService.error('Por favor, corrige los errores del formulario');
      return;
    }

    console.log('Registro válido:', this.registroForm.value);
    this.toastService.success('Registro completado correctamente');
  }

  // ============================================================================
  //                    FORMULARIO DE FACTURA (FormArray)
  // ============================================================================

  private initFacturaForm(): void {
    this.facturaForm = this.fb.group({
      // Datos del cliente
      cliente: ['', [Validators.required]],
      nifCliente: ['', [Validators.required, nif()]],

      // Teléfonos (FormArray)
      telefonos: this.fb.array([]),

      // Direcciones (FormArray)
      direcciones: this.fb.array([]),

      // Items de factura (FormArray)
      items: this.fb.array([]),

      // Notas
      notas: ['']
    });

    // Añadir elementos iniciales
    this.addTelefono();
    this.addDireccion();
    this.addItem();
  }

  // ---------- TELÉFONOS ----------

  get telefonos(): FormArray {
    return this.facturaForm.get('telefonos') as FormArray;
  }

  newTelefono(): FormGroup {
    return this.fb.group({
      numero: ['', [Validators.required, telefonoMovil()]],
      tipo: ['movil']
    });
  }

  addTelefono(): void {
    this.telefonos.push(this.newTelefono());
  }

  removeTelefono(index: number): void {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  // ---------- DIRECCIONES ----------

  get direcciones(): FormArray {
    return this.facturaForm.get('direcciones') as FormArray;
  }

  newDireccion(): FormGroup {
    return this.fb.group({
      calle: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required, codigoPostal()]],
      tipo: ['envio']
    });
  }

  addDireccion(): void {
    this.direcciones.push(this.newDireccion());
  }

  removeDireccion(index: number): void {
    if (this.direcciones.length > 1) {
      this.direcciones.removeAt(index);
    }
  }

  // ---------- ITEMS ----------

  get items(): FormArray {
    return this.facturaForm.get('items') as FormArray;
  }

  newItem(): FormGroup {
    return this.fb.group({
      descripcion: ['', [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addItem(): void {
    this.items.push(this.newItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  /**
   * Calcula el subtotal de un item
   */
  getItemSubtotal(index: number): number {
    const item = this.items.at(index);
    const cantidad = item.get('cantidad')?.value || 0;
    const precio = item.get('precioUnitario')?.value || 0;
    return cantidad * precio;
  }

  /**
   * Calcula el total de la factura
   */
  getFacturaTotal(): number {
    return this.items.controls.reduce((total, item) => {
      const cantidad = item.get('cantidad')?.value || 0;
      const precio = item.get('precioUnitario')?.value || 0;
      return total + (cantidad * precio);
    }, 0);
  }

  /**
   * Envía el formulario de factura
   */
  onFacturaSubmit(): void {
    this.facturaSubmitted = true;

    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      this.toastService.error('Por favor, corrige los errores del formulario');
      return;
    }

    const facturaData = {
      ...this.facturaForm.value,
      total: this.getFacturaTotal()
    };

    console.log('Factura válida:', facturaData);
    this.toastService.success('Factura creada correctamente');
  }

  // ============================================================================
  //                    HELPERS
  // ============================================================================

  /**
   * Verifica si un control de FormArray tiene error
   */
  hasArrayError(array: FormArray, index: number, controlName: string): boolean {
    const control = array.at(index)?.get(controlName);
    return control ? (control.invalid && (control.touched || control.dirty)) : false;
  }
}
