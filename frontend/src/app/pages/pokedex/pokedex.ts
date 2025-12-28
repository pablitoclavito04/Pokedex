// ============================================================================
//          POKEDEX PAGE - Página principal de la Pokédex
// ============================================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.scss'
})
export class PokedexComponent {

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

  // ========== POKÉMON DE EJEMPLO ==========
  pokemons = [
    {
      id: 1,
      name: 'Bulbasaur',
      types: ['grass', 'poison'],
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      isFavorite: false
    },
    {
      id: 4,
      name: 'Charmander',
      types: ['fire'],
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
      isFavorite: false
    },
    {
      id: 7,
      name: 'Squirtle',
      types: ['water'],
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
      isFavorite: false
    },
    {
      id: 25,
      name: 'Pikachu',
      types: ['electric'],
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      isFavorite: false
    },
    {
      id: 39,
      name: 'Jigglypuff',
      types: ['normal', 'fairy'],
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png',
      isFavorite: false
    },
    {
      id: 94,
      name: 'Gengar',
      types: ['ghost', 'poison'],
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
      isFavorite: false
    },
    {
      id: 133,
      name: 'Eevee',
      types: ['normal'],
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
      isFavorite: false
    },
    {
      id: 143,
      name: 'Snorlax',
      types: ['normal'],
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
      isFavorite: false
    },
    {
      id: 150,
      name: 'Mewtwo',
      types: ['psychic'],
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
      isFavorite: false
    },
    {
      id: 151,
      name: 'Mew',
      types: ['psychic'],
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png',
      isFavorite: false
    },
    {
      id: 248,
      name: 'Tyranitar',
      types: ['rock', 'dark'],
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/248.png',
      isFavorite: false
    },
    {
      id: 282,
      name: 'Gardevoir',
      types: ['psychic', 'fairy'],
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/282.png',
      isFavorite: false
    }
  ];

  // ========== MÉTODOS ==========
  toggleAdvancedSearch(): void {
    // Evitar clics durante la animación de cierre
    if (this.isAdvancedSearchClosing) {
      return;
    }

    if (this.showAdvancedSearch) {
      // Cerrar con animación
      this.isAdvancedSearchClosing = true;
      setTimeout(() => {
        this.showAdvancedSearch = false;
        this.isAdvancedSearchClosing = false;
      }, 300);
    } else {
      // Abrir
      this.showAdvancedSearch = true;
    }
  }

  // Getter para el estado del botón (abierto/cerrado visualmente)
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
    const typeObj = this.types.find(t => t.value === type);
    return typeObj ? typeObj.color : '#A8A8A8';
  }

  getTypeName(type: string): string {
    const typeObj = this.types.find(t => t.value === type);
    return typeObj ? typeObj.name : type;
  }

  getTypeIcon(type: string): string {
    const typeObj = this.types.find(t => t.value === type);
    return typeObj ? typeObj.icon : '⭐';
  }

  formatPokemonId(id: number): string {
    return `#${id.toString().padStart(4, '0')}`;
  }

  getCardBackground(types: string[]): string {
    if (types.length === 1) {
      return this.getTypeColor(types[0]);
    }
    // Para dos tipos, crear gradiente
    const color1 = this.getTypeColor(types[0]);
    const color2 = this.getTypeColor(types[1]);
    return `linear-gradient(135deg, ${color1} 50%, ${color2} 50%)`;
  }

  loadMorePokemon(): void {
    // Aquí irá la lógica para cargar más Pokémon desde la API
    console.log('Cargando más Pokémon...');
  }

  toggleFavorite(event: Event, pokemonId: number): void {
    event.stopPropagation();
    const button = event.currentTarget as HTMLElement;
    const pokemon = this.pokemons.find(p => p.id === pokemonId);

    if (pokemon) {
      // Añadir animaciones
      button.classList.add('animate-wave');
      button.classList.add('animate-heart-beat');

      // Remover las clases después de las animaciones
      setTimeout(() => button.classList.remove('animate-wave'), 600);
      setTimeout(() => button.classList.remove('animate-heart-beat'), 400);

      // Toggle del estado
      pokemon.isFavorite = !pokemon.isFavorite;
      console.log(`${pokemon.name} favorito: ${pokemon.isFavorite}`);
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
  }

  applyFilters(): void {
    // Aquí irá la lógica para aplicar los filtros
    console.log('Aplicando filtros...');
    console.log('Tipos seleccionados:', this.advancedTypes.filter(t => t.typeSelected));
    console.log('Debilidades seleccionadas:', this.advancedTypes.filter(t => t.weaknessSelected));
    console.log('Generación:', this.selectedGeneration);
    console.log('Altura:', this.selectedHeight);
    console.log('Peso:', this.selectedWeight);
    console.log('Secuencia:', this.sequenceStart, '-', this.sequenceEnd);
  }
}
