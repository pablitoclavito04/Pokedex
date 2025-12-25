import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../components/shared/form-input/form-input';
import { ButtonComponent } from '../../../components/shared/button/button';

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
  constructor(private router: Router) {}

  // Datos del formulario
  formData = {
    username: '',
    password: ''
  };

  // Estado
  isSubmitting = false;
  showPassword = false;
  hasAttemptedSubmit = false;
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

    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    // Simular login
    setTimeout(() => {
      this.isSubmitting = false;
      console.log('Login:', this.formData);
      // TODO: Implementar lógica de autenticación real
    }, 1500);
  }

  // Navegación
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  onForgotPassword(): void {
    // TODO: Implementar recuperación de contraseña
    console.log('Forgot password clicked');
  }

  // Login social
  loginWithGoogle(): void {
    console.log('Login with Google');
    // TODO: Implementar login con Google
  }

  loginWithApple(): void {
    console.log('Login with Apple');
    // TODO: Implementar login con Apple
  }
}
