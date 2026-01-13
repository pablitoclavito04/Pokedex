import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService, LoginRequest, RegisterRequest, AuthResponse, ProfileUpdateRequest } from './auth.service';
import { firstValueFrom } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://pokedex-backend-mwcz.onrender.com/api/auth';

  // Mock response
  const mockAuthResponse: AuthResponse = {
    token: 'mock-jwt-token',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    displayName: 'Test User',
    bio: 'Test bio',
    gender: 'male',
    favoriteRegion: 'kanto',
    language: 'es',
    avatar: 'avatar-url'
  };

  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    const credentials: LoginRequest = {
      username: 'testuser',
      password: 'password123'
    };

    it('should make POST request to login endpoint', () => {
      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockAuthResponse);
    });

    it('should store token in sessionStorage on success', () => {
      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockAuthResponse);

      expect(sessionStorage.getItem('token')).toBe('mock-jwt-token');
    });

    it('should store username in sessionStorage', () => {
      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockAuthResponse);

      expect(sessionStorage.getItem('username')).toBe('testuser');
    });

    it('should store password in sessionStorage', () => {
      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockAuthResponse);

      expect(sessionStorage.getItem('userPassword')).toBe('password123');
    });

    it('should update isLoggedIn$ to true', async () => {
      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockAuthResponse);

      const isLoggedIn = await firstValueFrom(service.isLoggedIn$);
      expect(isLoggedIn).toBe(true);
    });
  });

  describe('register()', () => {
    const registerData: RegisterRequest = {
      username: 'newuser',
      password: 'password123',
      email: 'new@example.com',
      pais: 'España',
      fechaNacimiento: '1990-01-01'
    };

    it('should make POST request to register endpoint', () => {
      service.register(registerData).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockAuthResponse);
    });

    it('should store user data on successful registration', () => {
      service.register(registerData).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.flush(mockAuthResponse);

      expect(sessionStorage.getItem('token')).toBe('mock-jwt-token');
      expect(sessionStorage.getItem('email')).toBe('test@example.com');
    });
  });

  describe('updateProfile()', () => {
    const profileData: ProfileUpdateRequest = {
      displayName: 'Updated Name',
      bio: 'Updated bio'
    };

    it('should make PUT request to profile endpoint', () => {
      service.updateProfile(profileData).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/profile`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(profileData);
      req.flush(mockAuthResponse);
    });

    it('should update stored user data', () => {
      service.updateProfile(profileData).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/profile`);
      req.flush({ ...mockAuthResponse, displayName: 'Updated Name' });

      expect(sessionStorage.getItem('displayName')).toBe('Updated Name');
    });
  });

  describe('logout()', () => {
    beforeEach(() => {
      // Set up initial logged in state
      sessionStorage.setItem('token', 'test-token');
      sessionStorage.setItem('username', 'testuser');
    });

    it('should clear sessionStorage', () => {
      service.logout();
      expect(sessionStorage.getItem('token')).toBeNull();
      expect(sessionStorage.getItem('username')).toBeNull();
    });

    it('should update isLoggedIn$ to false', async () => {
      service.logout();
      const isLoggedIn = await firstValueFrom(service.isLoggedIn$);
      expect(isLoggedIn).toBe(false);
    });
  });

  describe('deleteAccount()', () => {
    it('should make DELETE request to delete-account endpoint', () => {
      service.deleteAccount().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/delete-account`);
      expect(req.request.method).toBe('DELETE');
      req.flush('Account deleted');
    });

    it('should clear sessionStorage on success', () => {
      sessionStorage.setItem('token', 'test-token');

      service.deleteAccount().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/delete-account`);
      req.flush('Account deleted');

      expect(sessionStorage.getItem('token')).toBeNull();
    });
  });

  describe('getToken()', () => {
    it('should return null when no token stored', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should return token when stored', () => {
      sessionStorage.setItem('token', 'my-token');
      expect(service.getToken()).toBe('my-token');
    });
  });

  describe('getUsername()', () => {
    it('should return null when no username stored', () => {
      expect(service.getUsername()).toBeNull();
    });

    it('should return username when stored', () => {
      sessionStorage.setItem('username', 'testuser');
      expect(service.getUsername()).toBe('testuser');
    });
  });

  describe('getDisplayName()', () => {
    it('should return username when no displayName stored', () => {
      sessionStorage.setItem('username', 'testuser');
      expect(service.getDisplayName()).toBe('testuser');
    });

    it('should return displayName when stored', () => {
      sessionStorage.setItem('username', 'testuser');
      sessionStorage.setItem('displayName', 'Test User');
      expect(service.getDisplayName()).toBe('Test User');
    });
  });

  describe('getAvatar()', () => {
    it('should return null when no avatar stored', () => {
      expect(service.getAvatar()).toBeNull();
    });

    it('should return avatar when stored', () => {
      sessionStorage.setItem('userAvatar', 'avatar-url');
      expect(service.getAvatar()).toBe('avatar-url');
    });
  });

  describe('isLoggedIn()', () => {
    it('should return false when no token', () => {
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return true when token exists', () => {
      sessionStorage.setItem('token', 'test-token');
      expect(service.isLoggedIn()).toBe(true);
    });
  });

  describe('password management', () => {
    it('should get password', () => {
      sessionStorage.setItem('userPassword', 'secret');
      expect(service.getPassword()).toBe('secret');
    });

    it('should set password', () => {
      service.setPassword('newpassword');
      expect(sessionStorage.getItem('userPassword')).toBe('newpassword');
    });
  });
});
