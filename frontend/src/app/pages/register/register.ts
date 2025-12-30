// ============================================================================
//          REGISTER PAGE - Página de registro de usuario
// ============================================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { LoadingService } from '../../../services/loading.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  constructor(
    private router: Router,
    private userService: UserService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {
    // Generar años (desde 1920 hasta el año actual)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1920; year--) {
      this.years.push(year);
    }
    // Generar días (1-31)
    for (let day = 1; day <= 31; day++) {
      this.days.push(day);
    }
  }

  // ========== ESTADO DEL FORMULARIO ==========
  currentStep = 1;
  totalSteps = 3;

  formData = {
    email: '',
    confirmEmail: '',
    country: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    username: '',
    password: ''
  };

  // ========== LISTAS PARA SELECTS ==========
  countries = [
    'Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Antigua y Barbuda',
    'Arabia Saudita', 'Argelia', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaiyán', 'Bahamas', 'Bangladés', 'Barbados', 'Baréin', 'Bélgica',
    'Belice', 'Benín', 'Bielorrusia', 'Birmania', 'Bolivia', 'Bosnia y Herzegovina',
    'Botsuana', 'Brasil', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi',
    'Bután', 'Cabo Verde', 'Camboya', 'Camerún', 'Canadá', 'Catar',
    'Chad', 'Chile', 'China', 'Chipre', 'Colombia', 'Comoras',
    'Corea del Norte', 'Corea del Sur', 'Costa de Marfil', 'Costa Rica', 'Croacia', 'Cuba',
    'Dinamarca', 'Dominica', 'Ecuador', 'Egipto', 'El Salvador', 'Emiratos Árabes Unidos',
    'Eritrea', 'Eslovaquia', 'Eslovenia', 'España', 'Estados Unidos', 'Estonia',
    'Etiopía', 'Filipinas', 'Finlandia', 'Fiyi', 'Francia', 'Gabón',
    'Gambia', 'Georgia', 'Ghana', 'Granada', 'Grecia', 'Guatemala',
    'Guinea', 'Guinea Ecuatorial', 'Guinea-Bisáu', 'Guyana', 'Haití', 'Honduras',
    'Hungría', 'India', 'Indonesia', 'Irak', 'Irán', 'Irlanda',
    'Islandia', 'Israel', 'Italia', 'Jamaica', 'Japón', 'Jordania',
    'Kazajistán', 'Kenia', 'Kirguistán', 'Kiribati', 'Kuwait', 'Laos',
    'Lesoto', 'Letonia', 'Líbano', 'Liberia', 'Libia', 'Liechtenstein',
    'Lituania', 'Luxemburgo', 'Madagascar', 'Malasia', 'Malaui', 'Maldivas',
    'Malí', 'Malta', 'Marruecos', 'Mauricio', 'Mauritania', 'México',
    'Micronesia', 'Moldavia', 'Mónaco', 'Mongolia', 'Montenegro', 'Mozambique',
    'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Níger', 'Nigeria',
    'Noruega', 'Nueva Zelanda', 'Omán', 'Países Bajos', 'Pakistán', 'Palaos',
    'Palestina', 'Panamá', 'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Polonia',
    'Portugal', 'Puerto Rico', 'Reino Unido', 'República Centroafricana', 'República Checa', 'República del Congo',
    'República Democrática del Congo', 'República Dominicana', 'Ruanda', 'Rumanía', 'Rusia', 'Samoa',
    'San Cristóbal y Nieves', 'San Marino', 'San Vicente y las Granadinas', 'Santa Lucía', 'Santo Tomé y Príncipe', 'Senegal',
    'Serbia', 'Seychelles', 'Sierra Leona', 'Singapur', 'Siria', 'Somalia',
    'Sri Lanka', 'Suazilandia', 'Sudáfrica', 'Sudán', 'Sudán del Sur', 'Suecia',
    'Suiza', 'Surinam', 'Tailandia', 'Tanzania', 'Tayikistán', 'Timor Oriental',
    'Togo', 'Tonga', 'Trinidad y Tobago', 'Túnez', 'Turkmenistán', 'Turquía',
    'Tuvalu', 'Ucrania', 'Uganda', 'Uruguay', 'Uzbekistán', 'Vanuatu',
    'Vaticano', 'Venezuela', 'Vietnam', 'Yemen', 'Yibuti', 'Zambia', 'Zimbabue'
  ];

  years: number[] = [];
  months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];
  days: number[] = [];

  errors: Record<string, string> = {};
  hasAttemptedSubmit = false;
  isSubmitting = false;
  showPassword = false;
  registerError = '';

  // ========== VALIDACIÓN DE CONTRASEÑA ==========
  passwordRequirements = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  };

  // ========== MÉTODOS DE NAVEGACIÓN ==========
  nextStep(): void {
    this.hasAttemptedSubmit = true;

    if (this.currentStep === 1) {
      if (this.validateStep1()) {
        this.currentStep = 2;
        this.hasAttemptedSubmit = false;
      }
    } else if (this.currentStep === 2) {
      if (this.validateStep2()) {
        this.currentStep = 3;
        this.hasAttemptedSubmit = false;
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.hasAttemptedSubmit = false;
    }
  }

  // ========== VALIDACIONES ==========
  validateStep1(): boolean {
    this.errors = {};

    if (!this.formData.email.trim()) {
      this.errors['email'] = 'El correo electrónico es obligatorio';
    } else if (!this.isValidEmail(this.formData.email)) {
      this.errors['email'] = 'Introduce un correo electrónico válido';
    }

    if (!this.formData.confirmEmail.trim()) {
      this.errors['confirmEmail'] = 'Confirma tu correo electrónico';
    } else if (this.formData.email !== this.formData.confirmEmail) {
      this.errors['confirmEmail'] = 'Los correos electrónicos no coinciden';
    }

    return Object.keys(this.errors).length === 0;
  }

  validateStep2(): boolean {
    this.errors = {};

    if (!this.formData.country) {
      this.errors['country'] = 'Selecciona tu país o región';
    }

    if (!this.formData.birthYear) {
      this.errors['birthYear'] = 'Selecciona el año';
    }

    if (!this.formData.birthMonth) {
      this.errors['birthMonth'] = 'Selecciona el mes';
    }

    if (!this.formData.birthDay) {
      this.errors['birthDay'] = 'Selecciona el día';
    }

    return Object.keys(this.errors).length === 0;
  }

  validateStep3(): boolean {
    this.errors = {};

    if (!this.formData.username.trim()) {
      this.errors['username'] = 'El nombre de usuario es obligatorio';
    } else if (this.formData.username.length < 3) {
      this.errors['username'] = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!this.formData.password) {
      this.errors['password'] = 'La contraseña es obligatoria';
    } else if (!this.isPasswordValid()) {
      this.errors['password'] = 'La contraseña no cumple los requisitos';
    }

    return Object.keys(this.errors).length === 0;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ========== VALIDACIÓN DE CONTRASEÑA EN TIEMPO REAL ==========
  onPasswordChange(): void {
    const password = this.formData.password;
    this.passwordRequirements = {
      length: password.length >= 8 && password.length <= 50,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  }

  isPasswordValid(): boolean {
    return Object.values(this.passwordRequirements).every(req => req);
  }

  // ========== TOGGLE CONTRASEÑA ==========
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // ========== ENVÍO DEL FORMULARIO ==========
  onSubmit(event: Event): void {
    event.preventDefault();
    this.hasAttemptedSubmit = true;
    this.registerError = '';

    if (!this.validateStep3()) {
      return;
    }

    this.isSubmitting = true;

    // Construir fecha de nacimiento
    const fechaNacimiento = `${this.formData.birthYear}-${this.formData.birthMonth}-${this.formData.birthDay.toString().padStart(2, '0')}`;

    // Llamar al backend
    this.authService.register({
      username: this.formData.username,
      password: this.formData.password,
      email: this.formData.email,
      pais: this.formData.country,
      fechaNacimiento: fechaNacimiento
    }).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.isSubmitting = false;
        
        // Guardar también en el UserService local
        this.userService.registerUser({
          email: this.formData.email,
          country: this.formData.country,
          birthYear: this.formData.birthYear,
          birthMonth: this.formData.birthMonth,
          birthDay: this.formData.birthDay,
          username: this.formData.username,
          password: this.formData.password
        });

        // Mostrar pantalla de carga y redirigir
        this.loadingService.show();
        setTimeout(() => {
          this.loadingService.hide();
          this.router.navigate(['/pokedex']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error de registro:', err);
        if (err.error && typeof err.error === 'string') {
          this.registerError = err.error;
        } else {
          this.registerError = 'Error al crear la cuenta. El usuario o email ya existe.';
        }
      }
    });
  }
}