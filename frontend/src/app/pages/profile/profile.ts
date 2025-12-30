// ============================================================================
//          PROFILE PAGE - Página de perfil del usuario
// ============================================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { FavoritoService } from '../../../services/favorito.service';
import { PokemonService } from '../../../services/pokemon.service';
import { forkJoin, filter, take } from 'rxjs';

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
    private authService: AuthService,
    private favoritoService: FavoritoService,
    private pokemonService: PokemonService
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

  // ========== FAVORITOS ==========
  favoritePokemon: any[] = [];
  isLoadingFavorites: boolean = false;

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

    // Cargar favoritos
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoadingFavorites = true;

    // Verificar si ya hay favoritos cargados
    const currentFavoritos = this.favoritoService.getFavoritos();
    if (currentFavoritos.length > 0) {
      this.loadPokemonData(currentFavoritos);
    } else {
      // Si no hay datos, cargar del backend
      this.favoritoService.cargarFavoritos();

      // Esperar a que lleguen los datos del backend
      this.favoritoService.favoritos$.pipe(
        filter(favoritos => favoritos.length > 0),
        take(1)
      ).subscribe(favoritos => {
        this.loadPokemonData(favoritos);
      });

      // Timeout para manejar el caso de que no haya favoritos
      setTimeout(() => {
        if (this.isLoadingFavorites) {
          const favs = this.favoritoService.getFavoritos();
          if (favs.length === 0) {
            this.isLoadingFavorites = false;
          }
        }
      }, 1500);
    }
  }

  private loadPokemonData(favoritos: number[]): void {
    const orderedIds = [...favoritos];

    const requests = favoritos.map(id =>
      this.pokemonService.getPokemonById(id)
    );

    forkJoin(requests).subscribe({
      next: (pokemons: any[]) => {
        const pokemonMap = new Map<number, any>();
        pokemons.forEach(p => pokemonMap.set(p.id, p));

        this.favoritePokemon = orderedIds
          .map(id => pokemonMap.get(id))
          .filter(p => p !== undefined);

        this.isLoadingFavorites = false;
      },
      error: () => {
        this.isLoadingFavorites = false;
      }
    });
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

  navigateToPokemon(id: number): void {
    this.router.navigate(['/pokemon', id]);
  }
}