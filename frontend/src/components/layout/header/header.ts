import { Component, HostListener, ElementRef, ViewChild, inject, Renderer2, Inject } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ModalStateService } from '../../../services/modal-state.service';
import { ModalComponent } from '../../shared/modal/modal';
import { ButtonComponent } from '../../shared/button/button';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  private router = inject(Router);
  public modalStateService = inject(ModalStateService);

  // Referencia al contenedor del menú para detectar clicks fuera
  @ViewChild('mobileNav') mobileNav!: ElementRef;
  @ViewChild('menuButton') menuButton!: ElementRef;

  // Título de la aplicación
  title: string = 'Pokédex';

  // Estado del menú móvil
  isMenuOpen: boolean = false;

  // ¿Estamos en la landing page (sin autenticar)?
  isLandingPage: boolean = true;

  // ¿Estamos en una ruta de la app (pokedex, quiz, etc)?
  isAppRoute: boolean = false;

  // ¿Mostrar el icono de perfil?
  showProfileIcon: boolean = false;

  // ¿Mostrar el botón de tema?
  showThemeButton: boolean = false;

  // ¿Mostrar el menú hamburguesa?
  showHamburgerMenu: boolean = false;

  // Estado del modal de logout
  isLogoutModalOpen: boolean = false;

  // ¿Estamos en modo quiz (jugando)?
  isQuizMode: boolean = false;

  // ¿Ocultar la navegación principal? (usuario no autenticado en rutas de app)
  hideNavigation: boolean = false;

  // Navegación para landing page
  landingNavItems: { label: string; path: string; icon: string; fragment?: string; colorClass?: string }[] = [
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Style Guide', path: '/style-guide', icon: 'palette' }
  ];

  // Navegación principal (cuando esté autenticado)
  navItems: { label: string; path: string; icon: string; fragment?: string; colorClass?: string }[] = [
    { label: 'Pokédex', path: '/pokedex', icon: 'list' },
    { label: 'Favoritos', path: '/profile', fragment: 'favoritos', icon: 'heart', colorClass: 'header__nav-link--favoritos' },
    { label: 'Comparador', path: '/comparador', icon: 'compare', colorClass: 'header__nav-link--comparador' },
    { label: 'Quiz', path: '/quiz', icon: 'game', colorClass: 'header__nav-link--quiz' }
  ];

  // Navegación para usuarios no autenticados en rutas de la app
  unauthenticatedNavItems: { label: string; path: string; icon: string; fragment?: string; colorClass?: string }[] = [
    { label: 'Pokédex', path: '/pokedex', icon: 'list' },
    { label: 'Favoritos', path: '/profile', fragment: 'favoritos', icon: 'heart', colorClass: 'header__nav-link--favoritos' },
    { label: 'Quiz', path: '/quiz', icon: 'game', colorClass: 'header__nav-link--quiz' }
  ];

  constructor(
    public themeService: ThemeService,
    private authService: AuthService,
    private toastService: ToastService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
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
    const landingRoutes = ['/', '/login', '/register', '/style-guide', '/forms-demo', '/galeria'];
    const appRoutes = ['/pokedex', '/pokemon', '/profile', '/settings', '/quiz', '/comparador'];
    
    const wasLandingPage = this.isLandingPage;
    this.isLandingPage = landingRoutes.includes(url) || url === '';
    
    // Comprobar si estamos en una ruta de la app
    this.isAppRoute = appRoutes.some(route => url.startsWith(route));

    // Comprobar si estamos en modo quiz (solo jugando)
    this.isQuizMode = url.startsWith('/quiz/play');

    // Mostrar icono de perfil solo si está logueado, en rutas de app y no en modo quiz
    this.showProfileIcon = this.isAppRoute && this.authService.isLoggedIn() && !this.isQuizMode;

    // Mostrar botón de tema en rutas de la app (no en landing)
    this.showThemeButton = this.isAppRoute;

    // Mostrar menú hamburguesa solo si está logueado, en rutas de app y no en modo quiz
    this.showHamburgerMenu = this.isAppRoute && !this.isQuizMode && this.authService.isLoggedIn();

    // Ocultar navegación si no está autenticado en rutas de la app (excepto landing)
    this.hideNavigation = this.isAppRoute && !this.authService.isLoggedIn();

    // Gestión del tema según la página
    if (this.isLandingPage) {
      // En landing page siempre tema claro (sin guardar en localStorage)
      this.themeService.setTemporaryLightTheme();
    } else if (wasLandingPage && !this.isLandingPage) {
      // Al salir de landing, restaurar el tema guardado del usuario
      this.themeService.restoreSavedTheme();
    }
  }

  /**
   * Comprueba si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * Obtiene los items de navegación según el contexto
   */
  get currentNavItems() {
    if (this.isLandingPage) {
      return this.landingNavItems;
    }
    // En rutas de la app, mostrar navItems si está autenticado, sino unauthenticatedNavItems
    return this.authService.isLoggedIn() ? this.navItems : this.unauthenticatedNavItems;
  }

  /**
   * Alterna el tema claro/oscuro usando el ThemeService
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Alterna el menú móvil
   * Usa Renderer2 para manipulación segura del DOM (SSR-safe)
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // Prevenir scroll del body cuando el menú está abierto
    if (this.isMenuOpen) {
      // Renderer2.setStyle() - Establece estilos de forma segura
      this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
    } else {
      // Renderer2.removeStyle() - Elimina estilos de forma segura
      this.renderer.removeStyle(this.document.body, 'overflow');
    }
  }

  /**
   * Cierra el menú al hacer click en un enlace
   */
  closeMenu(): void {
    this.isMenuOpen = false;
    // Renderer2.removeStyle() - Restaura el scroll del body de forma segura
    this.renderer.removeStyle(this.document.body, 'overflow');
  }

  /**
   * Maneja la navegación verificando autenticación para rutas protegidas
   */
  handleNavClick(event: Event, item: { path: string; fragment?: string }): void {
    const protectedRoutes = ['/quiz', '/profile'];
    const isProtectedRoute = protectedRoutes.some(route => item.path.startsWith(route));

    if (isProtectedRoute && !this.authService.isLoggedIn()) {
      event.preventDefault();
      this.closeMenu();
      this.router.navigate(['/login']);
    } else {
      this.closeMenu();
    }
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

  /**
   * Abre el modal de confirmación de logout
   */
  openLogoutModal(): void {
    this.isLogoutModalOpen = true;
  }

  /**
   * Cierra el modal de logout
   */
  closeLogoutModal(): void {
    this.isLogoutModalOpen = false;
  }

  /**
   * Confirma el logout y redirige al inicio
   */
  confirmLogout(): void {
    this.isLogoutModalOpen = false;
    this.authService.logout();
    // Mostrar toast de despedida usando ToastService (createElement/appendChild)
    this.toastService.info('Has cerrado sesión correctamente');
    this.router.navigate(['/']);
  }
}