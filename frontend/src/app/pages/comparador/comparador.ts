// ============================================================================
//          COMPARADOR PAGE - Página de comparación de Pokémon
// ============================================================================

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../../services/pokemon.service';

interface PokemonComparar {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  height: number;
  weight: number;
  total: number;
}

@Component({
  selector: 'app-comparador',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './comparador.html',
  styleUrls: ['./comparador.scss']
})
export class ComparadorComponent implements OnInit {
  // Pokémon seleccionados para comparar
  pokemon1: PokemonComparar | null = null;
  pokemon2: PokemonComparar | null = null;

  // Lista de todos los Pokémon
  allPokemon: { id: number; name: string; image: string }[] = [];

  // Estados
  isLoading = true;
  isLoadingPokemon1 = false;
  isLoadingPokemon2 = false;

  // Selectores abiertos
  showSelector1 = false;
  showSelector2 = false;

  // Búsqueda en selectores
  searchQuery1 = '';
  searchQuery2 = '';

  // Tipos para colores
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

  constructor(
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.loadAllPokemon();
  }

  loadAllPokemon(): void {
    this.isLoading = true;

    this.pokemonService.getAllPokemonNames().subscribe({
      next: (pokemons) => {
        this.allPokemon = pokemons.map(p => ({
          id: p.id,
          name: p.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando Pokémon:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectPokemon(slot: 1 | 2, pokemonId: number): void {
    if (slot === 1) {
      this.isLoadingPokemon1 = true;
      this.showSelector1 = false;
    } else {
      this.isLoadingPokemon2 = true;
      this.showSelector2 = false;
    }

    this.pokemonService.getPokemonDetails(pokemonId).subscribe({
      next: (details) => {
        // Extraer stats del array (el orden es: hp, attack, defense, sp-attack, sp-defense, speed)
        const getStatValue = (statName: string): number => {
          const stat = details.stats.find(s =>
            s.name.toLowerCase() === statName.toLowerCase() ||
            s.name === statName
          );
          return stat?.value || 0;
        };

        const hp = getStatValue('PS');
        const attack = getStatValue('Ataque');
        const defense = getStatValue('Defensa');
        const spAttack = getStatValue('At. Esp.');
        const spDefense = getStatValue('Def. Esp.');
        const speed = getStatValue('Velocidad');

        const pokemon: PokemonComparar = {
          id: details.id,
          name: details.name,
          image: details.image,
          types: details.types.map(t => t.name.toLowerCase()),
          stats: {
            hp,
            attack,
            defense,
            spAttack,
            spDefense,
            speed
          },
          height: details.height,
          weight: details.weight,
          total: hp + attack + defense + spAttack + spDefense + speed
        };

        if (slot === 1) {
          this.pokemon1 = pokemon;
          this.isLoadingPokemon1 = false;
        } else {
          this.pokemon2 = pokemon;
          this.isLoadingPokemon2 = false;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando Pokémon:', err);
        if (slot === 1) {
          this.isLoadingPokemon1 = false;
        } else {
          this.isLoadingPokemon2 = false;
        }
        this.cdr.detectChanges();
      }
    });
  }

  clearPokemon(slot: 1 | 2): void {
    if (slot === 1) {
      this.pokemon1 = null;
    } else {
      this.pokemon2 = null;
    }
  }

  toggleSelector(slot: 1 | 2): void {
    if (slot === 1) {
      this.showSelector1 = !this.showSelector1;
      this.showSelector2 = false;
      this.searchQuery1 = '';
    } else {
      this.showSelector2 = !this.showSelector2;
      this.showSelector1 = false;
      this.searchQuery2 = '';
    }
  }

  closeSelectors(): void {
    this.showSelector1 = false;
    this.showSelector2 = false;
  }

  get filteredPokemon1(): { id: number; name: string; image: string }[] {
    if (!this.searchQuery1) return this.allPokemon;
    const query = this.searchQuery1.toLowerCase();
    return this.allPokemon.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.id.toString().includes(query)
    );
  }

  get filteredPokemon2(): { id: number; name: string; image: string }[] {
    if (!this.searchQuery2) return this.allPokemon;
    const query = this.searchQuery2.toLowerCase();
    return this.allPokemon.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.id.toString().includes(query)
    );
  }

  // Comparar estadísticas - retorna 'winner', 'loser' o 'tie'
  compareStat(stat1: number, stat2: number): { p1: string; p2: string } {
    if (stat1 > stat2) return { p1: 'winner', p2: 'loser' };
    if (stat2 > stat1) return { p1: 'loser', p2: 'winner' };
    return { p1: 'tie', p2: 'tie' };
  }

  getStatPercentage(value: number): number {
    return Math.min((value / 255) * 100, 100);
  }

  getTypeColor(type: string): string {
    const typeObj = this.types.find(t => t.value === type.toLowerCase());
    return typeObj ? typeObj.color : '#A8A8A8';
  }

  getTypeName(type: string): string {
    const typeObj = this.types.find(t => t.value === type.toLowerCase());
    return typeObj ? typeObj.name : type;
  }

  formatPokemonId(id: number): string {
    return `#${id.toString().padStart(4, '0')}`;
  }
}
