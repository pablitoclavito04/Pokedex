// ============================================================================
//          PROFILE PAGE - Página de perfil del usuario
// ============================================================================

import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, AuthResponse } from '../../services/auth.service';
import { FavoritoService } from '../../../services/favorito.service';
import { PokemonService } from '../../../services/pokemon.service';
import { ToastService } from '../../../services/toast.service';
import { forkJoin, take } from 'rxjs';

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
    private pokemonService: PokemonService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  private fragment: string | null = null;

  // ========== DATOS DEL USUARIO ==========
  user = {
    username: '',
    displayName: '',
    email: '',
    avatar: null as string | null,
    bio: 'Escribe algo sobre ti...',
    favoriteRegion: '', // Vacío por defecto - el usuario lo seleccionará
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

    // PRIMERO: Cargar datos inmediatamente desde sessionStorage (para mostrar algo rápido)
    this.loadProfileFromSessionStorage();

    // SEGUNDO: Intentar actualizar desde el backend (operación READ del CRUD)
    this.authService.getProfile().subscribe({
      next: (profileData: AuthResponse) => {
        // Actualizar datos del usuario con la respuesta del backend
        this.user.username = profileData.username;
        this.user.displayName = profileData.displayName || profileData.username;
        this.user.email = profileData.email;

        if (profileData.avatar) {
          this.user.avatar = profileData.avatar;
        }

        if (profileData.bio) {
          this.user.bio = profileData.bio;
        }

        if (profileData.favoriteRegion) {
          this.user.favoriteRegion = profileData.favoriteRegion;
        }

        // Fecha de registro
        this.user.joinDate = this.getJoinDate();

        // Cargar favoritos
        this.loadFavorites();
      },
      error: (err: any) => {
        // Si falla el backend, los datos ya están cargados desde sessionStorage
        console.error('Error actualizando perfil desde backend:', err);
        // Los datos ya se mostraron desde sessionStorage, así que solo cargamos favoritos
        this.loadFavorites();
      }
    });
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

    // Forzar la carga del backend
    this.favoritoService.cargarFavoritos();

    // Suscribirse al observable de favoritos (sin skip, para capturar el valor inmediatamente)
    this.favoritoService.favoritos$.pipe(
      take(1)  // Tomar el valor actual del BehaviorSubject
    ).subscribe(favoritos => {
      if (favoritos.length > 0) {
        this.loadPokemonData(favoritos);
      } else {
        // No hay favoritos
        this.favoritePokemon = [];
        this.isLoadingFavorites = false;
        this.cdr.detectChanges(); // Forzar detección de cambios
      }
    });
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
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      error: () => {
        this.isLoadingFavorites = false;
        this.cdr.detectChanges(); // Forzar detección de cambios
      }
    });
  }

  loadProfileFromSessionStorage(): void {
    const username = this.authService.getUsername();
    const email = sessionStorage.getItem('email');

    if (username) {
      this.user.username = username;
      this.user.displayName = sessionStorage.getItem('displayName') || username;
    }

    if (email) {
      this.user.email = email;
    }

    const savedAvatar = sessionStorage.getItem('userAvatar');
    if (savedAvatar) {
      this.user.avatar = savedAvatar;
    }

    const savedBio = sessionStorage.getItem('userBio');
    if (savedBio) {
      this.user.bio = savedBio;
    }

    const savedRegion = sessionStorage.getItem('userFavoriteRegion');
    if (savedRegion) {
      this.user.favoriteRegion = savedRegion;
    }

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
    sessionStorage.setItem('userBio', this.editedBio);
    this.isEditing = false;
    // Mostrar toast de confirmación usando ToastService (createElement/appendChild)
    this.toastService.success('Biografía actualizada');
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