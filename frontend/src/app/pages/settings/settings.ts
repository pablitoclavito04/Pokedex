// ============================================================================
//          SETTINGS PAGE - Página de edición de perfil
// ============================================================================

import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';

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
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  // ========== DATOS DEL FORMULARIO ==========
  profileData = {
    email: '',
    country: '',
    birthDate: {
      year: '',
      month: '',
      day: ''
    },
    username: '',
    password: '',
    avatar: null as string | null,
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

  // Estado del modal de eliminar cuenta
  showDeleteModal = false;

  // Estado de apertura de los selects
  selectStates: { [key: string]: boolean } = {
    gender: false,
    favoriteRegion: false,
    language: false
  };

  ngOnInit(): void {
    // Cargar datos desde localStorage
    const username = this.authService.getUsername();
    const email = localStorage.getItem('email');

    this.profileData.username = username || '';
    this.profileData.displayName = localStorage.getItem('displayName') || username || '';
    this.profileData.email = email || '';
    this.profileData.bio = localStorage.getItem('userBio') || '';
    this.profileData.gender = localStorage.getItem('userGender') || '';
    this.profileData.favoriteRegion = localStorage.getItem('userFavoriteRegion') || 'Kanto';
    this.profileData.language = localStorage.getItem('userLanguage') || 'Español';
    this.profileData.avatar = localStorage.getItem('userAvatar') || null;
    this.profileData.country = localStorage.getItem('userCountry') || '';
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

      if (!file.type.startsWith('image/')) {
        console.error('El archivo debe ser una imagen');
        return;
      }

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

    // Guardar en localStorage
    localStorage.setItem('username', this.profileData.username);
    localStorage.setItem('displayName', this.profileData.displayName);
    localStorage.setItem('userBio', this.profileData.bio);
    localStorage.setItem('userGender', this.profileData.gender);
    localStorage.setItem('userFavoriteRegion', this.profileData.favoriteRegion);
    localStorage.setItem('userLanguage', this.profileData.language);
    
    if (this.profileData.avatar) {
      localStorage.setItem('userAvatar', this.profileData.avatar);
    }

    this.hasChanges = false;
    this.close();
  }

  cancel(): void {
    this.close();
  }

  deleteAccount(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDeleteAccount(): void {
    this.showDeleteModal = false;
    this.loadingService.show('Eliminando cuenta...');

    // Simular tiempo de carga y luego redirigir
    setTimeout(() => {
      this.loadingService.hide();
      this.authService.logout();
      this.router.navigate(['/']);
    }, 2000);
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