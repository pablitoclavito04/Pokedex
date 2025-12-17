import { Component, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';

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

@Component({
  selector: 'app-style-guide',
  standalone: true,
  imports: [
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
    { id: 'stats', label: 'Estadísticas', icon: '📊' },
    { id: 'moves', label: 'Movimientos', icon: '⚔️' },
    { id: 'evolution', label: 'Evolución', icon: '🔄' },
    { id: 'locations', label: 'Ubicaciones', icon: '📍' }
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
}
