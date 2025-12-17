import { Component, inject } from '@angular/core';
import { ViewportScroller, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

// Importar todos los componentes
import { ButtonComponent } from '../../../components/shared/button/button';
import { CardComponent, PokemonType } from '../../../components/shared/card/card';
import { FormInputComponent } from '../../../components/shared/form-input/form-input';
import { FormTextareaComponent } from '../../../components/shared/form-textarea/form-textarea';
import { FormSelectComponent, SelectOption } from '../../../components/shared/form-select/form-select';
import { AlertComponent } from '../../../components/shared/alert/alert';
import { BadgeComponent } from '../../../components/shared/badge/badge';
import { ModalComponent } from '../../../components/shared/modal/modal';
import { TabsComponent, Tab } from '../../../components/shared/tabs/tabs';
import { TabPanelComponent } from '../../../components/shared/tabs/tab-panel';
import { AccordionComponent, AccordionItem } from '../../../components/shared/accordion/accordion';
import { TooltipComponent } from '../../../components/shared/tooltip/tooltip';

// Servicios
import { ToastService } from '../../../services/toast.service';
import { LoadingService } from '../../../services/loading.service';
import { CommunicationService } from '../../../services/communication.service';
import { PokemonService, Pokemon } from '../../../services/pokemon.service';

@Component({
  selector: 'app-style-guide',
  standalone: true,
  imports: [
    AsyncPipe,
    ButtonComponent,
    CardComponent,
    FormInputComponent,
    FormTextareaComponent,
    FormSelectComponent,
    AlertComponent,
    BadgeComponent,
    ModalComponent,
    TabsComponent,
    TabPanelComponent,
    AccordionComponent,
    TooltipComponent
  ],
  templateUrl: './style-guide.html',
  styleUrls: ['./style-guide.scss']
})
export class StyleGuideComponent {
  private viewportScroller = inject(ViewportScroller);
  private toastService = inject(ToastService);
  private loadingService = inject(LoadingService);
  private communicationService = inject(CommunicationService);
  private pokemonService = inject(PokemonService);

  // ============================================================================
  //                            DATOS DE EJEMPLO
  // ============================================================================

  // Opciones para el select
  selectOptions: SelectOption[] = [
    { value: 'fire', label: 'Fuego' },
    { value: 'water', label: 'Agua' },
    { value: 'grass', label: 'Planta' },
    { value: 'electric', label: 'Eléctrico' },
    { value: 'psychic', label: 'Psíquico' }
  ];

  // Estado del modal
  isModalOpen: boolean = false;

  // Datos para Tabs
  pokemonTabs: Tab[] = [
    { id: 'stats', label: 'Estadísticas' },
    { id: 'moves', label: 'Movimientos' },
    { id: 'evolution', label: 'Evolución' },
    { id: 'locations', label: 'Ubicaciones' }
  ];

  // Estados separados para cada variante de tabs
  activeTabDefault: string = 'stats';
  activeTabPills: string = 'stats';
  activeTabUnderline: string = 'stats';
  activeTabFullWidth: string = 'stats';

  // Datos para Accordion
  pokemonFaqs: AccordionItem[] = [
    {
      id: 'faq-1',
      title: '¿Cómo capturo un Pokémon?',
      content: 'Para capturar un Pokémon, primero debes debilitarlo en combate. Luego, usa una Pokéball cuando su salud esté baja. Cuanto más débil esté el Pokémon, mayor será la probabilidad de captura.'
    },
    {
      id: 'faq-2',
      title: '¿Qué son los tipos de Pokémon?',
      content: 'Cada Pokémon tiene uno o dos tipos que determinan sus fortalezas y debilidades. Por ejemplo, los Pokémon de tipo Agua son fuertes contra los de tipo Fuego, pero débiles contra los de tipo Eléctrico y Planta.'
    },
    {
      id: 'faq-3',
      title: '¿Cómo evoluciona un Pokémon?',
      content: 'Los Pokémon pueden evolucionar de diferentes maneras: subiendo de nivel, usando piedras evolutivas, intercambiándolos, o cumpliendo condiciones especiales como la amistad o la hora del día.'
    }
  ];

  // Tipos para Mewtwo (card horizontal)
  mewtwoTypes: PokemonType[] = [
    { name: 'Psíquico', color: '#F85888', icon: '🔮' }
  ];

  // Estado de favorito de Mewtwo
  isMewtwoFavorite: boolean = false;

  // Datos para Pokemon Cards
  pokemonCards: Array<{
    name: string;
    number: string;
    image: string;
    types: PokemonType[];
    isFavorite: boolean;
  }> = [
    {
      name: 'Bulbasaur',
      number: '001',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      types: [
        { name: 'Planta', color: '#78C850', icon: '🌿' },
        { name: 'Veneno', color: '#A040A0', icon: '☠️' }
      ],
      isFavorite: false
    },
    {
      name: 'Charizard',
      number: '006',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
      types: [
        { name: 'Fuego', color: '#F08030', icon: '🔥' },
        { name: 'Volador', color: '#A890F0', icon: '🪶' }
      ],
      isFavorite: false
    },
    {
      name: 'Squirtle',
      number: '007',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
      types: [
        { name: 'Agua', color: '#6890F0', icon: '💧' }
      ],
      isFavorite: false
    }
  ];

  // ============================================================================
  //                               MÉTODOS
  // ============================================================================

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onButtonClick(type: string): void {
    console.log(`Button clicked: ${type}`);
  }

  onAlertClosed(type: string): void {
    console.log(`Alert closed: ${type}`);
  }

  onTabChangeDefault(tabId: string): void {
    this.activeTabDefault = tabId;
  }

  onTabChangePills(tabId: string): void {
    this.activeTabPills = tabId;
  }

  onTabChangeUnderline(tabId: string): void {
    this.activeTabUnderline = tabId;
  }

  onTabChangeFullWidth(tabId: string): void {
    this.activeTabFullWidth = tabId;
  }

  onAccordionToggle(event: { id: string; isOpen: boolean }): void {
    console.log(`Accordion item ${event.id} is now ${event.isOpen ? 'open' : 'closed'}`);
  }

  onPokemonFavorite(index: number): void {
    this.pokemonCards[index].isFavorite = !this.pokemonCards[index].isFavorite;
    console.log(`${this.pokemonCards[index].name} favorite: ${this.pokemonCards[index].isFavorite}`);
  }

  onPokemonAction(name: string): void {
    console.log(`Action clicked for: ${name}`);
  }

  onMewtwoFavorite(): void {
    this.isMewtwoFavorite = !this.isMewtwoFavorite;
    console.log(`Mewtwo favorite: ${this.isMewtwoFavorite}`);
  }

  scrollTo(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  // ============================================================================
  //                         MÉTODOS PARA TOASTS
  // ============================================================================

  showSuccessToast(): void {
    this.toastService.success('¡Operación completada con éxito!');
  }

  showErrorToast(): void {
    this.toastService.error('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
  }

  showWarningToast(): void {
    this.toastService.warning('Atención: Esta acción no se puede deshacer.');
  }

  showInfoToast(): void {
    this.toastService.info('Información: Hay nuevas actualizaciones disponibles.');
  }

  // ============================================================================
  //                         MÉTODOS PARA LOADING
  // ============================================================================

  showLoading(): void {
    this.loadingService.show();
    // Auto-ocultar después de 3 segundos para la demo
    setTimeout(() => {
      this.loadingService.hide();
    }, 3000);
  }

  // ============================================================================
  //                    MÉTODOS PARA COMMUNICATION SERVICE
  // ============================================================================

  // Observables del servicio de comunicación
  selectedPokemonId$: Observable<number | null> = this.communicationService.selectedPokemon$;
  lastNotification$: Observable<string> = this.communicationService.notifications$;
  searchFilter$: Observable<string> = this.communicationService.searchFilter$;

  // Mapa de nombres de Pokémon para la demo
  private pokemonNames: Record<number, string> = {
    25: 'Pikachu',
    6: 'Charizard',
    150: 'Mewtwo'
  };

  /**
   * Selecciona un Pokémon usando el servicio de comunicación
   */
  selectPokemonDemo(pokemonId: number): void {
    this.communicationService.selectPokemon(pokemonId);
  }

  /**
   * Envía una notificación usando el servicio de comunicación
   */
  sendNotificationDemo(message: string): void {
    this.communicationService.sendNotification(message);
  }

  /**
   * Actualiza el filtro de búsqueda
   */
  onFilterChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.communicationService.setSearchFilter(input.value);
  }

  /**
   * Obtiene el nombre de un Pokémon por su ID
   */
  getPokemonName(pokemonId: number): string {
    return this.pokemonNames[pokemonId] || 'Desconocido';
  }

  /**
   * Limpia todos los datos del servicio de comunicación
   */
  clearCommunicationDemo(): void {
    this.communicationService.clearAll();
  }

  // ============================================================================
  //                    MÉTODOS PARA POKEMON SERVICE (Separación de responsabilidades)
  // ============================================================================

  // Observables del servicio de Pokemon
  currentPokemon$: Observable<Pokemon | null> = this.pokemonService.currentPokemon$;
  pokemonServiceLoading$: Observable<boolean> = this.pokemonService.isLoading$;

  /**
   * Carga un Pokemon por su ID usando el servicio
   * El componente NO conoce la URL de la API ni cómo transformar los datos
   */
  loadPokemon(id: number): void {
    this.pokemonService.getPokemonById(id).subscribe();
  }

  /**
   * Carga un Pokemon aleatorio (1-1025, todas las generaciones)
   */
  loadRandomPokemon(): void {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    this.pokemonService.getPokemonById(randomId).subscribe();
  }
}
