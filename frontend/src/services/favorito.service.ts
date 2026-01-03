import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {
  private apiUrl = 'https://pokedex-production-488a.up.railway.app/api/favoritos';

  private favoritosSubject = new BehaviorSubject<number[]>([]);
  favoritos$ = this.favoritosSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  cargarFavoritos(): void {
    if (!this.authService.isLoggedIn()) {
      this.favoritosSubject.next([]);
      return;
    }

    this.http.get<number[]>(this.apiUrl, { headers: this.getHeaders() })
      .subscribe({
        next: (favoritos) => this.favoritosSubject.next(favoritos),
        error: (err) => console.error('Error cargando favoritos:', err)
      });
  }

  toggleFavorito(pokemonId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/toggle/${pokemonId}`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        const currentFavoritos = this.favoritosSubject.getValue();
        if (response.esFavorito) {
          // Añadir al principio para que los más recientes aparezcan primero
          this.favoritosSubject.next([pokemonId, ...currentFavoritos]);
        } else {
          this.favoritosSubject.next(currentFavoritos.filter(id => id !== pokemonId));
        }
      })
    );
  }

  esFavorito(pokemonId: number): boolean {
    return this.favoritosSubject.getValue().includes(pokemonId);
  }

  getFavoritos(): number[] {
    return this.favoritosSubject.getValue();
  }
}