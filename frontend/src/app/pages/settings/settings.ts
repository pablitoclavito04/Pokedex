// ============================================================================
//          SETTINGS PAGE - Página de edición de perfil
// ============================================================================

import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserProfile } from '../../../services/user.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private location: Location,
    private userService: UserService
  ) {}

  // ========== DATOS DEL FORMULARIO ==========
  profileData: UserProfile = {
    avatar: null,
    username: '',
    displayName: '',
    bio: '',
    gender: '',
    favoriteRegion: '',
    language: ''
  };

  // Opciones para los selectores
  genderOptions = ['Hombre', 'Mujer', 'Otro', 'Prefiero no decirlo'];
  regionOptions = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Teselia', 'Kalos', 'Alola', 'Galar', 'Paldea'];
  languageOptions = ['Español', 'English', 'Français', 'Deutsch', 'Italiano'];

  // Límite de caracteres para la bio
  bioMaxLength = 80;

  // Límite y validación para el nombre de usuario
  usernameMaxLength = 18;
  usernameError: string | null = null;
  private usernamePattern = /^[a-zA-Z0-9_.]+$/;

  // Datos y validación para la contraseña
  passwordData = { newPassword: '' };
  passwordMaxLength = 32;
  passwordError: string | null = null;
  showPassword = false;

  // Estado del formulario
  hasChanges = false;

  // Estado de apertura de los selects
  selectStates: { [key: string]: boolean } = {
    gender: false,
    favoriteRegion: false,
    language: false
  };

  ngOnInit(): void {
    // Cargar datos actuales del usuario
    this.profileData = { ...this.userService.currentProfile };
  }

  // ========== MÉTODOS ==========
  close(): void {
    this.location.back();
  }

  onAvatarClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        console.error('El archivo debe ser una imagen');
        return;
      }

      // Convertir a base64 para previsualización
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileData.avatar = e.target?.result as string;
        this.hasChanges = true;
      };
      reader.readAsDataURL(file);
    }
  }

  onFieldChange(): void {
    this.hasChanges = true;
  }

  onUsernameChange(value: string): void {
    this.hasChanges = true;

    // Validar caracteres permitidos
    if (value && !this.usernamePattern.test(value)) {
      this.usernameError = 'Solo puede contener letras, números, guiones bajos (_) y puntos (.)';
    } else if (value && value.length < 3) {
      this.usernameError = 'El nombre de usuario debe tener al menos 3 caracteres.';
    } else {
      this.usernameError = null;
    }
  }

  get bioLength(): number {
    return this.profileData.bio.length;
  }

  get canSave(): boolean {
    return this.hasChanges &&
           this.profileData.username.trim().length >= 3 &&
           this.profileData.displayName.trim().length > 0 &&
           !this.usernameError;
  }

  saveChanges(): void {
    if (!this.canSave) return;

    // Guardar cambios en el servicio
    this.userService.updateProfile(this.profileData);
    this.hasChanges = false;
    this.close();
  }

  cancel(): void {
    this.close();
  }

  deleteAccount(): void {
    // Aquí iría la lógica para eliminar la cuenta (mostrar modal de confirmación)
    console.log('Eliminar cuenta solicitado');
  }

  onSelectClick(selectId: string): void {
    this.selectStates[selectId] = !this.selectStates[selectId];
  }

  onSelectBlur(selectId: string): void {
    this.selectStates[selectId] = false;
  }

  onPasswordChange(): void {
    this.hasChanges = true;

    const password = this.passwordData.newPassword;
    if (password && password.length < 8) {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres.';
    } else {
      this.passwordError = null;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
