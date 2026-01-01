// ============================================================================
//          PROFILE PAGE - Página de perfil del usuario
// ============================================================================

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { FavoritoService } from '../../../services/favorito.service';
import { PokemonService } from '../../../services/pokemon.service';
import { forkJoin, skip, take } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private favoritoService: FavoritoService,
    private pokemonService: PokemonService
  ) {}

  private fragment: string | null = null;

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
    // Suscribirse al fragmento de la URL
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
    });

    // Cargar datos del usuario desde sessionStorage
    const username = this.authService.getUsername();
    const email = sessionStorage.getItem('email');

    if (username) {
      this.user.username = username;
      this.user.displayName = sessionStorage.getItem('displayName') || username;
    }

    if (email) {
      this.user.email = email;
    }

    // Cargar avatar desde sessionStorage
    const savedAvatar = sessionStorage.getItem('userAvatar');
    if (savedAvatar) {
      this.user.avatar = savedAvatar;
    }

    // Cargar bio desde sessionStorage si existe
    const savedBio = sessionStorage.getItem('userBio');
    if (savedBio) {
      this.user.bio = savedBio;
    }

    // Cargar región favorita desde sessionStorage si existe
    const savedRegion = sessionStorage.getItem('userFavoriteRegion');
    if (savedRegion) {
      this.user.favoriteRegion = savedRegion;
    }

    // Fecha de registro
    this.user.joinDate = this.getJoinDate();

    // Cargar favoritos
    this.loadFavorites();
  }

  ngAfterViewInit(): void {
    // Hacer scroll al fragmento si existe
    if (this.fragment) {
      setTimeout(() => {
        const element = document.getElementById(this.fragment!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  loadFavorites(): void {
    this.isLoadingFavorites = true;

    // Verificar si ya hay favoritos cargados en memoria
    const currentFavoritos = this.favoritoService.getFavoritos();
    if (currentFavoritos.length > 0) {
      this.loadPokemonData(currentFavoritos);
    } else {
      // Si no hay datos en memoria, cargar del backend
      // Primero suscribirse para capturar el próximo valor (skip ignora el valor actual vacío)
      this.favoritoService.favoritos$.pipe(
        skip(1), // Ignorar el valor actual (vacío)
        take(1)  // Tomar solo el siguiente valor (respuesta del backend)
      ).subscribe(favoritos => {
        if (favoritos.length > 0) {
          this.loadPokemonData(favoritos);
        } else {
          // No hay favoritos
          this.favoritePokemon = [];
          this.isLoadingFavorites = false;
        }
      });

      // Luego disparar la carga del backend
      this.favoritoService.cargarFavoritos();
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
    sessionStorage.setItem('userBio', this.editedBio);
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