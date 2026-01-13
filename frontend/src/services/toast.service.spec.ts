import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { firstValueFrom } from 'rxjs';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show()', () => {
    it('should add a toast to the list', async () => {
      service.show('Test message', 'info');

      const toasts = await firstValueFrom(service.toasts$);
      expect(toasts.length).toBe(1);
      expect(toasts[0].message).toBe('Test message');
      expect(toasts[0].type).toBe('info');
    });

    it('should assign unique IDs to each toast', async () => {
      service.show('First', 'info', 0);
      service.show('Second', 'success', 0);

      const toasts = await firstValueFrom(service.toasts$);
      expect(toasts.length).toBe(2);
      expect(toasts[0].id).not.toBe(toasts[1].id);
    });

    it('should set correct duration', async () => {
      service.show('Test', 'info', 5000);

      const toasts = await firstValueFrom(service.toasts$);
      expect(toasts[0].duration).toBe(5000);
    });

    it('should allow zero duration for persistent toasts', async () => {
      service.show('Persistent', 'warning', 0);

      const toasts = await firstValueFrom(service.toasts$);
      expect(toasts[0].duration).toBe(0);
      expect(toasts.length).toBe(1);
    });
  });

  describe('success()', () => {
    it('should create a success toast with default duration', async () => {
      service.success('Success message');

      const toasts = await firstValueFrom(service.toasts$);
      expect(toasts[0].type).toBe('success');
      expect(toasts[0].duration).toBe(4000);
    });
  });

  describe('error()', () => {
    it('should create an error toast with longer default duration', async () => {
      service.error('Error message');

      const toasts = await firstValueFrom(service.toasts$);
      expect(toasts[0].type).toBe('error');
      expect(toasts[0].duration).toBe(8000);
    });
  });

  describe('info()', () => {
    it('should create an info toast', async () => {
      service.info('Info message');

      const toasts = await firstValueFrom(service.toasts$);
      expect(toasts[0].type).toBe('info');
      expect(toasts[0].duration).toBe(3000);
    });
  });

  describe('warning()', () => {
    it('should create a warning toast', async () => {
      service.warning('Warning message');

      const toasts = await firstValueFrom(service.toasts$);
      expect(toasts[0].type).toBe('warning');
      expect(toasts[0].duration).toBe(6000);
    });
  });

  describe('dismiss()', () => {
    it('should remove a specific toast by ID', async () => {
      service.show('Toast 1', 'info', 0);
      service.show('Toast 2', 'success', 0);

      let toasts = await firstValueFrom(service.toasts$);
      expect(toasts.length).toBe(2);

      const idToRemove = toasts[0].id;
      service.dismiss(idToRemove);

      toasts = await firstValueFrom(service.toasts$);
      expect(toasts.length).toBe(1);
      expect(toasts[0].message).toBe('Toast 2');
    });
  });

  describe('dismissAll()', () => {
    it('should remove all toasts', async () => {
      service.show('Toast 1', 'info', 0);
      service.show('Toast 2', 'success', 0);
      service.show('Toast 3', 'warning', 0);

      let toasts = await firstValueFrom(service.toasts$);
      expect(toasts.length).toBe(3);

      service.dismissAll();

      toasts = await firstValueFrom(service.toasts$);
      expect(toasts.length).toBe(0);
    });
  });
});
