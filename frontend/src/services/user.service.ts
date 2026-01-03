// ============================================================================
//          USER SERVICE - Servicio para manejar datos del usuario
// ============================================================================

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  // Datos de registro
  email: string;
  country: string;
  birthDate: {
    year: string;
    month: string;
    day: string;
  };
  username: string;
  password: string;

  // Datos de perfil
  avatar: string | null;
  displayName: string;
  bio: string;
  gender: string;
  favoriteRegion: string;
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private defaultProfile: UserProfile = {
    // Datos de registro
    email: '',
    country: '',
    birthDate: {
      year: '',
      month: '',
      day: ''
    },
    username: 'pokemon_trainer',
    password: '',

    // Datos de perfil
    avatar: null,
    displayName: 'Entrenador Pokémon',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    gender: 'Hombre',
    favoriteRegion: '',
    language: 'Español'
  };

  private userProfileSubject = new BehaviorSubject<UserProfile>(this.defaultProfile);
  userProfile$ = this.userProfileSubject.asObservable();

  get currentProfile(): UserProfile {
    return this.userProfileSubject.getValue();
  }

  updateProfile(profile: Partial<UserProfile>): void {
    const updated = { ...this.currentProfile, ...profile };
    this.userProfileSubject.next(updated);
  }

  resetProfile(): void {
    this.userProfileSubject.next(this.defaultProfile);
  }

  // Registrar nuevo usuario con datos del formulario de registro
  registerUser(registrationData: {
    email: string;
    country: string;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    username: string;
    password: string;
  }): void {
    const newProfile: UserProfile = {
      ...this.defaultProfile,
      email: registrationData.email,
      country: registrationData.country,
      birthDate: {
        year: registrationData.birthYear,
        month: registrationData.birthMonth,
        day: registrationData.birthDay
      },
      username: registrationData.username,
      password: registrationData.password,
      displayName: registrationData.username // Por defecto, el nombre mostrado es el username
    };
    this.userProfileSubject.next(newProfile);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.currentProfile.email !== '' && this.currentProfile.username !== '';
  }
}
