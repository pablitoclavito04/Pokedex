import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  // Año actual para el copyright
  currentYear: number = new Date().getFullYear();
  
  // Enlaces legales
  legalLinks = [
    { label: 'Términos de uso', path: '/terms' },
    { label: 'Política de privacidad', path: '/privacy' },
    { label: 'Cookies', path: '/cookies' }
  ];
  
  // Enlaces de navegación del footer
  navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Pokédex', path: '/pokedex' },
    { label: 'Favoritos', path: '/favorites' },
    { label: 'Quiz', path: '/quiz' },
    { label: 'Sobre nosotros', path: '/about' }
  ];
  
  // Redes sociales
  socialLinks = [
    {
      label: 'GitHub',
      url: 'https://github.com/tu-usuario',
      icon: 'github'
    },
    {
      label: 'Twitter',
      url: 'https://twitter.com/tu-usuario',
      icon: 'twitter'
    },
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/tu-usuario',
      icon: 'linkedin'
    }
  ];

  // Enlaces adicionales
  extraLinks = [
    { label: 'Cómo funciona', path: '/how-it-works' },
    { label: 'FAQ', path: '/faq' }
  ];

  // Enlaces de contacto
  contactLinks = [
    { label: 'Soporte', path: '/support' },
    { label: 'Términos', path: '/terms' },
    { label: 'Privacidad', path: '/privacy' }
  ];
}