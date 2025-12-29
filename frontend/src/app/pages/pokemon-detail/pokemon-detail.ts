// ============================================================================
//          POKEMON DETAIL PAGE - Página de detalle del Pokémon
// ============================================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  category: string;
  ability: string;
  abilityDescription?: string;
  gender: { male: boolean; female: boolean };
  description: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  evolutions: {
    id: number;
    name: string;
    types: string[];
    image: string;
    level?: number;
  }[];
  weaknesses: string[];
  image: string;
  versions?: string[];
}

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss'
})
export class PokemonDetailComponent implements OnInit {

  // ========== DATOS DEL POKÉMON ==========
  pokemon: Pokemon = {
    id: 1,
    name: 'Bulbasaur',
    types: ['grass', 'poison'],
    height: 0.7,
    weight: 6.9,
    category: 'Semilla',
    ability: 'Espesura',
    abilityDescription: 'Potencia los movimientos de tipo Planta en un apuro.',
    gender: { male: true, female: true },
    description: 'Tras nacer, crece alimentándose durante un tiempo de los nutrientes que contiene el bulbo de su lomo.',
    stats: {
      hp: 45,
      attack: 49,
      defense: 49,
      spAttack: 65,
      spDefense: 65,
      speed: 45
    },
    evolutions: [
      {
        id: 1,
        name: 'Bulbasaur',
        types: ['grass', 'poison'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
      },
      {
        id: 2,
        name: 'Ivysaur',
        types: ['grass', 'poison'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
        level: 16
      },
      {
        id: 3,
        name: 'Venusaur',
        types: ['grass', 'poison'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
        level: 32
      }
    ],
    weaknesses: ['fire', 'ice', 'flying', 'psychic'],
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    versions: ['sol', 'luna']
  };

  // ========== TIPOS DE POKÉMON ==========
  types = [
    { name: 'Normal', value: 'normal', color: '#A8A878' },
    { name: 'Fuego', value: 'fire', color: '#F08030' },
    { name: 'Agua', value: 'water', color: '#6890F0' },
    { name: 'Planta', value: 'grass', color: '#78C850' },
    { name: 'Eléctrico', value: 'electric', color: '#F8D030' },
    { name: 'Hielo', value: 'ice', color: '#98D8D8' },
    { name: 'Lucha', value: 'fighting', color: '#C03028' },
    { name: 'Veneno', value: 'poison', color: '#A040A0' },
    { name: 'Tierra', value: 'ground', color: '#E0C068' },
    { name: 'Volador', value: 'flying', color: '#A890F0' },
    { name: 'Psíquico', value: 'psychic', color: '#F85888' },
    { name: 'Bicho', value: 'bug', color: '#A8B820' },
    { name: 'Roca', value: 'rock', color: '#B8A038' },
    { name: 'Fantasma', value: 'ghost', color: '#705898' },
    { name: 'Dragón', value: 'dragon', color: '#7038F8' },
    { name: 'Siniestro', value: 'dark', color: '#705848' },
    { name: 'Acero', value: 'steel', color: '#B8B8D0' },
    { name: 'Hada', value: 'fairy', color: '#EE99AC' }
  ];

  // Navegación entre Pokémon
  previousPokemon: { id: number; name: string } | null = null;
  nextPokemon: { id: number; name: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadPokemon(id);
    });
  }

  loadPokemon(id: number): void {
    // Aquí irá la lógica para cargar los datos desde la API
    // Por ahora usamos datos de ejemplo
    this.setupNavigation(id);
  }

  setupNavigation(currentId: number): void {
    // Configurar navegación anterior/siguiente
    if (currentId > 1) {
      this.previousPokemon = {
        id: currentId - 1,
        name: this.getPokemonName(currentId - 1)
      };
    } else {
      this.previousPokemon = {
        id: 1025,
        name: 'Pecharunt'
      };
    }

    if (currentId < 1025) {
      this.nextPokemon = {
        id: currentId + 1,
        name: this.getPokemonName(currentId + 1)
      };
    } else {
      this.nextPokemon = {
        id: 1,
        name: 'Bulbasaur'
      };
    }
  }

  getPokemonName(id: number): string {
    // Lista básica de nombres para navegación
    const names: { [key: number]: string } = {
      1: 'Bulbasaur', 2: 'Ivysaur', 3: 'Venusaur',
      4: 'Charmander', 5: 'Charmeleon', 6: 'Charizard',
      7: 'Squirtle', 8: 'Wartortle', 9: 'Blastoise',
      10: 'Caterpie', 11: 'Metapod', 12: 'Butterfree',
      1025: 'Pecharunt'
    };
    return names[id] || `Pokémon #${id}`;
  }

  // ========== MÉTODOS DE UTILIDAD ==========
  getTypeColor(type: string): string {
    const typeObj = this.types.find(t => t.value === type);
    return typeObj ? typeObj.color : '#A8A8A8';
  }

  getTypeName(type: string): string {
    const typeObj = this.types.find(t => t.value === type);
    return typeObj ? typeObj.name : type;
  }

  formatPokemonId(id: number): string {
    return `N.º ${id.toString().padStart(4, '0')}`;
  }

  getStatPercentage(value: number): number {
    // Máximo stat base es 255 (Blissey HP)
    return Math.min((value / 255) * 100, 100);
  }

  getStatBarColor(statName: string): string {
    const colors: { [key: string]: string } = {
      hp: '#FF5959',
      attack: '#F5AC78',
      defense: '#FAE078',
      spAttack: '#9DB7F5',
      spDefense: '#A7DB8D',
      speed: '#FA92B2'
    };
    return colors[statName] || '#A8A8A8';
  }

  // ========== NAVEGACIÓN ==========
  goBack(): void {
    this.router.navigate(['/pokedex']);
  }

  navigateToPokemon(id: number): void {
    this.router.navigate(['/pokemon', id]);
  }

  goToPrevious(): void {
    if (this.previousPokemon) {
      this.navigateToPokemon(this.previousPokemon.id);
    }
  }

  goToNext(): void {
    if (this.nextPokemon) {
      this.navigateToPokemon(this.nextPokemon.id);
    }
  }
}
