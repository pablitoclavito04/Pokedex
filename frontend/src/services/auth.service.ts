import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  pais?: string;
  fechaNacimiento?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'token';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          sessionStorage.setItem(this.tokenKey, response.token);
          sessionStorage.setItem('username', response.username);
          sessionStorage.setItem('email', response.email);
          this.isLoggedInSubject.next(true);
        })
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          sessionStorage.setItem(this.tokenKey, response.token);
          sessionStorage.setItem('username', response.username);
          sessionStorage.setItem('email', response.email);
          this.isLoggedInSubject.next(true);
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    this.isLoggedInSubject.next(false);
  }

  deleteAccount(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.delete(`${this.apiUrl}/delete-account`, { headers })
      .pipe(
        tap(() => {
          // Limpiar todos los datos de sesión
          sessionStorage.clear();
          this.isLoggedInSubject.next(false);
        })
      );
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  getUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }
}