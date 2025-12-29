// ============================================================================
//          USER SERVICE - Servicio para manejar datos del usuario
// ============================================================================

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  avatar: string | null;
  username: string;
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
    avatar: null,
    username: 'pokemon_trainer',
    displayName: 'Entrenador Pokémon',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    gender: 'Hombre',
    favoriteRegion: 'Kanto',
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
}
