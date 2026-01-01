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

export interface ProfileUpdateRequest {
  displayName?: string;
  bio?: string;
  gender?: string;
  favoriteRegion?: string;
  language?: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  displayName?: string;
  bio?: string;
  gender?: string;
  favoriteRegion?: string;
  language?: string;
  avatar?: string;
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
          this.saveUserData(response);
          this.isLoggedInSubject.next(true);
        })
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          this.saveUserData(response);
          this.isLoggedInSubject.next(true);
        })
      );
  }

  updateProfile(data: ProfileUpdateRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.put<AuthResponse>(`${this.apiUrl}/profile`, data, { headers })
      .pipe(
        tap(response => {
          this.saveUserData(response);
        })
      );
  }

  logout(): void {
    sessionStorage.clear();
    this.isLoggedInSubject.next(false);
  }

  deleteAccount(): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.delete(`${this.apiUrl}/delete-account`, { 
      headers,
      responseType: 'text'
    }).pipe(
      tap(() => {
        sessionStorage.clear();
        this.isLoggedInSubject.next(false);
      })
    );
  }

  private saveUserData(response: AuthResponse): void {
    sessionStorage.setItem(this.tokenKey, response.token);
    sessionStorage.setItem('username', response.username);
    sessionStorage.setItem('email', response.email);
    
    if (response.displayName) {
      sessionStorage.setItem('displayName', response.displayName);
    }
    if (response.bio) {
      sessionStorage.setItem('userBio', response.bio);
    }
    if (response.gender) {
      sessionStorage.setItem('userGender', response.gender);
    }
    if (response.favoriteRegion) {
      sessionStorage.setItem('userFavoriteRegion', response.favoriteRegion);
    }
    if (response.language) {
      sessionStorage.setItem('userLanguage', response.language);
    }
    if (response.avatar) {
      sessionStorage.setItem('userAvatar', response.avatar);
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  getUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  getDisplayName(): string | null {
    return sessionStorage.getItem('displayName') || sessionStorage.getItem('username');
  }

  getAvatar(): string | null {
    return sessionStorage.getItem('userAvatar');
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }
}