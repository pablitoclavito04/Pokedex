import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

/**
 * Servicio de validadores asíncronos
 *
 * Proporciona validadores que consultan APIs (simuladas o reales)
 * para validar datos como email único, username disponible, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class AsyncValidatorsService {
  // Simular emails ya registrados
  private registeredEmails = [
    'admin@pokedex.com',
    'user@test.com',
    'demo@ejemplo.com'
  ];

  // Simular usernames ya registrados
  private registeredUsernames = [
    'admin',
    'usuario',
    'test',
    'demo',
    'root'
  ];

  private debounceTime = 500; // ms

  constructor(private http?: HttpClient) {}

  /**
   * Validador asíncrono de email único
   *
   * Verifica que el email no esté ya registrado.
   * Incluye debounce para evitar múltiples llamadas.
   *
   * @param excludeUserId ID de usuario a excluir (para edición)
   */
  emailUnique(excludeUserId?: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(this.debounceTime).pipe(
        switchMap(() => this.checkEmailUnique(control.value, excludeUserId)),
        catchError(() => of(null)) // En caso de error de red, no bloquear
      );
    };
  }

  /**
   * Validador asíncrono de username disponible
   *
   * Verifica que el nombre de usuario esté disponible.
   * Incluye debounce para evitar múltiples llamadas.
   */
  usernameAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const username = control.value;

      if (!username || username.length < 3) {
        return of(null);
      }

      return timer(this.debounceTime).pipe(
        switchMap(() => this.checkUsernameAvailable(username)),
        catchError(() => of(null))
      );
    };
  }

  /**
   * Validador asíncrono de NIF único
   *
   * Verifica que el NIF no esté ya registrado en el sistema.
   */
  nifUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(this.debounceTime).pipe(
        switchMap(() => this.checkNifUnique(control.value)),
        catchError(() => of(null))
      );
    };
  }

  // ============================================================================
  //                    MÉTODOS PRIVADOS (Simulación de API)
  // ============================================================================

  /**
   * Simula verificación de email único
   * En producción, esto haría una llamada HTTP real
   */
  private checkEmailUnique(
    email: string,
    excludeUserId?: string
  ): Observable<ValidationErrors | null> {
    // Simular delay de red (300-800ms)
    const delay = Math.random() * 500 + 300;

    return new Observable(observer => {
      setTimeout(() => {
        const emailLower = email.toLowerCase();
        const exists = this.registeredEmails.includes(emailLower);

        if (exists && !excludeUserId) {
          observer.next({ emailTaken: { message: 'Este email ya está registrado' } });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, delay);
    });
  }

  /**
   * Simula verificación de username disponible
   */
  private checkUsernameAvailable(username: string): Observable<ValidationErrors | null> {
    const delay = Math.random() * 500 + 300;

    return new Observable(observer => {
      setTimeout(() => {
        const usernameLower = username.toLowerCase();
        const exists = this.registeredUsernames.includes(usernameLower);

        if (exists) {
          observer.next({ usernameTaken: { message: 'Este nombre de usuario no está disponible' } });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, delay);
    });
  }

  /**
   * Simula verificación de NIF único
   */
  private checkNifUnique(nif: string): Observable<ValidationErrors | null> {
    const delay = Math.random() * 500 + 300;

    // Simular algunos NIFs ya registrados
    const registeredNifs = ['12345678Z', '87654321X'];

    return new Observable(observer => {
      setTimeout(() => {
        const nifUpper = nif.toUpperCase();
        const exists = registeredNifs.includes(nifUpper);

        if (exists) {
          observer.next({ nifTaken: { message: 'Este NIF ya está registrado' } });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, delay);
    });
  }

  // ============================================================================
  //                    MÉTODOS CON HTTP REAL (para producción)
  // ============================================================================

  /**
   * Validador de email único usando HTTP real
   * Descomentar y usar cuando haya backend
   */
  /*
  emailUniqueHttp(apiUrl: string, excludeUserId?: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || !this.http) {
        return of(null);
      }

      const params = excludeUserId ? `?excludeUserId=${excludeUserId}` : '';

      return timer(this.debounceTime).pipe(
        switchMap(() =>
          this.http!.get<{ exists: boolean }>(`${apiUrl}/check-email/${control.value}${params}`)
        ),
        map(response => response.exists ? { emailTaken: true } : null),
        catchError(() => of(null))
      );
    };
  }
  */
}

// ============================================================================
//                    FUNCIONES STANDALONE (sin servicio)
// ============================================================================

/**
 * Crea un validador asíncrono de email único standalone
 * Útil cuando no se quiere inyectar el servicio
 */
export function createEmailUniqueValidator(
  registeredEmails: string[] = [],
  debounceMs: number = 500
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return timer(debounceMs).pipe(
      map(() => {
        const emailLower = control.value.toLowerCase();
        const exists = registeredEmails.includes(emailLower);
        return exists ? { emailTaken: true } : null;
      })
    );
  };
}

/**
 * Crea un validador asíncrono de username disponible standalone
 */
export function createUsernameAvailableValidator(
  registeredUsernames: string[] = [],
  debounceMs: number = 500
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 3) {
      return of(null);
    }

    return timer(debounceMs).pipe(
      map(() => {
        const usernameLower = control.value.toLowerCase();
        const exists = registeredUsernames.includes(usernameLower);
        return exists ? { usernameTaken: true } : null;
      })
    );
  };
}
