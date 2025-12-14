import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  styleUrls: ['./main.scss']
})
export class MainComponent {
  // Este componente actúa como contenedor del contenido principal
  // Usa <ng-content> para proyectar contenido dentro
}