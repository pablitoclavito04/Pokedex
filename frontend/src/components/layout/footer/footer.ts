import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ModalComponent } from '../../shared/modal/modal';
import { ButtonComponent } from '../../shared/button/button';
import { AuthService } from '../../../services/auth.service';

// Interfaz para los enlaces con contenido de modal
interface FooterLink {
  label: string;
  path?: string;
  protected?: boolean;
  modalContent?: {
    title: string;
    sections: { subtitle: string; text: string }[];
  };
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalComponent, ButtonComponent],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  // Año actual para el copyright
  currentYear: number = new Date().getFullYear();

  // Estado del modal
  isModalOpen: boolean = false;
  currentModalContent: { title: string; sections: { subtitle: string; text: string }[] } | null = null;

  // Enlaces de navegación del footer (con rutas reales)
  navLinks: FooterLink[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Style Guide', path: '/style-guide' },
    { label: 'Pokédex', path: '/pokedex' },
    { label: 'Favoritos', path: '/profile', protected: true },
    { label: 'Comparador', path: '/comparador', protected: true },
    { label: 'Quiz', path: '/quiz', protected: true }
  ];

  // Redes sociales
  socialLinks = [
    {
      label: 'GitHub',
      url: 'https://github.com/pablitoclavito04',
      icon: 'github'
    },
    {
      label: 'Twitter',
      url: 'https://x.com/PabloSanzA27140',
      icon: 'twitter'
    },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/pablo-sanz-aznar-56a2bb399/',
      icon: 'linkedin'
    }
  ];

  // Enlaces adicionales (con modales informativos)
  extraLinks: FooterLink[] = [
    {
      label: 'Cómo funciona',
      modalContent: {
        title: 'Cómo funciona',
        sections: [
          { subtitle: 'Información', text: 'Explora nuestra amplia base de datos de Pokémon con información detallada.' },
          { subtitle: 'Uso', text: 'Busca, filtra y guarda tus Pokémon favoritos para acceder rápidamente.' },
          { subtitle: 'Características', text: 'Accede a estadísticas, evoluciones, movimientos y mucho más de cada Pokémon.' }
        ]
      }
    },
    {
      label: 'FAQ',
      modalContent: {
        title: 'Preguntas Frecuentes',
        sections: [
          { subtitle: '¿Es gratis?', text: 'Sí, la Pokédex es completamente gratuita y sin publicidad.' },
          { subtitle: '¿Necesito cuenta?', text: 'Puedes explorar sin cuenta, pero necesitas una para guardar favoritos.' },
          { subtitle: '¿De dónde vienen los datos?', text: 'Usamos la PokeAPI, la base de datos más completa de Pokémon.' }
        ]
      }
    }
  ];

  // Enlaces de contacto (con modales informativos)
  contactLinks: FooterLink[] = [
    {
      label: 'Soporte',
      modalContent: {
        title: 'Soporte',
        sections: [
          { subtitle: 'Contacto', text: 'Puedes contactarnos en soporte@pokedex.app' },
          { subtitle: 'Horario', text: 'Respondemos en un plazo de 24-48 horas hábiles.' },
          { subtitle: 'Ayuda', text: 'Consulta nuestra sección de FAQ para respuestas rápidas.' }
        ]
      }
    },
    {
      label: 'Términos',
      modalContent: {
        title: 'Términos de Uso',
        sections: [
          { subtitle: 'Uso permitido', text: 'Esta aplicación es solo para uso personal y educativo.' },
          { subtitle: 'Propiedad', text: 'Pokémon es una marca registrada de Nintendo/Game Freak.' },
          { subtitle: 'Datos', text: 'No almacenamos datos personales más allá de tus preferencias.' }
        ]
      }
    },
    {
      label: 'Privacidad',
      modalContent: {
        title: 'Política de Privacidad',
        sections: [
          { subtitle: 'Datos recopilados', text: 'Solo guardamos tus preferencias de tema y favoritos localmente.' },
          { subtitle: 'Cookies', text: 'Usamos cookies técnicas necesarias para el funcionamiento.' },
          { subtitle: 'Terceros', text: 'No compartimos ningún dato con terceros.' }
        ]
      }
    }
  ];

  /**
   * Abre el modal con el contenido especificado
   */
  openModal(link: FooterLink): void {
    if (link.modalContent) {
      this.currentModalContent = link.modalContent;
      this.isModalOpen = true;
    }
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.currentModalContent = null;
  }

  /**
   * Maneja la navegación verificando autenticación para rutas protegidas
   */
  handleNavClick(event: Event, link: FooterLink): void {
    if (link.protected && !this.authService.isLoggedIn()) {
      event.preventDefault();
      this.router.navigate(['/login']);
    }
  }
}