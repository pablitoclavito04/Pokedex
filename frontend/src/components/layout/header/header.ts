import { Component, HostListener, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
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

  // ¿Mostrar el icono de perfil?
  showProfileIcon: boolean = false;

  // Navegación para landing page
  landingNavItems: { label: string; path: string; icon: string; fragment?: string; colorClass?: string }[] = [
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Style Guide', path: '/style-guide', icon: 'palette' },
    { label: 'Página Principal', path: '/pokedex', icon: 'list' }
  ];

  // Navegación principal (cuando esté autenticado)
  navItems: { label: string; path: string; icon: string; fragment?: string; colorClass?: string }[] = [
    { label: 'Pokédex', path: '/pokedex', icon: 'list' },
    { label: 'Favoritos', path: '/profile', fragment: 'favoritos', icon: 'heart', colorClass: 'header__nav-link--favoritos' },
    { label: 'Quiz', path: '/quiz', icon: 'game', colorClass: 'header__nav-link--quiz' }
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

    // Mostrar icono de perfil solo en Pokédex, Pokemon Detail, Profile, Settings y Quiz
    const profileIconRoutes = ['/pokedex', '/pokemon', '/profile', '/settings', '/quiz'];
    this.showProfileIcon = profileIconRoutes.some(route => url.startsWith(route));
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
