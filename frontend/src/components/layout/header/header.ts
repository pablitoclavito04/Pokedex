import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  // Referencia al contenedor del menú para detectar clicks fuera
  @ViewChild('mobileNav') mobileNav!: ElementRef;
  @ViewChild('menuButton') menuButton!: ElementRef;

  // Título de la aplicación
  title: string = 'Pokédex';

  // Estado del menú móvil
  isMenuOpen: boolean = false;

  // Navegación principal
  navItems = [
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Pokédex', path: '/pokedex', icon: 'list' },
    { label: 'Favoritos', path: '/favorites', icon: 'heart' },
    { label: 'Quiz', path: '/quiz', icon: 'game' }
  ];

  constructor(public themeService: ThemeService) {}

  /**
   * Alterna el tema claro/oscuro usando el ThemeService
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Alterna el menú móvil
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // Prevenir scroll del body cuando el menú está abierto
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Cierra el menú al hacer click en un enlace
   */
  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  /**
   * Cierra el menú al presionar ESC
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isMenuOpen) {
      this.closeMenu();
    }
  }

  /**
   * Cierra el menú al hacer click fuera de él
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isMenuOpen) return;

    const target = event.target as HTMLElement;

    // Verificar si el click fue dentro del menú o en el botón hamburguesa
    const clickedInsideNav = this.mobileNav?.nativeElement?.contains(target);
    const clickedMenuButton = this.menuButton?.nativeElement?.contains(target);

    if (!clickedInsideNav && !clickedMenuButton) {
      this.closeMenu();
    }
  }
}
