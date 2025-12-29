import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/layout/header/header';
import { FooterComponent } from '../components/layout/footer/footer';
import { ToastComponent } from '../components/shared/toast/toast';
import { SpinnerComponent } from '../components/shared/spinner/spinner';
import { ThemeService } from '../services/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ToastComponent, SpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Rutas donde no se muestra header/footer
  private hiddenLayoutRoutes = ['/login', '/register'];
  // Rutas donde no se muestra el footer
  private hiddenFooterRoutes = ['/login', '/register', '/profile', '/settings'];

  showLayout = true;
  showFooter = true;

  constructor(private themeService: ThemeService, private router: Router) {
    // Escuchar cambios de ruta para mostrar/ocultar layout
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.showLayout = !this.hiddenLayoutRoutes.includes(url);
        this.showFooter = !this.hiddenFooterRoutes.some(route => url.startsWith(route));
      });
  }
}
