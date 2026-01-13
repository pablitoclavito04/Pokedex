import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';
import { firstValueFrom } from 'rxjs';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show()', () => {
    it('should set isLoading to true when show is called', () => {
      service.show();
      expect(service.isLoading).toBe(true);
    });

    it('should use default message when no message provided', async () => {
      service.show();
      const message = await firstValueFrom(service.message$);
      expect(message).toBe('Cargando...');
    });

    it('should use custom message when provided', async () => {
      const customMessage = 'Procesando datos...';
      service.show(customMessage);
      const message = await firstValueFrom(service.message$);
      expect(message).toBe(customMessage);
    });

    it('should increment request count', () => {
      service.show();
      expect(service.getActiveRequests()).toBe(1);
      service.show();
      expect(service.getActiveRequests()).toBe(2);
    });
  });

  describe('hide()', () => {
    it('should set isLoading to false when all requests complete', () => {
      service.show();
      service.hide();
      expect(service.isLoading).toBe(false);
    });

    it('should keep loading true if multiple requests are active', () => {
      service.show();
      service.show();
      service.hide();
      expect(service.isLoading).toBe(true);
      expect(service.getActiveRequests()).toBe(1);
    });

    it('should not go below zero request count', () => {
      service.hide();
      service.hide();
      expect(service.getActiveRequests()).toBe(0);
    });
  });

  describe('forceHide()', () => {
    it('should immediately set isLoading to false', () => {
      service.show();
      service.show();
      service.show();
      service.forceHide();
      expect(service.isLoading).toBe(false);
      expect(service.getActiveRequests()).toBe(0);
    });
  });

  describe('isLoading$', () => {
    it('should emit loading state changes', async () => {
      const states: boolean[] = [];

      // Collect initial state
      states.push(service.isLoading);

      service.show();
      states.push(service.isLoading);

      service.hide();
      states.push(service.isLoading);

      expect(states).toEqual([false, true, false]);
    });

    it('should reflect current state via observable', async () => {
      const initialState = await firstValueFrom(service.isLoading$);
      expect(initialState).toBe(false);

      service.show();
      const loadingState = await firstValueFrom(service.isLoading$);
      expect(loadingState).toBe(true);
    });
  });
});
