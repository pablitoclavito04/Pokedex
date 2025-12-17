import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/layout/header/header';
import { FooterComponent } from '../components/layout/footer/footer';
import { ToastComponent } from '../components/shared/toast/toast';
import { SpinnerComponent } from '../components/shared/spinner/spinner';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent, SpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Inyectar ThemeService aquí para asegurar que se inicialice al arrancar la app
  constructor(private themeService: ThemeService) {}
}
