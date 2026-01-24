import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para items de la galería
 */
interface GalleryItem {
  id: number;
  src: string;
  srcset: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria.html',
  styleUrls: ['./galeria.scss']
})
export class GaleriaComponent {

  /**
   * Items de la galería con alt text descriptivo y lazy loading
   */
  galleryItems: GalleryItem[] = [
    {
      id: 1,
      src: 'Pokedex/optimized/Pokemons reunidos 800.webp',
      srcset: 'Pokedex/optimized/Pokemons reunidos 400.webp 400w, Pokedex/optimized/pokemons-reunidos-800.webp 800w, Pokedex/optimized/Pokemons reunidos 1200.webp 1200w',
      alt: 'Grupo de Pokémon populares reunidos incluyendo Pikachu, Charmander, Bulbasaur, Squirtle y Eevee en un escenario colorido',
      caption: 'Los Pokémon iniciales más queridos de todas las generaciones reunidos en una imagen grupal',
      width: 800,
      height: 600
    },
    {
      id: 2,
      src: 'Pokedex/optimized/Imagen quiz 800.webp',
      srcset: 'Pokedex/optimized/Imagen quiz 400.webp 400w, Pokedex/optimized/Imagen quiz 800.webp 800w, Pokedex/optimized/Imagen quiz 1200.webp 1200w',
      alt: 'Ilustración del Quiz Pokémon mostrando diferentes Pokémon con signos de interrogación, invitando al usuario a poner a prueba sus conocimientos',
      caption: 'Pon a prueba tus conocimientos Pokémon con nuestro quiz interactivo',
      width: 800,
      height: 600
    },
    {
      id: 3,
      src: 'Pikachu durmiendo.png',
      srcset: '',
      alt: 'Pikachu dormido plácidamente con los ojos cerrados y una expresión relajada, mostrando sus mejillas rosadas características',
      caption: 'Pikachu descansando después de una batalla intensa',
      width: 400,
      height: 400
    },
    {
      id: 4,
      src: 'pokemons durmiendo.webp',
      srcset: '',
      alt: 'Varios Pokémon durmiendo juntos en un ambiente nocturno acogedor, incluyendo Jigglypuff, Snorlax y Pikachu',
      caption: 'Los Pokémon también necesitan su descanso para recuperar energías',
      width: 600,
      height: 400
    },
    {
      id: 5,
      src: 'Pokedex/optimized/Fondo pantalla Crear cuenta 800.webp',
      srcset: 'Pokedex/optimized/Fondo pantalla Crear cuenta 400.webp 400w, Pokedex/optimized/Fondo pantalla Crear cuenta 800.webp 800w, Pokedex/optimized/Fondo pantalla Crear cuenta 1200.webp 1200w',
      alt: 'Paisaje del mundo Pokémon con praderas verdes, cielo azul y siluetas de Pokémon voladores en el horizonte',
      caption: 'El vasto mundo Pokémon te espera para ser explorado',
      width: 800,
      height: 500
    },
    {
      id: 6,
      src: 'Pikachu llorando.gif',
      srcset: '',
      alt: 'Animación de Pikachu llorando con lágrimas cayendo de sus ojos, expresando tristeza de forma emotiva',
      caption: 'Incluso Pikachu tiene días difíciles. Los Pokémon también sienten emociones',
      width: 300,
      height: 300
    },
    {
      id: 7,
      src: 'Squirtle comiendo.gif',
      srcset: '',
      alt: 'Animación de Squirtle comiendo felizmente, mostrando su personalidad alegre mientras disfruta de su comida',
      caption: 'Squirtle disfrutando de un merecido descanso con su comida favorita',
      width: 400,
      height: 300
    },
    {
      id: 8,
      src: 'Ash ganador.gif',
      srcset: '',
      alt: 'Animación de Ash Ketchum celebrando una victoria con su característica pose de triunfo y expresión de alegría',
      caption: 'Ash celebrando otra victoria en su camino para convertirse en Maestro Pokémon',
      width: 480,
      height: 360
    }
  ];

  /**
   * Item seleccionado para vista ampliada (modal)
   */
  selectedItem: GalleryItem | null = null;

  /**
   * Abre el modal con la imagen seleccionada
   */
  openModal(item: GalleryItem): void {
    this.selectedItem = item;
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.selectedItem = null;
    document.body.style.overflow = '';
  }

  /**
   * Maneja teclas en el modal (Escape para cerrar)
   */
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
    if (this.selectedItem) {
      if (event.key === 'ArrowLeft') {
        this.previousImage();
      }
      if (event.key === 'ArrowRight') {
        this.nextImage();
      }
    }
  }

  /**
   * Navega a la imagen anterior
   */
  previousImage(): void {
    if (!this.selectedItem) return;
    const currentIndex = this.galleryItems.findIndex(item => item.id === this.selectedItem!.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : this.galleryItems.length - 1;
    this.selectedItem = this.galleryItems[previousIndex];
  }

  /**
   * Navega a la imagen siguiente
   */
  nextImage(): void {
    if (!this.selectedItem) return;
    const currentIndex = this.galleryItems.findIndex(item => item.id === this.selectedItem!.id);
    const nextIndex = currentIndex < this.galleryItems.length - 1 ? currentIndex + 1 : 0;
    this.selectedItem = this.galleryItems[nextIndex];
  }

  /**
   * Obtiene el índice actual para el indicador de posición
   */
  getCurrentIndex(): number {
    if (!this.selectedItem) return 0;
    return this.galleryItems.findIndex(item => item.id === this.selectedItem!.id) + 1;
  }
}
