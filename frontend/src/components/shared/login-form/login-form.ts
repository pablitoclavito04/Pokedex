import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input';

// Interface para los datos del formulario
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Interface para errores de validación
interface FormErrors {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    FormInputComponent
  ],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.scss']
})
export class LoginFormComponent {
  // ============================================================================
  // OUTPUTS
  // ============================================================================
  
  @Output() formSubmit = new EventEmitter<LoginFormData>();
  @Output() forgotPassword = new EventEmitter<void>();
  @Output() registerClick = new EventEmitter<void>();
  
  // ============================================================================
  // ESTADO DEL FORMULARIO
  // ============================================================================
  
  formData: LoginFormData = {
    email: '',
    password: '',
    rememberMe: false
  };
  
  errors: FormErrors = {
    email: '',
    password: ''
  };
  
  isSubmitting: boolean = false;
  hasAttemptedSubmit: boolean = false;
  
  // ============================================================================
  // MÉTODOS DE VALIDACIÓN
  // ============================================================================
  
  validateEmail(): boolean {
    const email = this.formData.email.trim();
    
    if (!email) {
      this.errors.email = 'El correo electrónico es obligatorio';
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.errors.email = 'Introduce un correo electrónico válido';
      return false;
    }
    
    this.errors.email = '';
    return true;
  }
  
  validatePassword(): boolean {
    const password = this.formData.password;
    
    if (!password) {
      this.errors.password = 'La contraseña es obligatoria';
      return false;
    }
    
    if (password.length < 8) {
      this.errors.password = 'La contraseña debe tener al menos 8 caracteres';
      return false;
    }
    
    this.errors.password = '';
    return true;
  }
  
  validateForm(): boolean {
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();
    return isEmailValid && isPasswordValid;
  }
  
  // ============================================================================
  // MÉTODOS DE EVENTOS
  // ============================================================================
  
  onEmailChange(value: string): void {
    this.formData.email = value;
    if (this.hasAttemptedSubmit) {
      this.validateEmail();
    }
  }
  
  onPasswordChange(value: string): void {
    this.formData.password = value;
    if (this.hasAttemptedSubmit) {
      this.validatePassword();
    }
  }
  
  onRememberMeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.formData.rememberMe = target.checked;
  }
  
  /**
   * Maneja el envío del formulario
   * PREVENCIÓN DE PROPAGACIÓN: Previene el comportamiento por defecto del formulario
   * para evitar la recarga de la página y manejar el envío con JavaScript
   */
  onSubmit(event: Event): void {
    // PREVENCIÓN: Prevenir recarga de página al enviar el formulario
    event.preventDefault();
    this.hasAttemptedSubmit = true;

    if (!this.validateForm()) {
      const firstErrorField = document.querySelector('.form-input--error input');
      if (firstErrorField) {
        (firstErrorField as HTMLInputElement).focus();
      }
      return;
    }

    this.isSubmitting = true;

    this.formSubmit.emit({
      email: this.formData.email.trim(),
      password: this.formData.password,
      rememberMe: this.formData.rememberMe
    });

    setTimeout(() => {
      this.isSubmitting = false;
    }, 2000);
  }
  
  onForgotPasswordClick(event: Event): void {
    event.preventDefault();
    this.forgotPassword.emit();
  }
  
  onRegisterClick(event: Event): void {
    event.preventDefault();
    this.registerClick.emit();
  }
}