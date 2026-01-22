import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/shared/button/button';
import { PokemonOfDayService } from '../../../services/pokemon-of-day.service';
import { PokemonService } from '../../../services/pokemon.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  // Pokémon del día
  showPokemonOfDay = false;
  pokemonOfDay: any = null;
  isLoadingPokemon = false;
  countdown = { hours: 0, minutes: 0, seconds: 0 };
  private countdownInterval: any;

  constructor(
    private pokemonOfDayService: PokemonOfDayService,
    private pokemonService: PokemonService,
    private router: Router
  ) {}
  // Características principales de la app
  features = [
    {
      title: 'Pokédex Completa',
      description: 'Accede a información detallada de más de 1,000 Pokémon de todas las generaciones.'
    },
    {
      title: 'Estadísticas',
      description: 'Consulta estadísticas base, tipos, habilidades y movimientos de cada Pokémon.'
    },
    {
      title: 'Favoritos',
      description: 'Guarda tus Pokémon favoritos y accede a ellos rápidamente desde tu colección personal.'
    },
    {
      title: 'Quiz',
      description: 'Pon a prueba tus conocimientos Pokémon con preguntas sobre tipos, evoluciones y más.'
    }
  ];

  // Estadísticas para mostrar
  stats = [
    { value: '1,025+', label: 'Pokémon' },
    { value: '18', label: 'Tipos' },
    { value: '9', label: 'Generaciones' },
    { value: '∞', label: 'Aventuras' }
  ];

  // Tipos para colores
  private types = [
    { name: 'Todos', value: 'all', color: '#A8A8A8' },
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
    { name: 'Hada', value: 'fairy', color: '#EE99AC' },
    { name: 'Normal', value: 'normal', color: '#A8A878' }
  ];

  ngOnInit(): void {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private updateCountdown(): void {
    this.countdown = this.pokemonOfDayService.getTimeUntilNextPokemon();
  }

  showPokemonOfDayCard(): void {
    if (this.pokemonOfDay) {
      this.showPokemonOfDay = true;
      return;
    }

    this.isLoadingPokemon = true;
    const pokemonId = this.pokemonOfDayService.getPokemonOfDayId();

    this.pokemonService.getPokemonDetails(pokemonId).subscribe({
      next: (details) => {
        this.pokemonOfDay = {
          id: details.id,
          name: details.name,
          image: details.image,
          types: details.types.map(t => t.name.toLowerCase()),
          height: details.height,
          weight: details.weight
        };
        this.isLoadingPokemon = false;
        this.showPokemonOfDay = true;
      },
      error: (err) => {
        console.error('Error cargando Pokémon del día:', err);
        this.isLoadingPokemon = false;
      }
    });
  }

  closePokemonOfDay(): void {
    this.showPokemonOfDay = false;
  }

  goToPokemonDetail(): void {
    if (this.pokemonOfDay) {
      // Guardar en sessionStorage que viene de la home para mostrar botón "Regresar al inicio"
      sessionStorage.setItem('fromHome', 'true');
      this.router.navigate(['/pokemon', this.pokemonOfDay.id]);
    }
  }

  getTypeColor(type: string): string {
    const typeObj = this.types.find(t => t.value === type.toLowerCase());
    return typeObj ? typeObj.color : '#A8A8A8';
  }

  getTypeName(type: string): string {
    const typeNames: Record<string, string> = {
      'normal': 'Normal', 'fire': 'Fuego', 'water': 'Agua', 'grass': 'Planta',
      'electric': 'Eléctrico', 'ice': 'Hielo', 'fighting': 'Lucha', 'poison': 'Veneno',
      'ground': 'Tierra', 'flying': 'Volador', 'psychic': 'Psíquico', 'bug': 'Bicho',
      'rock': 'Roca', 'ghost': 'Fantasma', 'dragon': 'Dragón', 'dark': 'Siniestro',
      'steel': 'Acero', 'fairy': 'Hada'
    };
    return typeNames[type.toLowerCase()] || type;
  }

  formatPokemonId(id: number): string {
    return `#${id.toString().padStart(4, '0')}`;
  }

  formatCountdown(): string {
    const h = this.countdown.hours.toString().padStart(2, '0');
    const m = this.countdown.minutes.toString().padStart(2, '0');
    const s = this.countdown.seconds.toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
}
