import { Component, HostListener, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  private router = inject(Router);

  // Referencia al contenedor del menú para detectar clicks fuera
  @ViewChild('mobileNav') mobileNav!: ElementRef;
  @ViewChild('menuButton') menuButton!: ElementRef;

  // Título de la aplicación
  title: string = 'Pokédex';

  // Estado del menú móvil
  isMenuOpen: boolean = false;

  // ¿Estamos en la landing page (sin autenticar)?
  isLandingPage: boolean = true;

  // Navegación para landing page
  landingNavItems = [
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Style Guide', path: '/style-guide', icon: 'palette' },
    { label: 'Página Principal', path: '/pokedex', icon: 'list' }
  ];

  // Navegación principal (cuando esté autenticado)
  navItems = [
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Pokédex', path: '/pokedex', icon: 'list' },
    { label: 'Favoritos', path: '/favorites', icon: 'heart' },
    { label: 'Quiz', path: '/quiz', icon: 'game' }
  ];

  constructor(public themeService: ThemeService) {
    // Detectar cambios de ruta para saber si estamos en landing
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkIfLandingPage(event.urlAfterRedirects);
    });

    // Comprobar la ruta inicial
    this.checkIfLandingPage(this.router.url);
  }

  /**
   * Comprueba si estamos en una página de landing (sin autenticar)
   */
  private checkIfLandingPage(url: string): void {
    const landingRoutes = ['/', '/login', '/register', '/style-guide', '/forms-demo'];
    this.isLandingPage = landingRoutes.includes(url) || url === '';
  }

  /**
   * Obtiene los items de navegación según el contexto
   */
  get currentNavItems() {
    return this.isLandingPage ? this.landingNavItems : this.navItems;
  }

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
