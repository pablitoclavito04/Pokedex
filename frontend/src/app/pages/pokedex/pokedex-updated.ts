// ============================================================================
//          POKEDEX PAGE - Actualización con Signals y Debounce (Fase 6)
// ============================================================================

import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FavoritoService } from '../../../services/favorito.service';
import { AuthService } from '../../../services/auth.service';
import { PokemonService } from '../../../services/pokemon.service';
import { PokemonStore } from '../../../stores/pokemon.store';
import { forkJoin, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.scss',
  changeDetection: ChangeDetectionStrategy.OnPush // Optimización Fase 6
})
export class PokedexComponent implements OnInit {
  // ========== DEPENDENCY INJECTION ==========
  private router = inject(Router);
  private favoritoService = inject(FavoritoService);
  private authService = inject(AuthService);
  private pokemonService = inject(PokemonService);
  private pokemonStore = inject(PokemonStore); // Nuevo Store con Signals
  private cdr = inject(ChangeDetectorRef);

  // ========== BÚSQUEDA CON DEBOUNCE (Fase 6) ==========
  searchControl = new FormControl('');

  // Signal para controlar si estamos buscando
  isSearching = signal(false);

  // ========== ESTADO ==========
  pokemons: any[] = [];
  allPokemons: any[] = [];
  allPokemonNames: {id: number, name: string}[] = [];
  sortedPokemonNames: {id: number, name: string}[] = [];
  filteredPokemonIds: {id: number, name: string}[] = [];
  isLoading = false;
  currentOffset = 0;
  filterOffset = 0;
  limit = 16;
  totalPokemon = 1025;
  isRandomMode = false;
  isFilterMode = false;

  // ========== RANGOS DE GENERACIONES ==========
  generationRanges: Record<string, {start: number, end: number}> = {
    '1': { start: 1, end: 151 },
    '2': { start: 152, end: 251 },
    '3': { start: 252, end: 386 },
    '4': { start: 387, end: 493 },
    '5': { start: 494, end: 649 },
    '6': { start: 650, end: 721 },
    '7': { start: 722, end: 809 },
    '8': { start: 810, end: 905 },
    '9': { start: 906, end: 1025 }
  };

  // ========== FILTROS DE TIPO ==========
  types = [
    { name: 'Todos', value: 'all', color: '#A8A8A8', icon: '⚪' },
    { name: 'Fuego', value: 'fire', color: '#F08030', icon: '🔥' },
    { name: 'Agua', value: 'water', color: '#6890F0', icon: '💧' },
    { name: 'Planta', value: 'grass', color: '#78C850', icon: '🌿' },
    { name: 'Eléctrico', value: 'electric', color: '#F8D030', icon: '⚡' },
    { name: 'Hielo', value: 'ice', color: '#98D8D8', icon: '❄️' },
    { name: 'Lucha', value: 'fighting', color: '#C03028', icon: '👊' },
    { name: 'Veneno', value: 'poison', color: '#A040A0', icon: '☠️' },
    { name: 'Tierra', value: 'ground', color: '#E0C068', icon: '🏜️' },
    { name: 'Volador', value: 'flying', color: '#A890F0', icon: '🕊️' },
    { name: 'Psíquico', value: 'psychic', color: '#F85888', icon: '🔮' },
    { name: 'Bicho', value: 'bug', color: '#A8B820', icon: '🐛' },
    { name: 'Roca', value: 'rock', color: '#B8A038', icon: '🪨' },
    { name: 'Fantasma', value: 'ghost', color: '#705898', icon: '👻' },
    { name: 'Dragón', value: 'dragon', color: '#7038F8', icon: '🐉' },
    { name: 'Siniestro', value: 'dark', color: '#705848', icon: '🌑' },
    { name: 'Acero', value: 'steel', color: '#B8B8D0', icon: '⚙️' },
    { name: 'Hada', value: 'fairy', color: '#EE99AC', icon: '✨' },
    { name: 'Normal', value: 'normal', color: '#A8A878', icon: '⭐' }
  ];

  // ========== FILTROS DE GENERACIÓN ==========
  generations = [
    { name: 'Todas', value: 'all' },
    { name: '1ª Gen', value: '1' },
    { name: '2ª Gen', value: '2' },
    { name: '3ª Gen', value: '3' },
    { name: '4ª Gen', value: '4' },
    { name: '5ª Gen', value: '5' },
    { name: '6ª Gen', value: '6' },
    { name: '7ª Gen', value: '7' },
    { name: '8ª Gen', value: '8' },
    { name: '9ª Gen', value: '9' }
  ];

  // ========== TIPOS PARA BÚSQUEDA AVANZADA ==========
  advancedTypes = [
    { name: 'Normal', value: 'normal', color: '#A8A878', typeSelected: false, weaknessSelected: false },
    { name: 'Fuego', value: 'fire', color: '#F08030', typeSelected: false, weaknessSelected: false },
    { name: 'Agua', value: 'water', color: '#6890F0', typeSelected: false, weaknessSelected: false },
    { name: 'Planta', value: 'grass', color: '#78C850', typeSelected: false, weaknessSelected: false },
    { name: 'Eléctrico', value: 'electric', color: '#F8D030', typeSelected: false, weaknessSelected: false },
    { name: 'Hielo', value: 'ice', color: '#98D8D8', typeSelected: false, weaknessSelected: false },
    { name: 'Lucha', value: 'fighting', color: '#C03028', typeSelected: false, weaknessSelected: false },
    { name: 'Veneno', value: 'poison', color: '#A040A0', typeSelected: false, weaknessSelected: false },
    { name: 'Tierra', value: 'ground', color: '#E0C068', typeSelected: false, weaknessSelected: false },
    { name: 'Volador', value: 'flying', color: '#A890F0', typeSelected: false, weaknessSelected: false },
    { name: 'Psíquico', value: 'psychic', color: '#F85888', typeSelected: false, weaknessSelected: false },
    { name: 'Bicho', value: 'bug', color: '#A8B820', typeSelected: false, weaknessSelected: false },
    { name: 'Roca', value: 'rock', color: '#B8A038', typeSelected: false, weaknessSelected: false },
    { name: 'Fantasma', value: 'ghost', color: '#705898', typeSelected: false, weaknessSelected: false },
    { name: 'Siniestro', value: 'dark', color: '#705848', typeSelected: false, weaknessSelected: false },
    { name: 'Dragón', value: 'dragon', color: '#7038F8', typeSelected: false, weaknessSelected: false },
    { name: 'Acero', value: 'steel', color: '#B8B8D0', typeSelected: false, weaknessSelected: false },
    { name: 'Hada', value: 'fairy', color: '#EE99AC', typeSelected: false, weaknessSelected: false }
  ];

  // ========== ESTADO DE FILTROS ==========
  selectedType: string = 'all';
  selectedGeneration: string = 'all';
  searchQuery: string = '';
  showAdvancedSearch: boolean = false;
  isAdvancedSearchClosing: boolean = false;
  selectedHeight: string = '';
  selectedWeight: string = '';
  sequenceStart: number = 1;
  sequenceEnd: number = 1025;
  isGenerationSelectOpen: boolean = false;
  sortOrder: string = 'number-asc';

  // ========== ESTADO DE HOVER (para eventos mouseenter/mouseleave) ==========
  hoveredPokemonId: number | null = null;

  // Clave para persistir el orden en sessionStorage
  private readonly SORT_ORDER_KEY = 'pokedex_sort_order';
  private readonly FILTER_STATE_KEY = 'pokedex_filter_state';

  // Filtros activos para cargar más
  activeFilters = {
    types: [] as string[],
    height: '',
    weight: ''
  };

  ngOnInit(): void {
    // Recuperar el orden guardado en sessionStorage
    const savedSortOrder = sessionStorage.getItem(this.SORT_ORDER_KEY);
    if (savedSortOrder) {
      this.sortOrder = savedSortOrder;
    }

    // Recuperar el estado de filtros guardado
    const savedFilterState = sessionStorage.getItem(this.FILTER_STATE_KEY);

    // ========== CONFIGURAR BÚSQUEDA CON DEBOUNCE (Fase 6) ==========
    this.searchControl.valueChanges.pipe(
      debounceTime(300),           // Espera 300ms después de escribir
      distinctUntilChanged()       // Solo si cambió el valor
    ).subscribe(query => {
      this.searchQuery = query || '';
      this.onSearchChange();
      this.cdr.markForCheck(); // Necesario con OnPush
    });

    this.pokemonService.getAllPokemonNames().subscribe(names => {
      this.allPokemonNames = names;
      this.sortedPokemonNames = [...names];

      // Si hay filtros guardados, restaurarlos y aplicarlos
      if (savedFilterState) {
        this.restoreFilterState(JSON.parse(savedFilterState));
      } else {
        this.loadPokemonsBySort();
      }
    });

    if (this.authService.isLoggedIn()) {
      this.favoritoService.cargarFavoritos();
      this.favoritoService.favoritos$.subscribe(favoritos => {
        this.pokemons.forEach(pokemon => {
          pokemon.isFavorite = favoritos.includes(pokemon.id);
        });
        this.cdr.detectChanges();
      });
    }
  }

  // ========== CARGAR POKÉMON SEGÚN ORDEN ==========
  loadPokemonsBySort(): void {
    this.isLoading = true;
    this.pokemons = [];
    this.allPokemons = [];
    this.currentOffset = 0;
    this.isRandomMode = false;
    this.isFilterMode = false;
    this.cdr.detectChanges();

    switch (this.sortOrder) {
      case 'number-asc':
        this.sortedPokemonNames = [...this.allPokemonNames].sort((a, b) => a.id - b.id);
        break;
      case 'number-desc':
        this.sortedPokemonNames = [...this.allPokemonNames].sort((a, b) => b.id - a.id);
        break;
      case 'name-asc':
        this.sortedPokemonNames = [...this.allPokemonNames].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.sortedPokemonNames = [...this.allPokemonNames].sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    this.loadMorePokemonSorted();
  }

  loadMorePokemonSorted(): void {
    if (this.isLoading && this.pokemons.length > 0) return;
    if (this.currentOffset >= this.sortedPokemonNames.length) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    const nextBatch = this.sortedPokemonNames.slice(this.currentOffset, this.currentOffset + this.limit);

    const newPokemons = nextBatch.map(p => {
      const pokemon = {
        id: p.id,
        name: p.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
        types: [] as string[],
        height: 0,
        weight: 0,
        isFavorite: false
      };
      this.loadPokemonDetails(pokemon);
      return pokemon;
    });

    this.pokemons = [...this.pokemons, ...newPokemons];
    this.allPokemons = [...this.pokemons];
    this.currentOffset += this.limit;
    this.isLoading = false;

    if (this.authService.isLoggedIn()) {
      const favoritos = this.favoritoService.getFavoritos();
      this.pokemons.forEach(p => {
        p.isFavorite = favoritos.includes(p.id);
      });
    }

    this.cdr.detectChanges();
  }

  loadPokemonDetails(pokemon: any): void {
    this.pokemonService.getPokemonDetails(pokemon.id).subscribe({
      next: (details) => {
        pokemon.types = details.types.map(t => t.name.toLowerCase());
        pokemon.height = details.height;
        pokemon.weight = details.weight;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando detalles:', err)
    });
  }

  loadMorePokemon(): void {
    if (this.isFilterMode) {
      this.loadMoreFilteredPokemon();
    } else if (!this.isLoading && this.currentOffset < this.sortedPokemonNames.length) {
      this.loadMorePokemonSorted();
    }
  }

  // ========== SORPRÉNDEME ==========
  onSurprise(): void {
    this.isLoading = true;
    this.isRandomMode = true;
    this.isFilterMode = false;
    this.searchQuery = '';
    this.searchControl.setValue('', { emitEvent: false }); // No trigger debounce
    this.cdr.detectChanges();

    const randomIds: number[] = [];
    while (randomIds.length < this.limit) {
      const randomId = Math.floor(Math.random() * this.totalPokemon) + 1;
      if (!randomIds.includes(randomId)) {
        randomIds.push(randomId);
      }
    }

    this.pokemons = randomIds.map(id => {
      const nameData = this.allPokemonNames.find(p => p.id === id);
      const pokemon = {
        id,
        name: nameData ? nameData.name : `Pokemon #${id}`,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        types: [] as string[],
        height: 0,
        weight: 0,
        isFavorite: false
      };
      this.loadPokemonDetails(pokemon);
      return pokemon;
    });

    if (this.authService.isLoggedIn()) {
      const favoritos = this.favoritoService.getFavoritos();
      this.pokemons.forEach(p => {
        p.isFavorite = favoritos.includes(p.id);
      });
    }

    this.isLoading = false;
    this.cdr.detectChanges();
  }

  // ========== BÚSQUEDA (con debounce automático) ==========
  onSearchKeydown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const key = event.key;

    // Permitir teclas de control (backspace, delete, flechas, etc.)
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(key)) {
      return;
    }

    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    // Si el contenido actual es solo números y ya tiene 4 dígitos, bloquear más números
    const isCurrentlyNumeric = /^\d*$/.test(currentValue);
    const isKeyNumeric = /^\d$/.test(key);

    if (isCurrentlyNumeric && isKeyNumeric && currentValue.length >= 4) {
      event.preventDefault();
    }
  }

  /**
   * Evento (keyup) - Se dispara al soltar una tecla
   * Útil para detectar cuando el usuario termina de escribir un carácter
   */
  onSearchKeyup(event: KeyboardEvent): void {
    // Log para demostrar el uso de $event con KeyboardEvent
    console.log('Tecla soltada:', event.key, 'Código:', event.code);
  }

  /**
   * Evento (mouseenter) - Se dispara cuando el mouse entra en la tarjeta
   * Permite efectos de hover programáticos
   */
  onCardMouseEnter(event: MouseEvent, pokemonId: number): void {
    this.hoveredPokemonId = pokemonId;
    // El $event contiene información del MouseEvent
    console.log('Mouse enter en Pokémon:', pokemonId, 'Posición:', event.clientX, event.clientY);
  }

  /**
   * Evento (mouseleave) - Se dispara cuando el mouse sale de la tarjeta
   */
  onCardMouseLeave(event: MouseEvent, pokemonId: number): void {
    this.hoveredPokemonId = null;
    console.log('Mouse leave de Pokémon:', pokemonId);
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Si es solo números y tiene más de 4 dígitos, truncar a 4
    if (/^\d+$/.test(value) && value.length > 4) {
      value = value.slice(0, 4);
      this.searchControl.setValue(value, { emitEvent: true });
      input.value = value;
    }

    // El debounce se encarga automáticamente de llamar a onSearchChange()
  }

  onSearchChange(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (query === '') {
      this.isRandomMode = false;
      this.isFilterMode = false;
      this.pokemons = [...this.allPokemons];
      this.cdr.detectChanges();
      return;
    }

    this.isSearching.set(true);
    this.isRandomMode = false;
    this.isFilterMode = false;

    // Comprobar si el query es un número (incluyendo ceros a la izquierda como 01, 001, etc.)
    const numericQuery = parseInt(query, 10);
    const isNumericSearch = /^\d+$/.test(query) && !isNaN(numericQuery) && numericQuery > 0;

    let matchingNames: {id: number, name: string}[];

    if (isNumericSearch) {
      // Búsqueda por número exacto (01 → 1, 001 → 1, etc.)
      matchingNames = this.allPokemonNames.filter(p => p.id === numericQuery);
    } else {
      // Búsqueda por nombre que contenga el texto
      matchingNames = this.allPokemonNames.filter(p =>
        p.name.toLowerCase().includes(query)
      );
    }

    let sortedMatches = [...matchingNames];
    switch (this.sortOrder) {
      case 'number-asc':
        sortedMatches.sort((a, b) => a.id - b.id);
        break;
      case 'number-desc':
        sortedMatches.sort((a, b) => b.id - a.id);
        break;
      case 'name-asc':
        sortedMatches.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortedMatches.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    this.pokemons = sortedMatches.slice(0, 50).map(p => {
      const existing = this.allPokemons.find(ap => ap.id === p.id);
      if (existing) {
        return existing;
      }
      const newPokemon = {
        id: p.id,
        name: p.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
        types: [] as string[],
        height: 0,
        weight: 0,
        isFavorite: false
      };
      this.loadPokemonDetails(newPokemon);
      return newPokemon;
    });

    if (this.authService.isLoggedIn()) {
      const favoritos = this.favoritoService.getFavoritos();
      this.pokemons.forEach(p => {
        p.isFavorite = favoritos.includes(p.id);
      });
    }

    this.isSearching.set(false);
    this.cdr.detectChanges();
  }

  // ========== ORDENAR ==========
  onSortChange(): void {
    // Guardar el orden en sessionStorage para persistirlo
    sessionStorage.setItem(this.SORT_ORDER_KEY, this.sortOrder);

    this.isRandomMode = false;
    if (this.isFilterMode) {
      this.sortFilteredIds();
      this.filterOffset = 0;
      this.pokemons = [];
      this.loadMoreFilteredPokemon();
    } else if (this.searchQuery.trim() !== '') {
      this.onSearchChange();
    } else {
      this.loadPokemonsBySort();
    }
  }

  sortFilteredIds(): void {
    switch (this.sortOrder) {
      case 'number-asc':
        this.filteredPokemonIds.sort((a, b) => a.id - b.id);
        break;
      case 'number-desc':
        this.filteredPokemonIds.sort((a, b) => b.id - a.id);
        break;
      case 'name-asc':
        this.filteredPokemonIds.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredPokemonIds.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
  }

  // ========== MÉTODOS ==========
  toggleAdvancedSearch(): void {
    if (this.isAdvancedSearchClosing) {
      return;
    }

    if (this.showAdvancedSearch) {
      this.isAdvancedSearchClosing = true;
      setTimeout(() => {
        this.showAdvancedSearch = false;
        this.isAdvancedSearchClosing = false;
        this.cdr.detectChanges();
      }, 300);
    } else {
      this.showAdvancedSearch = true;
    }
    this.cdr.detectChanges();
  }

  get isAdvancedSearchOpen(): boolean {
    return this.showAdvancedSearch && !this.isAdvancedSearchClosing;
  }

  selectType(type: string): void {
    this.selectedType = type;
  }

  selectGeneration(gen: string): void {
    this.selectedGeneration = gen;
  }

  getTypeColor(type: string): string {
    const typeObj = this.types.find(t => t.value === type.toLowerCase());
    return typeObj ? typeObj.color : '#A8A8A8';
  }

  getTypeName(type: string): string {
    const typeObj = this.types.find(t => t.value === type.toLowerCase());
    return typeObj ? typeObj.name : type;
  }

  getTypeIcon(type: string): string {
    const typeObj = this.types.find(t => t.value === type.toLowerCase());
    return typeObj ? typeObj.icon : '⭐';
  }

  formatPokemonId(id: number): string {
    return `#${id.toString().padStart(4, '0')}`;
  }

  getCardBackground(types: string[]): string {
    if (types.length === 0) return '#A8A8A8';
    if (types.length === 1) {
      return this.getTypeColor(types[0]);
    }
    const color1 = this.getTypeColor(types[0]);
    const color2 = this.getTypeColor(types[1]);
    return `linear-gradient(135deg, ${color1} 50%, ${color2} 50%)`;
  }

  toggleFavorite(event: Event, pokemonId: number): void {
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const button = event.currentTarget as HTMLElement;
    const pokemon = this.pokemons.find(p => p.id === pokemonId);

    if (pokemon) {
      button.classList.add('animate-wave');
      button.classList.add('animate-heart-beat');

      setTimeout(() => button.classList.remove('animate-wave'), 600);
      setTimeout(() => button.classList.remove('animate-heart-beat'), 400);

      this.favoritoService.toggleFavorito(pokemonId).subscribe({
        next: (response) => {
          pokemon.isFavorite = response.esFavorito;
          console.log(`${pokemon.name} favorito: ${pokemon.isFavorite}`);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cambiar favorito:', err);
        }
      });
    }
  }

  // ========== MÉTODOS BÚSQUEDA AVANZADA ==========
  toggleTypeFilter(typeValue: string, filterType: 'type' | 'weakness'): void {
    const type = this.advancedTypes.find(t => t.value === typeValue);
    if (type) {
      if (filterType === 'type') {
        type.typeSelected = !type.typeSelected;
      } else {
        type.weaknessSelected = !type.weaknessSelected;
      }
    }
  }

  selectHeight(height: string): void {
    this.selectedHeight = this.selectedHeight === height ? '' : height;
  }

  selectWeight(weight: string): void {
    this.selectedWeight = this.selectedWeight === weight ? '' : weight;
  }

  toggleGenerationSelect(): void {
    this.isGenerationSelectOpen = !this.isGenerationSelectOpen;
  }

  closeGenerationSelect(): void {
    this.isGenerationSelectOpen = false;
  }

  resetFilters(): void {
    this.advancedTypes.forEach(type => {
      type.typeSelected = false;
      type.weaknessSelected = false;
    });
    this.selectedGeneration = 'all';
    this.selectedHeight = '';
    this.selectedWeight = '';
    this.sequenceStart = 1;
    this.sequenceEnd = 1025;
    this.searchQuery = '';
    this.searchControl.setValue('', { emitEvent: false });
    this.isRandomMode = false;
    this.isFilterMode = false;

    // Limpiar estado de filtros guardado
    sessionStorage.removeItem(this.FILTER_STATE_KEY);

    this.loadPokemonsBySort();
  }

  applyFilters(): void {
    this.isLoading = true;
    this.isFilterMode = true;
    this.isRandomMode = false;
    this.searchQuery = '';
    this.searchControl.setValue('', { emitEvent: false });
    this.pokemons = [];
    this.filterOffset = 0;
    this.cdr.detectChanges();

    // Guardar filtros activos
    this.activeFilters.types = this.advancedTypes.filter(t => t.typeSelected).map(t => t.value);
    this.activeFilters.height = this.selectedHeight;
    this.activeFilters.weight = this.selectedWeight;

    // Guardar estado de filtros en sessionStorage
    this.saveFilterState();

    // Filtrar por secuencia (rango de IDs)
    let filteredIds = this.allPokemonNames.filter(p =>
      p.id >= this.sequenceStart && p.id <= this.sequenceEnd
    );

    // Filtrar por generación
    if (this.selectedGeneration !== 'all') {
      const genRange = this.generationRanges[this.selectedGeneration];
      if (genRange) {
        filteredIds = filteredIds.filter(p =>
          p.id >= genRange.start && p.id <= genRange.end
        );
      }
    }

    // Guardar IDs filtrados para paginación
    this.filteredPokemonIds = filteredIds;
    this.sortFilteredIds();

    // Cargar el primer lote
    this.loadMoreFilteredPokemon();
  }

  // Guardar estado de filtros en sessionStorage
  private saveFilterState(): void {
    const filterState = {
      types: this.advancedTypes.filter(t => t.typeSelected).map(t => t.value),
      generation: this.selectedGeneration,
      height: this.selectedHeight,
      weight: this.selectedWeight,
      sequenceStart: this.sequenceStart,
      sequenceEnd: this.sequenceEnd
    };
    sessionStorage.setItem(this.FILTER_STATE_KEY, JSON.stringify(filterState));
  }

  // Restaurar estado de filtros desde sessionStorage
  private restoreFilterState(state: any): void {
    // Restaurar tipos seleccionados
    if (state.types && state.types.length > 0) {
      this.advancedTypes.forEach(t => {
        t.typeSelected = state.types.includes(t.value);
      });
    }

    // Restaurar otros filtros
    this.selectedGeneration = state.generation || 'all';
    this.selectedHeight = state.height || '';
    this.selectedWeight = state.weight || '';
    this.sequenceStart = state.sequenceStart || 1;
    this.sequenceEnd = state.sequenceEnd || 1025;

    // Aplicar los filtros restaurados
    this.applyFilters();
  }

  loadMoreFilteredPokemon(): void {
    if (this.isLoading && this.pokemons.length > 0) return;
    if (this.filterOffset >= this.filteredPokemonIds.length) {
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    // Queremos cargar 16 más a los que ya tenemos
    const targetCount = this.pokemons.length + 16;
    // Aumentar intentos para asegurar que siempre completamos filas de 4
    const maxAttempts = 20;

    this.loadFilteredBatch(targetCount, 0, maxAttempts);
  }

  private loadFilteredBatch(targetCount: number, currentAttempt: number, maxAttempts: number): void {
    if (this.filterOffset >= this.filteredPokemonIds.length || currentAttempt >= maxAttempts) {
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    // Cargar lotes más grandes para compensar los filtros
    const batchSize = 50;
    const nextBatch = this.filteredPokemonIds.slice(this.filterOffset, this.filterOffset + batchSize);

    if (nextBatch.length === 0) {
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    const pokemonObservables = nextBatch.map(p => this.pokemonService.getPokemonDetails(p.id));

    forkJoin(pokemonObservables).subscribe({
      next: (pokemonDetails) => {
        let results = pokemonDetails.map(details => ({
          id: details.id,
          name: details.name,
          image: details.image,
          types: details.types.map(t => t.name.toLowerCase()),
          height: details.height,
          weight: details.weight,
          isFavorite: false
        }));

        // Filtrar por tipo
        if (this.activeFilters.types.length > 0) {
          results = results.filter(p =>
            p.types.some(t => this.activeFilters.types.includes(t))
          );
        }

        // Filtrar por altura (en metros, ya convertido por el servicio)
        // Pequeño: <= 1m, Mediano: 1.1m - 2m, Grande: >= 2.1m
        if (this.activeFilters.height) {
          results = results.filter(p => {
            const h = p.height;
            switch (this.activeFilters.height) {
              case 'small': return h <= 1;
              case 'medium': return h >= 1.1 && h <= 2;
              case 'large': return h >= 2.1;
              default: return true;
            }
          });
        }

        // Filtrar por peso (en kg, ya convertido por el servicio)
        // Ligero: 0.1 - 20kg, Mediano: 20.1 - 60kg, Pesado: >= 60.1kg
        if (this.activeFilters.weight) {
          results = results.filter(p => {
            const w = p.weight;
            switch (this.activeFilters.weight) {
              case 'light': return w <= 20;
              case 'medium': return w >= 20.1 && w <= 60;
              case 'heavy': return w >= 60.1;
              default: return true;
            }
          });
        }

        // Verificar favoritos
        if (this.authService.isLoggedIn()) {
          const favoritos = this.favoritoService.getFavoritos();
          results.forEach(p => {
            p.isFavorite = favoritos.includes(p.id);
          });
        }

        // Añadir los resultados filtrados
        this.pokemons = [...this.pokemons, ...results];
        this.filterOffset += batchSize;

        // Verificar si la última fila está completa (múltiplo de 4)
        const isRowComplete = this.pokemons.length % 4 === 0;
        const hasReachedTarget = this.pokemons.length >= targetCount;

        // Seguir cargando si:
        // 1. No hemos llegado al target, O
        // 2. La fila está incompleta
        // Y todavía hay Pokémon por cargar
        if ((!hasReachedTarget || !isRowComplete) && this.filterOffset < this.filteredPokemonIds.length) {
          this.loadFilteredBatch(targetCount, currentAttempt + 1, maxAttempts);
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error aplicando filtros:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ========== NAVEGACIÓN AL DETALLE ==========
  goToPokemonDetail(pokemonId: number): void {
    this.router.navigate(['/pokemon', pokemonId]);
  }

  // ========== VERIFICAR SI HAY MÁS POKÉMON ==========
  get hasMorePokemon(): boolean {
    if (this.isFilterMode) {
      return this.filterOffset < this.filteredPokemonIds.length;
    }
    return this.currentOffset < this.sortedPokemonNames.length &&
           this.searchQuery === '' &&
           !this.isRandomMode;
  }

  // ========== TRACKBY PARA OPTIMIZACIÓN (Fase 6) ==========
  trackByPokemonId(index: number, pokemon: any): number {
    return pokemon.id;
  }
}
