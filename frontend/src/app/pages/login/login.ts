import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../components/shared/form-input/form-input';
import { ButtonComponent } from '../../../components/shared/button/button';
import { AuthService } from '../../../services/auth.service';

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
    private authService: AuthService
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

    this.authService.login({
      username: this.formData.username,
      password: this.formData.password
    }).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        console.log('Login exitoso:', response);
        this.router.navigate(['/pokedex']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error de login:', err);
        this.loginError = 'Usuario o contraseña incorrectos';
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
