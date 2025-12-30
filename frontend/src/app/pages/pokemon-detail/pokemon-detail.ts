// ============================================================================
//          POKEMON DETAIL PAGE - Página de detalle del Pokémon
// ============================================================================

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonService } from '../../../services/pokemon.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface EvolutionPokemon {
  id: number;
  name: string;
  types: string[];
  image: string;
  evolutionMethod?: string;
  evolvesFromId?: number; // ID del Pokémon del que evoluciona
}

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
  evolutions: EvolutionPokemon[];
  hasBranchedEvolutions?: boolean;
  branchLevel?: number; // 1 = ramificación desde base (Eevee), 2 = ramificación desde segunda etapa (Oddish)
  secondStageEvolution?: EvolutionPokemon; // Para casos como Gloom (etapa intermedia antes de ramificación)
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
    id: 0,
    name: '',
    types: [],
    height: 0,
    weight: 0,
    category: '',
    ability: '',
    abilityDescription: '',
    gender: { male: true, female: true },
    description: '',
    stats: {
      hp: 0,
      attack: 0,
      defense: 0,
      spAttack: 0,
      spDefense: 0,
      speed: 0
    },
    evolutions: [],
    weaknesses: [],
    image: '',
    versions: []
  };

  isLoading = true;

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

  // Mapa de debilidades por tipo
  typeWeaknesses: { [key: string]: string[] } = {
    normal: ['fighting'],
    fire: ['water', 'ground', 'rock'],
    water: ['electric', 'grass'],
    grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
    electric: ['ground'],
    ice: ['fire', 'fighting', 'rock', 'steel'],
    fighting: ['flying', 'psychic', 'fairy'],
    poison: ['ground', 'psychic'],
    ground: ['water', 'grass', 'ice'],
    flying: ['electric', 'ice', 'rock'],
    psychic: ['bug', 'ghost', 'dark'],
    bug: ['fire', 'flying', 'rock'],
    rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
    ghost: ['ghost', 'dark'],
    dragon: ['ice', 'dragon', 'fairy'],
    dark: ['fighting', 'bug', 'fairy'],
    steel: ['fire', 'fighting', 'ground'],
    fairy: ['poison', 'steel']
  };

  // Navegación entre Pokémon
  previousPokemon: { id: number; name: string } | null = null;
  nextPokemon: { id: number; name: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id && id > 0 && id <= 1025) {
        this.loadPokemon(id);
      } else {
        this.router.navigate(['/pokedex']);
      }
    });
  }

  loadPokemon(id: number): void {
    this.isLoading = true;

    // Cargar datos básicos del Pokémon
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${id}`).subscribe({
      next: (data) => {
        // Cargar también la especie para la descripción
        this.http.get<any>(`https://pokeapi.co/api/v2/pokemon-species/${id}`).subscribe({
          next: (speciesData) => {
            this.pokemon = {
              id: data.id,
              name: this.capitalizeFirstLetter(speciesData.name),
              types: data.types.map((t: any) => t.type.name),
              height: data.height / 10, // Convertir a metros
              weight: data.weight / 10, // Convertir a kg
              category: this.getCategory(speciesData),
              ability: this.capitalizeFirstLetter(data.abilities[0]?.ability.name || ''),
              gender: {
                male: speciesData.gender_rate !== 8 && speciesData.gender_rate !== -1,
                female: speciesData.gender_rate !== 0 && speciesData.gender_rate !== -1
              },
              description: this.getDescription(speciesData),
              stats: {
                hp: data.stats[0].base_stat,
                attack: data.stats[1].base_stat,
                defense: data.stats[2].base_stat,
                spAttack: data.stats[3].base_stat,
                spDefense: data.stats[4].base_stat,
                speed: data.stats[5].base_stat
              },
              evolutions: [],
              weaknesses: this.calculateWeaknesses(data.types.map((t: any) => t.type.name)),
              image: data.sprites.other['official-artwork'].front_default,
              versions: []
            };

            // Cargar cadena evolutiva
            if (speciesData.evolution_chain?.url) {
              this.loadEvolutionChain(speciesData.evolution_chain.url);
            }

            this.setupNavigation(id);
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error cargando especie:', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error cargando Pokémon:', err);
        this.isLoading = false;
        this.router.navigate(['/pokedex']);
      }
    });
  }

  getCategory(speciesData: any): string {
    const genus = speciesData.genera.find((g: any) => g.language.name === 'es');
    return genus ? genus.genus.replace(' Pokémon', '') : '';
  }

  getDescription(speciesData: any): string {
    // Buscar descripción en español
    const entry = speciesData.flavor_text_entries.find(
      (e: any) => e.language.name === 'es'
    );
    if (entry) {
      return entry.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ');
    }
    // Si no hay español, buscar en inglés
    const englishEntry = speciesData.flavor_text_entries.find(
      (e: any) => e.language.name === 'en'
    );
    return englishEntry ? englishEntry.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ') : '';
  }

  calculateWeaknesses(pokemonTypes: string[]): string[] {
    const weaknessSet = new Set<string>();
    
    pokemonTypes.forEach(type => {
      const weaknesses = this.typeWeaknesses[type] || [];
      weaknesses.forEach(w => weaknessSet.add(w));
    });

    // Remover debilidades que son resistidas por otro tipo
    // (Simplificado - para una implementación completa habría que considerar resistencias)
    return Array.from(weaknessSet);
  }

  loadEvolutionChain(url: string): void {
    this.http.get<any>(url).subscribe({
      next: (data) => {
        const evolutions: any[] = [];
        const branchInfo = this.analyzeBranches(data.chain);
        this.extractEvolutions(data.chain, evolutions, null);

        // Cargar detalles de cada evolución
        const evolutionRequests = evolutions.map(evo =>
          this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${evo.id}`)
        );

        if (evolutionRequests.length > 0) {
          forkJoin(evolutionRequests).subscribe({
            next: (pokemonData) => {
              const allEvolutions = pokemonData.map((p, index) => ({
                id: p.id,
                name: this.capitalizeFirstLetter(p.name),
                types: p.types.map((t: any) => t.type.name),
                image: p.sprites.other['official-artwork'].front_default,
                evolutionMethod: evolutions[index].evolutionMethod,
                evolvesFromId: evolutions[index].evolvesFromId
              }));

              this.pokemon.hasBranchedEvolutions = branchInfo.hasBranches;
              this.pokemon.branchLevel = branchInfo.branchLevel;

              // Si la ramificación es en nivel 2 (como Oddish→Gloom→Vileplume/Bellossom)
              if (branchInfo.hasBranches && branchInfo.branchLevel === 2) {
                // La segunda evolución es la etapa intermedia (Gloom)
                this.pokemon.secondStageEvolution = allEvolutions[1];
                // Las evoluciones finales son las ramificaciones
                this.pokemon.evolutions = [allEvolutions[0], ...allEvolutions.slice(2)];
              } else {
                this.pokemon.evolutions = allEvolutions;
              }

              this.cdr.detectChanges();
            },
            error: (err) => console.error('Error cargando evoluciones:', err)
          });
        }
      },
      error: (err) => console.error('Error cargando cadena evolutiva:', err)
    });
  }

  // Analizar la cadena evolutiva para detectar ramificaciones y su nivel
  analyzeBranches(chain: any): { hasBranches: boolean; branchLevel: number } {
    // Nivel 1: ramificación directa desde la base (Eevee)
    if (chain.evolves_to && chain.evolves_to.length > 1) {
      return { hasBranches: true, branchLevel: 1 };
    }
    // Nivel 2: ramificación desde la segunda etapa (Oddish→Gloom→...)
    if (chain.evolves_to && chain.evolves_to.length === 1) {
      const secondStage = chain.evolves_to[0];
      if (secondStage.evolves_to && secondStage.evolves_to.length > 1) {
        return { hasBranches: true, branchLevel: 2 };
      }
      // Nivel 3: ramificación desde la tercera etapa (raro pero posible)
      if (secondStage.evolves_to && secondStage.evolves_to.length === 1) {
        const thirdStage = secondStage.evolves_to[0];
        if (thirdStage.evolves_to && thirdStage.evolves_to.length > 1) {
          return { hasBranches: true, branchLevel: 3 };
        }
      }
    }
    return { hasBranches: false, branchLevel: 0 };
  }

  extractEvolutions(chain: any, evolutions: any[], evolutionDetail?: any, parentId?: number): void {
    const speciesUrl = chain.species.url;
    const id = parseInt(speciesUrl.split('/').filter(Boolean).pop());
    
    // Obtener el método de evolución
    let evolutionMethod = '';
    if (evolutionDetail) {
      const parts: string[] = [];
      
      // Nivel mínimo
      if (evolutionDetail.min_level) {
        parts.push(`Nivel ${evolutionDetail.min_level}`);
      }
      
      // Amistad
      if (evolutionDetail.min_happiness) {
        parts.push('Amistad');
      }
      
      // Momento del día
      if (evolutionDetail.time_of_day === 'day') {
        parts.push('(día)');
      } else if (evolutionDetail.time_of_day === 'night') {
        parts.push('(noche)');
      }
      
      // Piedra evolutiva o item
      if (evolutionDetail.item) {
        parts.push(this.getItemName(evolutionDetail.item.name));
      }
      
      // Objeto equipado
      if (evolutionDetail.held_item) {
        parts.push(this.getItemName(evolutionDetail.held_item.name));
      }
      
      // Intercambio
      if (evolutionDetail.trigger?.name === 'trade') {
        if (parts.length === 0) {
          parts.push('Intercambio');
        } else {
          parts.unshift('Intercambio +');
        }
      }
      
      // Movimiento conocido
      if (evolutionDetail.known_move) {
        const moveName = this.getMoveName(evolutionDetail.known_move.name);
        parts.push(`Conociendo ${moveName} + nivel`);
      }
      
      // Tipo de movimiento conocido
      if (evolutionDetail.known_move_type) {
        parts.push(`Mov. tipo ${this.getTypeName(evolutionDetail.known_move_type.name)}`);
      }
      
      // Ubicación - Corrección para Leafeon y Glaceon (usan piedras en juegos modernos)
      if (evolutionDetail.location && !evolutionDetail.item) {
        const pokemonName = chain.species.name.toLowerCase();
        if (pokemonName === 'leafeon') {
          parts.push('Piedra Hoja');
        } else if (pokemonName === 'glaceon') {
          parts.push('Piedra Hielo');
        } else {
          parts.push('Lugar especial');
        }
      }
      
      // Belleza (Feebas)
      if (evolutionDetail.min_beauty) {
        parts.push('Belleza máxima');
      }
      
      // Afecto (Pokémon Legends)
      if (evolutionDetail.min_affection) {
        parts.push('Afecto');
      }
      
      // Género específico
      if (evolutionDetail.gender === 1) {
        parts.push('(♀)');
      } else if (evolutionDetail.gender === 2) {
        parts.push('(♂)');
      }
      
      // Estadísticas
      if (evolutionDetail.relative_physical_stats === 1) {
        parts.push('(Ataque > Defensa)');
      } else if (evolutionDetail.relative_physical_stats === -1) {
        parts.push('(Ataque < Defensa)');
      } else if (evolutionDetail.relative_physical_stats === 0) {
        parts.push('(Ataque = Defensa)');
      }
      
      evolutionMethod = parts.join(' ');

      // Si amistad con momento del día, formatear mejor
      if (evolutionMethod.includes('Amistad') && (evolutionMethod.includes('(día)') || evolutionMethod.includes('(noche)'))) {
        evolutionMethod = evolutionMethod.replace('Amistad (día)', 'Amistad + nivel (día)');
        evolutionMethod = evolutionMethod.replace('Amistad (noche)', 'Amistad + nivel (noche)');
      }
    }

    // Casos especiales para Pokémon con datos incompletos en la API
    const pokemonName = chain.species.name.toLowerCase();
    if (pokemonName === 'dipplin' && !evolutionMethod) {
      evolutionMethod = 'Manzana Melosa';
    } else if (pokemonName === 'hydrapple' && !evolutionMethod) {
      evolutionMethod = 'Conociendo Bramido Dragón + nivel';
    }

    evolutions.push({
      id,
      name: chain.species.name,
      evolutionMethod: evolutionMethod,
      evolvesFromId: parentId
    });

    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evo: any) => {
        const evoDetail = evo.evolution_details[0] || null;
        this.extractEvolutions(evo, evolutions, evoDetail, id);
      });
    }
  }

  getItemName(itemName: string): string {
    const items: { [key: string]: string } = {
      'thunder-stone': 'Piedra Trueno',
      'fire-stone': 'Piedra Fuego',
      'water-stone': 'Piedra Agua',
      'leaf-stone': 'Piedra Hoja',
      'moon-stone': 'Piedra Lunar',
      'sun-stone': 'Piedra Solar',
      'shiny-stone': 'Piedra Día',
      'dusk-stone': 'Piedra Noche',
      'dawn-stone': 'Piedra Alba',
      'ice-stone': 'Piedra Hielo',
      'oval-stone': 'Piedra Oval',
      'kings-rock': 'Roca del Rey',
      'metal-coat': 'Revest. Metálico',
      'dragon-scale': 'Escama Dragón',
      'upgrade': 'Mejora',
      'dubious-disc': 'Disco Extraño',
      'protector': 'Protector',
      'electirizer': 'Electrizador',
      'magmarizer': 'Magmatizador',
      'reaper-cloth': 'Tela Terrible',
      'prism-scale': 'Escama Bella',
      'whipped-dream': 'Dulce de Nata',
      'sachet': 'Saquito Fragante',
      'razor-claw': 'Garra Afilada',
      'razor-fang': 'Colmillo Agudo',
      'deep-sea-tooth': 'Diente Marino',
      'deep-sea-scale': 'Escama Marina',
      'link-cable': 'Cable Unión',
      'chipped-pot': 'Tetera Rota',
      'cracked-pot': 'Tetera Agrietada',
      'galarica-cuff': 'Brazal Galar',
      'galarica-wreath': 'Corona Galar',
      'black-augurite': 'Mineral Negro',
      'peat-block': 'Bloque de Turba',
      'auspicious-armor': 'Armadura Auspiciosa',
      'malicious-armor': 'Armadura Maliciosa',
      'scroll-of-darkness': 'Manuscrito Sombras',
      'scroll-of-waters': 'Manuscrito Aguas',
      'sweet-apple': 'Manzana Dulce',
      'tart-apple': 'Manzana Ácida',
      'syrupy-apple': 'Manzana Melosa'
    };
    return items[itemName] || itemName.replace(/-/g, ' ');
  }

  getMoveName(moveName: string): string {
    const moves: { [key: string]: string } = {
      'dragon-cheer': 'Bramido Dragón',
      'ancient-power': 'Poder Pasado',
      'rollout': 'Rodar',
      'mimic': 'Mimético',
      'double-hit': 'Doble Golpe',
      'stomp': 'Pisotón',
      'psyshield-bash': 'Asalto Escudo'
    };
    return moves[moveName] || moveName.replace(/-/g, ' ');
  }

  setupNavigation(currentId: number): void {
    // Configurar navegación anterior
    if (currentId > 1) {
      this.loadPokemonName(currentId - 1).then(name => {
        this.previousPokemon = { id: currentId - 1, name };
        this.cdr.detectChanges();
      });
    } else {
      this.previousPokemon = { id: 1025, name: 'Pecharunt' };
    }

    // Configurar navegación siguiente
    if (currentId < 1025) {
      this.loadPokemonName(currentId + 1).then(name => {
        this.nextPokemon = { id: currentId + 1, name };
        this.cdr.detectChanges();
      });
    } else {
      this.nextPokemon = { id: 1, name: 'Bulbasaur' };
    }
  }

  async loadPokemonName(id: number): Promise<string> {
    try {
      const response = await this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${id}`).toPromise();
      return this.capitalizeFirstLetter(response.name);
    } catch {
      return `Pokémon #${id}`;
    }
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
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

  // ========== HELPERS EVOLUCIÓN ==========
  getEvolutionParentName(evolvesFromId: number | undefined): string {
    if (!evolvesFromId) return '';
    const parent = this.pokemon.evolutions.find(e => e.id === evolvesFromId);
    if (parent) return parent.name;
    if (this.pokemon.secondStageEvolution?.id === evolvesFromId) {
      return this.pokemon.secondStageEvolution.name;
    }
    return '';
  }

  // Verificar si una evolución viene de otra evolución que no es el base
  isSubEvolution(evo: EvolutionPokemon): boolean {
    if (!evo.evolvesFromId) return false;
    const baseId = this.pokemon.evolutions[0]?.id;
    return evo.evolvesFromId !== baseId;
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