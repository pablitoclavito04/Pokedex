import { Component, Input, Output, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  // Título de la aplicación
  @Input() title: string = 'Pokédex';
  
  // Estado del tema (true = oscuro, false = claro)
  @Input() isDarkTheme: boolean = true;
  
  // Evento cuando se cambia el tema
  @Output() themeToggle = new EventEmitter<boolean>();
  
  // Estado del menú móvil
  isMenuOpen: boolean = false;
  
  // Navegación principal
  navItems = [
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Pokédex', path: '/pokedex', icon: 'list' },
    { label: 'Favoritos', path: '/favorites', icon: 'heart' },
    { label: 'Quiz', path: '/quiz', icon: 'game' }
  ];
  
  // Alternar tema claro/oscuro
  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeToggle.emit(this.isDarkTheme);

    if (this.isBrowser) {
      // Guardar preferencia en localStorage
      localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    }
  }
  
  // Alternar menú móvil
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  // Cerrar menú al hacer click en un enlace
  closeMenu(): void {
    this.isMenuOpen = false;
  }
}