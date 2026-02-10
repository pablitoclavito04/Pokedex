import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,

  Validators,
  ReactiveFormsModule
} from '@angular/forms';

// Componentes UI
import { ButtonComponent } from '../../../../../components/shared/button/button';
import { AlertComponent } from '../../../../../components/shared/alert/alert';

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
} from '../../../../../validators';

// Directivas
import { NifMaskDirective, PhoneMaskDirective, PostalCodeMaskDirective } from '../../../../../directives';

// Servicios
import { TeamBuilderService, TrainerData } from '../../../../../services/team-builder.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-trainer-form',
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
  templateUrl: './trainer-form.html',
  styleUrls: ['./trainer-form.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TrainerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private asyncValidators = inject(AsyncValidatorsService);
  private teamService = inject(TeamBuilderService);
  private toastService = inject(ToastService);

  // Formulario principal del entrenador
  trainerForm!: FormGroup;

  // Estado de submit
  submitted = false;

  // Opciones para selects
  regionOptions = [
    { value: '', label: 'Selecciona una región' },
    { value: 'kanto', label: 'Kanto' },
    { value: 'johto', label: 'Johto' },
    { value: 'hoenn', label: 'Hoenn' },
    { value: 'sinnoh', label: 'Sinnoh' },
    { value: 'teselia', label: 'Teselia' },
    { value: 'kalos', label: 'Kalos' },
    { value: 'alola', label: 'Alola' },
    { value: 'galar', label: 'Galar' },
    { value: 'paldea', label: 'Paldea' }
  ];

  especialidadOptions = [
    { value: '', label: 'Selecciona tu especialidad' },
    { value: 'normal', label: 'Normal' },
    { value: 'fire', label: 'Fuego' },
    { value: 'water', label: 'Agua' },
    { value: 'grass', label: 'Planta' },
    { value: 'electric', label: 'Eléctrico' },
    { value: 'ice', label: 'Hielo' },
    { value: 'fighting', label: 'Lucha' },
    { value: 'poison', label: 'Veneno' },
    { value: 'ground', label: 'Tierra' },
    { value: 'flying', label: 'Volador' },
    { value: 'psychic', label: 'Psíquico' },
    { value: 'bug', label: 'Bicho' },
    { value: 'rock', label: 'Roca' },
    { value: 'ghost', label: 'Fantasma' },
    { value: 'dragon', label: 'Dragón' },
    { value: 'dark', label: 'Siniestro' },
    { value: 'steel', label: 'Acero' },
    { value: 'fairy', label: 'Hada' }
  ];

  ngOnInit(): void {
    this.initForm();
  }

  // ============================================================================
  //                    INICIALIZACIÓN DEL FORMULARIO
  // ============================================================================

  private initForm(): void {
    this.trainerForm = this.fb.group({
      // Datos de cuenta - con validadores async
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

      // Datos personales
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      nif: ['', [Validators.required, nif()]],
      fechaNacimiento: ['', [Validators.required, edadMinima(10)]],

      // Contacto (cross-field: al menos uno requerido)
      telefonoMovil: ['', [telefonoMovil()]],
      telefonoFijo: [''],

      // Datos Pokémon
      region: ['', [Validators.required]],
      especialidad: ['', [Validators.required]],

      // Contraseña con validador de fuerza
      password: ['', [Validators.required, passwordStrength(8)]],
      confirmPassword: ['', [Validators.required]],

      // Términos
      aceptaTerminos: [false, [Validators.requiredTrue]]
    }, {
      validators: [
        passwordMatch('password', 'confirmPassword'),
        atLeastOneRequired('telefonoMovil', 'telefonoFijo')
      ]
    });

  }

  // ============================================================================
  //                    GETTERS PARA CONTROLES
  // ============================================================================

  get username() { return this.trainerForm.get('username'); }
  get email() { return this.trainerForm.get('email'); }
  get nombre() { return this.trainerForm.get('nombre'); }
  get apellidos() { return this.trainerForm.get('apellidos'); }
  get nifControl() { return this.trainerForm.get('nif'); }
  get fechaNacimiento() { return this.trainerForm.get('fechaNacimiento'); }
  get telefonoMovilCtrl() { return this.trainerForm.get('telefonoMovil'); }
  get region() { return this.trainerForm.get('region'); }
  get especialidad() { return this.trainerForm.get('especialidad'); }
  get password() { return this.trainerForm.get('password'); }
  get confirmPassword() { return this.trainerForm.get('confirmPassword'); }
  get aceptaTerminos() { return this.trainerForm.get('aceptaTerminos'); }

  // ============================================================================
  //                    VALIDACIÓN Y HELPERS
  // ============================================================================

  /**
   * Obtiene los errores de fortaleza de contraseña
   */
  getPasswordErrors(): string[] {
    return getPasswordStrengthErrors(this.password?.errors || null);
  }

  /**
   * Verifica si un campo tiene error y ha sido tocado/dirty
   */
  hasError(controlName: string, errorName?: string): boolean {
    const control = this.trainerForm.get(controlName);
    if (!control) return false;

    const touched = control.touched || control.dirty || this.submitted;

    if (errorName) {
      return control.hasError(errorName) && touched;
    }

    return control.invalid && touched;
  }

  // ============================================================================
  //                    SUBMIT
  // ============================================================================

  /**
   * Envía el formulario del entrenador
   * PREVENCIÓN: event.preventDefault() para evitar recarga de página
   */
  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.submitted = true;

    if (this.trainerForm.invalid) {
      this.trainerForm.markAllAsTouched();
      this.toastService.error('Por favor, corrige los errores del formulario');
      return;
    }

    // Extraer datos y enviar al servicio
    const formValue = this.trainerForm.value;
    const trainerData: TrainerData = {
      username: formValue.username,
      email: formValue.email,
      nombre: formValue.nombre,
      apellidos: formValue.apellidos,
      nif: formValue.nif,
      region: formValue.region,
      especialidad: formValue.especialidad,
      pokemonFavoritos: [],
      medallas: []
    };

    this.teamService.setTrainerData(trainerData);
    this.toastService.success('Perfil de entrenador guardado correctamente');
  }
}
