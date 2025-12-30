// ============================================================================
//          PROFILE PAGE - Página de perfil del usuario
// ============================================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // ========== DATOS DEL USUARIO ==========
  user = {
    username: '',
    displayName: '',
    email: '',
    avatar: null as string | null,
    bio: 'Escribe algo sobre ti...',
    favoriteRegion: 'Kanto',
    joinDate: '',
    stats: {
      favorites: 0,
      captured: 0,
      quizScore: 0
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
    // Cargar datos del usuario desde localStorage
    const username = this.authService.getUsername();
    const email = localStorage.getItem('email');

    if (username) {
      this.user.username = username;
      this.user.displayName = localStorage.getItem('displayName') || username;
    }

    if (email) {
      this.user.email = email;
    }

    // Cargar avatar desde localStorage
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      this.user.avatar = savedAvatar;
    }

    // Cargar bio desde localStorage si existe
    const savedBio = localStorage.getItem('userBio');
    if (savedBio) {
      this.user.bio = savedBio;
    }

    // Cargar región favorita desde localStorage si existe
    const savedRegion = localStorage.getItem('userFavoriteRegion');
    if (savedRegion) {
      this.user.favoriteRegion = savedRegion;
    }

    // Fecha de registro
    this.user.joinDate = this.getJoinDate();
  }

  getJoinDate(): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  // ========== MÉTODOS ==========
  goBack(): void {
    this.router.navigate(['/pokedex']);
  }

  onAvatarClick(): void {
    console.log('Cambiar avatar');
  }

  startEditBio(): void {
    this.editedBio = this.user.bio;
    this.isEditing = true;
  }

  saveBio(): void {
    this.user.bio = this.editedBio;
    localStorage.setItem('userBio', this.editedBio);
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }

  navigateToFavorites(): void {
    this.router.navigate(['/favorites']);
  }
}