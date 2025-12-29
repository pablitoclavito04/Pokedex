// ============================================================================
//          PROFILE PAGE - Página de perfil del usuario
// ============================================================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService, UserProfile } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  constructor(
    private location: Location,
    private userService: UserService
  ) {}

  // ========== DATOS DEL USUARIO ==========
  user: UserProfile & { joinDate: string; stats: { favorites: number; captured: number; quizScore: number } } = {
    avatar: null,
    username: '',
    displayName: '',
    bio: '',
    gender: '',
    favoriteRegion: '',
    language: '',
    joinDate: 'Enero 2024',
    stats: {
      favorites: 24,
      captured: 151,
      quizScore: 850
    }
  };

  // ========== REGIONES DISPONIBLES ==========
  regions = [
    { name: 'Kanto', value: 'kanto' },
    { name: 'Johto', value: 'johto' },
    { name: 'Hoenn', value: 'hoenn' },
    { name: 'Sinnoh', value: 'sinnoh' },
    { name: 'Teselia', value: 'unova' },
    { name: 'Kalos', value: 'kalos' },
    { name: 'Alola', value: 'alola' },
    { name: 'Galar', value: 'galar' },
    { name: 'Paldea', value: 'paldea' }
  ];

  // ========== ESTADO DE EDICIÓN ==========
  isEditing: boolean = false;
  editedBio: string = '';

  ngOnInit(): void {
    // Suscribirse a cambios en el perfil del usuario
    this.subscription = this.userService.userProfile$.subscribe(profile => {
      this.user = {
        ...profile,
        joinDate: this.user.joinDate,
        stats: this.user.stats
      };
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // ========== MÉTODOS ==========
  goBack(): void {
    this.location.back();
  }

  onAvatarClick(): void {
    // Aquí se abriría el selector de archivo para cambiar el avatar
    console.log('Cambiar avatar');
  }

  startEditBio(): void {
    this.editedBio = this.user.bio;
    this.isEditing = true;
  }

  saveBio(): void {
    this.user.bio = this.editedBio;
    this.userService.updateProfile({ bio: this.editedBio });
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  navigateToSettings(): void {
    console.log('Navegando a ajustes...');
  }

  navigateToFavorites(): void {
    console.log('Navegando a favoritos...');
  }
}
