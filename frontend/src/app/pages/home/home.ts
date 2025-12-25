import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../components/shared/button/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  // Características principales de la app
  features = [
    {
      title: 'Pokédex Completa',
      description: 'Accede a información detallada de más de 1,000 Pokémon de todas las generaciones.'
    },
    {
      title: 'Estadísticas',
      description: 'Consulta estadísticas base, tipos, habilidades y movimientos de cada Pokémon.'
    },
    {
      title: 'Favoritos',
      description: 'Guarda tus Pokémon favoritos y accede a ellos rápidamente desde tu colección personal.'
    },
    {
      title: 'Quiz',
      description: 'Pon a prueba tus conocimientos Pokémon con preguntas sobre tipos, evoluciones y más.'
    }
  ];

  // Estadísticas para mostrar
  stats = [
    { value: '1,025+', label: 'Pokémon' },
    { value: '18', label: 'Tipos' },
    { value: '9', label: 'Generaciones' },
    { value: '∞', label: 'Aventuras' }
  ];
}
