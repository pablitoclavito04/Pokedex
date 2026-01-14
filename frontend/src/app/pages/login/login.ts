import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../components/shared/form-input/form-input';
import { ButtonComponent } from '../../../components/shared/button/button';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';
import { ToastService } from '../../../services/toast.service';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    FormInputComponent,
    ButtonComponent
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    // Cargar credenciales guardadas del último registro/cambio
    this.loadSavedCredentials();
  }

  // Datos del formulario
  formData = {
    username: '',
    password: ''
  };

  // Cargar credenciales guardadas en localStorage
  private loadSavedCredentials(): void {
    const savedUsername = localStorage.getItem('lastUsername');
    const savedPassword = localStorage.getItem('lastPassword');

    if (savedUsername) {
      this.formData.username = savedUsername;
    }
    if (savedPassword) {
      this.formData.password = savedPassword;
    }
  }

  // Estado
  isSubmitting = false;
  showPassword = false;
  hasAttemptedSubmit = false;
  loginError = '';
  errors = {
    username: '',
    password: ''
  };

  // Toggle mostrar/ocultar contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Validación
  validateUsername(): boolean {
    if (!this.formData.username.trim()) {
      this.errors.username = 'El nombre de usuario es obligatorio';
      return false;
    }
    this.errors.username = '';
    return true;
  }

  validatePassword(): boolean {
    if (!this.formData.password) {
      this.errors.password = 'La contraseña es obligatoria';
      return false;
    }
    this.errors.password = '';
    return true;
  }

  validateForm(): boolean {
    const isUsernameValid = this.validateUsername();
    const isPasswordValid = this.validatePassword();
    return isUsernameValid && isPasswordValid;
  }

  // Limpiar error al escribir
  onInputChange(): void {
    if (this.loginError) {
      this.loginError = '';
    }
  }

  /**
   * Evento (focusin) - Se dispara cuando cualquier elemento dentro del formulario recibe foco
   * A diferencia de (focus), este evento burbujea desde los hijos
   */
  onFormFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;
    console.log('FocusIn en formulario - elemento:', target.tagName, target.id || target.name || '');
  }

  /**
   * Evento (focusout) - Se dispara cuando cualquier elemento dentro del formulario pierde foco
   * A diferencia de (blur), este evento burbujea desde los hijos
   */
  onFormFocusOut(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;
    console.log('FocusOut en formulario - elemento:', target.tagName, target.id || target.name || '');
  }

  /**
   * Maneja el envío del formulario de login
   * PREVENCIÓN DE PROPAGACIÓN: Previene el comportamiento por defecto del formulario
   * para evitar la recarga de la página y manejar el envío con JavaScript
   */
  onSubmit(event: Event): void {
    // PREVENCIÓN: Prevenir recarga de página al enviar el formulario
    event.preventDefault();
    this.hasAttemptedSubmit = true;
    this.loginError = '';

    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.loadingService.show();

    this.authService.login({
      username: this.formData.username,
      password: this.formData.password
    }).pipe(
      timeout(10000),
      catchError(err => {
        return throwError(() => err);
      })
    ).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        // Guardar flag para mostrar toast después de la redirección
        sessionStorage.setItem('showWelcomeToast', 'true');
        // Mantener pantalla de carga y redirigir a Pokédex
        setTimeout(() => {
          this.isSubmitting = false;
          this.loadingService.hide();
          this.router.navigate(['/pokedex']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error de login:', err);

        // Ocultar pantalla de carga inmediatamente
        this.loadingService.hide();
        this.isSubmitting = false;

        // Establecer mensaje de error y mostrar toast
        if (err.name === 'TimeoutError') {
          this.loginError = 'El servidor no responde. Inténtalo de nuevo.';
          this.toastService.error('El servidor no responde');
        } else if (err.status === 0) {
          this.loginError = 'No se puede conectar con el servidor.';
          this.toastService.error('Sin conexión al servidor');
        } else {
          this.loginError = 'Usuario o contraseña incorrectos';
          this.toastService.error('Credenciales incorrectas');
        }

        // Forzar detección de cambios para mostrar el error inmediatamente
        this.cdr.detectChanges();
      }
    });
  }

  // Navegación
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  onForgotPassword(): void {
    console.log('Forgot password clicked');
  }

  // Login social
  loginWithGoogle(): void {
    console.log('Login with Google');
  }

  loginWithApple(): void {
    console.log('Login with Apple');
  }
}