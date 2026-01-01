import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../components/shared/form-input/form-input';
import { ButtonComponent } from '../../../components/shared/button/button';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';
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
    private loadingService: LoadingService
  ) {}

  // Datos del formulario
  formData = {
    username: '',
    password: ''
  };

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

  // Submit del formulario
  onSubmit(event: Event): void {
    event.preventDefault();
    this.hasAttemptedSubmit = true;
    this.loginError = '';

    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.loadingService.show('Iniciando sesión...');

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
        // Mantener pantalla de carga y redirigir a Pokédex
        setTimeout(() => {
          this.isSubmitting = false;
          this.loadingService.hide();
          this.router.navigate(['/pokedex']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error de login:', err);
        // Mostrar pantalla de carga durante 3 segundos antes de mostrar el error
        setTimeout(() => {
          this.isSubmitting = false;
          this.loadingService.hide();
          if (err.name === 'TimeoutError') {
            this.loginError = 'El servidor no responde. Inténtalo de nuevo.';
          } else if (err.status === 0) {
            this.loginError = 'No se puede conectar con el servidor.';
          } else {
            this.loginError = 'Usuario o contraseña incorrectos';
          }
        }, 3000);
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
