// ============================================================================
//          SETTINGS PAGE - Página de edición de perfil
// ============================================================================

import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
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
  usernameMaxLength = 24;
  usernameError: string | null = null;
  private usernamePattern = /^[a-zA-Z0-9_.]+$/;

  // Límite de caracteres para el nombre
  displayNameMaxLength = 50;

  // Datos y validación para la contraseña
  passwordData = { currentPassword: '', newPassword: '' };
  passwordMaxLength = 32;
  passwordError: string | null = null;
  showCurrentPassword = false;
  showNewPassword = false;

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
    // Cargar datos desde sessionStorage
    const username = this.authService.getUsername();
    const email = sessionStorage.getItem('email');

    this.profileData.username = username || '';
    this.profileData.displayName = sessionStorage.getItem('displayName') || username || '';
    this.profileData.email = email || '';
    this.profileData.bio = sessionStorage.getItem('userBio') || '';
    this.profileData.gender = sessionStorage.getItem('userGender') || '';
    this.profileData.favoriteRegion = sessionStorage.getItem('userFavoriteRegion') || 'Kanto';
    this.profileData.language = sessionStorage.getItem('userLanguage') || 'Español';
    this.profileData.avatar = sessionStorage.getItem('userAvatar') || null;
    this.profileData.country = sessionStorage.getItem('userCountry') || '';

    // Cargar contraseña actual
    this.passwordData.currentPassword = this.authService.getPassword() || '';
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
        this.cdr.detectChanges();
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

    this.loadingService.show('Guardando cambios...');

    // Preparar datos para enviar
    const updateData: any = {
      username: this.profileData.username,
      displayName: this.profileData.displayName,
      bio: this.profileData.bio,
      gender: this.profileData.gender,
      favoriteRegion: this.profileData.favoriteRegion,
      language: this.profileData.language,
      avatar: this.profileData.avatar || undefined
    };

    // Solo enviar contraseña si se ha introducido una nueva
    if (this.passwordData.newPassword) {
      updateData.password = this.passwordData.newPassword;
    }

    // Guardar en la base de datos
    this.authService.updateProfile(updateData).subscribe({
      next: () => {
        // Si se cambió la contraseña, actualizar la contraseña actual mostrada
        if (this.passwordData.newPassword) {
          this.authService.setPassword(this.passwordData.newPassword);
          this.passwordData.currentPassword = this.passwordData.newPassword;
          this.passwordData.newPassword = '';
        }

        this.loadingService.hide();
        this.hasChanges = false;
        this.close();
      },
      error: (err) => {
        this.loadingService.hide();
        console.error('Error al guardar cambios:', err);
      }
    });
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

    this.authService.deleteAccount().subscribe({
      next: () => {
        this.loadingService.hide();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loadingService.hide();
        console.error('Error al eliminar cuenta:', err);
      }
    });
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

  toggleCurrentPasswordVisibility(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }
}