/**
 * Tests de integración para el flujo de autenticación
 *
 * Estos tests verifican que múltiples servicios funcionan correctamente juntos:
 * - AuthService + HTTP Client
 * - LoadingService durante operaciones async
 * - ToastService para notificaciones
 */

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService, LoginRequest, AuthResponse } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { firstValueFrom } from 'rxjs';

describe('Auth Flow Integration Tests', () => {
  let authService: AuthService;
  let loadingService: LoadingService;
  let toastService: ToastService;
  let httpTestingController: HttpTestingController;

  // Mock sessionStorage
  const sessionStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeAll(() => {
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
    });
  });

  beforeEach(() => {
    sessionStorageMock.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        LoadingService,
        ToastService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    authService = TestBed.inject(AuthService);
    loadingService = TestBed.inject(LoadingService);
    toastService = TestBed.inject(ToastService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Complete Login Flow', () => {
    const mockCredentials: LoginRequest = {
      username: 'testuser',
      password: 'password123',
    };

    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-12345',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
      displayName: 'Test User',
      bio: 'A test user bio',
      favoriteRegion: 'Kanto',
    };

    it('should complete login flow and update all services', async () => {
      // 1. Verificar estado inicial
      expect(authService.isLoggedIn()).toBe(false);
      expect(authService.getToken()).toBeNull();

      // 2. Simular flujo de login con loading
      loadingService.show('Iniciando sesión...');
      let isLoading = await firstValueFrom(loadingService.isLoading$);
      expect(isLoading).toBe(true);

      // 3. Iniciar petición de login
      const loginPromise = firstValueFrom(authService.login(mockCredentials));

      // 4. Simular respuesta del servidor
      const req = httpTestingController.expectOne(
        'https://pokedex-backend-mwcz.onrender.com/api/auth/login'
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCredentials);
      req.flush(mockResponse);

      // 5. Esperar que se complete el login
      const response = await loginPromise;

      // 6. Ocultar loading
      loadingService.hide();

      // 7. Verificar que el estado se actualizó correctamente
      expect(response.token).toBe(mockResponse.token);
      expect(authService.isLoggedIn()).toBe(true);
      expect(authService.getToken()).toBe(mockResponse.token);
      expect(authService.getUsername()).toBe(mockResponse.username);
      expect(authService.getDisplayName()).toBe(mockResponse.displayName);

      // 8. Verificar isLoggedIn$ observable
      const loggedIn = await firstValueFrom(authService.isLoggedIn$);
      expect(loggedIn).toBe(true);

      // 9. Verificar loading está oculto
      isLoading = await firstValueFrom(loadingService.isLoading$);
      expect(isLoading).toBe(false);
    });

    it('should maintain auth state across multiple operations', async () => {
      // Login primero
      const loginPromise = firstValueFrom(authService.login(mockCredentials));
      const req = httpTestingController.expectOne(
        'https://pokedex-backend-mwcz.onrender.com/api/auth/login'
      );
      req.flush(mockResponse);
      await loginPromise;

      // Verificar persistencia
      expect(authService.isLoggedIn()).toBe(true);
      expect(authService.getToken()).toBe(mockResponse.token);

      // Crear múltiples toasts sin afectar auth
      toastService.success('Login exitoso');
      toastService.info('Bienvenido de nuevo');

      const toasts = await firstValueFrom(toastService.toasts$);
      expect(toasts.length).toBe(2);

      // Auth sigue intacto
      expect(authService.isLoggedIn()).toBe(true);
      expect(authService.getToken()).toBe(mockResponse.token);
    });
  });

  describe('Complete Logout Flow', () => {
    const mockCredentials: LoginRequest = {
      username: 'testuser',
      password: 'password123',
    };

    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-12345',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
    };

    it('should complete logout and clear all auth data', async () => {
      // 1. Primero hacer login
      const loginPromise = firstValueFrom(authService.login(mockCredentials));
      const req = httpTestingController.expectOne(
        'https://pokedex-backend-mwcz.onrender.com/api/auth/login'
      );
      req.flush(mockResponse);
      await loginPromise;

      expect(authService.isLoggedIn()).toBe(true);
      expect(authService.getToken()).toBe(mockResponse.token);

      // 2. Hacer logout
      authService.logout();

      // 3. Verificar que todo se limpió
      expect(authService.isLoggedIn()).toBe(false);
      expect(authService.getToken()).toBeNull();
      expect(authService.getUsername()).toBeNull();

      // 4. Verificar observable
      const loggedIn = await firstValueFrom(authService.isLoggedIn$);
      expect(loggedIn).toBe(false);
    });

    it('should show toast notification after logout', async () => {
      // Login
      const loginPromise = firstValueFrom(authService.login(mockCredentials));
      const req = httpTestingController.expectOne(
        'https://pokedex-backend-mwcz.onrender.com/api/auth/login'
      );
      req.flush(mockResponse);
      await loginPromise;

      // Logout con notificación
      authService.logout();
      toastService.info('Has cerrado sesión');

      const toasts = await firstValueFrom(toastService.toasts$);
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('info');
      expect(toasts[0].message).toBe('Has cerrado sesión');

      // Verificar que ya no hay sesión
      expect(authService.isLoggedIn()).toBe(false);
    });
  });

  describe('Registration Flow', () => {
    const mockRegisterData = {
      username: 'newuser',
      password: 'securepass123',
      email: 'newuser@example.com',
      pais: 'España',
    };

    const mockResponse: AuthResponse = {
      token: 'new-user-token-67890',
      username: 'newuser',
      email: 'newuser@example.com',
      role: 'user',
    };

    it('should complete registration and auto-login', async () => {
      // 1. Estado inicial
      expect(authService.isLoggedIn()).toBe(false);

      // 2. Registrar usuario
      const registerPromise = firstValueFrom(authService.register(mockRegisterData));
      const req = httpTestingController.expectOne(
        'https://pokedex-backend-mwcz.onrender.com/api/auth/register'
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      const response = await registerPromise;

      // 3. Verificar auto-login después del registro
      expect(response.token).toBe(mockResponse.token);
      expect(authService.isLoggedIn()).toBe(true);
      expect(authService.getToken()).toBe(mockResponse.token);
      expect(authService.getUsername()).toBe(mockResponse.username);

      // 4. Verificar observable
      const loggedIn = await firstValueFrom(authService.isLoggedIn$);
      expect(loggedIn).toBe(true);
    });
  });

  describe('Profile Update Flow', () => {
    const mockCredentials: LoginRequest = {
      username: 'testuser',
      password: 'password123',
    };

    const mockLoginResponse: AuthResponse = {
      token: 'mock-jwt-token-12345',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
    };

    const mockUpdateResponse: AuthResponse = {
      token: 'mock-jwt-token-12345',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
      displayName: 'Updated Display Name',
      bio: 'Updated bio text',
      favoriteRegion: 'Johto',
    };

    it('should update profile while maintaining session', async () => {
      // 1. Login primero
      const loginPromise = firstValueFrom(authService.login(mockCredentials));
      const loginReq = httpTestingController.expectOne(
        'https://pokedex-backend-mwcz.onrender.com/api/auth/login'
      );
      loginReq.flush(mockLoginResponse);
      await loginPromise;

      expect(authService.isLoggedIn()).toBe(true);

      // 2. Actualizar perfil
      const updateData = {
        displayName: 'Updated Display Name',
        bio: 'Updated bio text',
        favoriteRegion: 'Johto',
      };

      const updatePromise = firstValueFrom(authService.updateProfile(updateData));
      const updateReq = httpTestingController.expectOne(
        'https://pokedex-backend-mwcz.onrender.com/api/auth/profile'
      );
      expect(updateReq.request.method).toBe('PUT');
      updateReq.flush(mockUpdateResponse);

      const response = await updatePromise;

      // 3. Verificar que la sesión sigue activa
      expect(authService.isLoggedIn()).toBe(true);
      expect(authService.getToken()).toBe(mockLoginResponse.token);

      // 4. Verificar que los datos se actualizaron
      expect(response.displayName).toBe('Updated Display Name');
      expect(authService.getDisplayName()).toBe('Updated Display Name');
    });
  });

  describe('Delete Account Flow', () => {
    const mockCredentials: LoginRequest = {
      username: 'testuser',
      password: 'password123',
    };

    const mockLoginResponse: AuthResponse = {
      token: 'mock-jwt-token-12345',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
    };

    it('should delete account and clear all session data', async () => {
      // 1. Login primero
      const loginPromise = firstValueFrom(authService.login(mockCredentials));
      const loginReq = httpTestingController.expectOne(
        'https://pokedex-backend-mwcz.onrender.com/api/auth/login'
      );
      loginReq.flush(mockLoginResponse);
      await loginPromise;

      expect(authService.isLoggedIn()).toBe(true);

      // 2. Eliminar cuenta
      const deletePromise = firstValueFrom(authService.deleteAccount());
      const deleteReq = httpTestingController.expectOne(
        'https://pokedex-backend-mwcz.onrender.com/api/auth/delete-account'
      );
      expect(deleteReq.request.method).toBe('DELETE');
      deleteReq.flush('Account deleted successfully');

      await deletePromise;

      // 3. Verificar que la sesión se cerró
      expect(authService.isLoggedIn()).toBe(false);
      expect(authService.getToken()).toBeNull();
      expect(authService.getUsername()).toBeNull();

      // 4. Verificar observable
      const loggedIn = await firstValueFrom(authService.isLoggedIn$);
      expect(loggedIn).toBe(false);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle login error and show toast', async () => {
      const credentials: LoginRequest = {
        username: 'wronguser',
        password: 'wrongpass',
      };

      // Iniciar login
      const loginPromise = authService.login(credentials).toPromise();
      const req = httpTestingController.expectOne(
        'https://pokedex-backend-mwcz.onrender.com/api/auth/login'
      );

      // Simular error 401
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

      // Esperar que falle
      await expect(loginPromise).rejects.toBeTruthy();

      // Mostrar toast de error
      toastService.error('Credenciales incorrectas');
      const toasts = await firstValueFrom(toastService.toasts$);
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('error');

      // Verificar que no hay sesión
      expect(authService.isLoggedIn()).toBe(false);
    });

    it('should handle network error gracefully', async () => {
      const credentials: LoginRequest = {
        username: 'testuser',
        password: 'password123',
      };

      // Iniciar login
      const loginPromise = authService.login(credentials).toPromise();
      const req = httpTestingController.expectOne(
        'https://pokedex-backend-mwcz.onrender.com/api/auth/login'
      );

      // Simular error de red
      req.error(new ProgressEvent('Network error'), { status: 0 });

      // Esperar que falle
      await expect(loginPromise).rejects.toBeTruthy();

      // Mostrar toast de error de red
      toastService.error('Error de conexión. Verifica tu internet.');
      const toasts = await firstValueFrom(toastService.toasts$);
      expect(toasts[0].message).toBe('Error de conexión. Verifica tu internet.');

      // Sin sesión
      expect(authService.isLoggedIn()).toBe(false);
    });
  });

  describe('Loading State During Operations', () => {
    it('should show loading during login operation', async () => {
      const credentials: LoginRequest = {
        username: 'testuser',
        password: 'password123',
      };

      const mockResponse: AuthResponse = {
        token: 'token123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      };

      // 1. Mostrar loading antes del login
      loadingService.show('Iniciando sesión...');
      let isLoading = await firstValueFrom(loadingService.isLoading$);
      expect(isLoading).toBe(true);

      let message = await firstValueFrom(loadingService.message$);
      expect(message).toBe('Iniciando sesión...');

      // 2. Realizar login
      const loginPromise = firstValueFrom(authService.login(credentials));
      const req = httpTestingController.expectOne(
        'https://pokedex-backend-mwcz.onrender.com/api/auth/login'
      );
      req.flush(mockResponse);
      await loginPromise;

      // 3. Ocultar loading después del login
      loadingService.hide();
      isLoading = await firstValueFrom(loadingService.isLoading$);
      expect(isLoading).toBe(false);

      // 4. Verificar login exitoso
      expect(authService.isLoggedIn()).toBe(true);
    });
  });
});
