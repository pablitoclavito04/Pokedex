import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner';
import { LoadingService } from '../../../services/loading.service';
import { ChangeDetectorRef } from '@angular/core';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent],
      providers: [LoadingService]
    }).compileComponents();

    loadingService = TestBed.inject(LoadingService);
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loading state', () => {
    it('should not show spinner when not loading', () => {
      loadingService.forceHide();
      fixture.detectChanges();

      const overlay = fixture.nativeElement.querySelector('.spinner-overlay');
      expect(overlay).toBeFalsy();
    });

    it('should show spinner when loading', async () => {
      loadingService.show();

      // Trigger change detection for OnPush component
      fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const overlay = fixture.nativeElement.querySelector('.spinner-overlay');
      expect(overlay).toBeTruthy();
    });

    it('should hide spinner when loading stops', async () => {
      loadingService.show();
      fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      let overlay = fixture.nativeElement.querySelector('.spinner-overlay');
      expect(overlay).toBeTruthy();

      loadingService.hide();
      fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      overlay = fixture.nativeElement.querySelector('.spinner-overlay');
      expect(overlay).toBeFalsy();
    });
  });

  describe('message display', () => {
    it('should display default message', async () => {
      loadingService.show();
      fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const messageElement = fixture.nativeElement.querySelector('.spinner__text');
      expect(messageElement.textContent).toBe('Cargando...');
    });

    it('should display custom message', async () => {
      loadingService.show('Procesando datos...');
      fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const messageElement = fixture.nativeElement.querySelector('.spinner__text');
      expect(messageElement.textContent).toBe('Procesando datos...');
    });
  });

  describe('accessibility', () => {
    it('should have role="status"', async () => {
      loadingService.show();
      fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const overlay = fixture.nativeElement.querySelector('.spinner-overlay');
      expect(overlay.getAttribute('role')).toBe('status');
    });

    it('should have aria-live="polite"', async () => {
      loadingService.show();
      fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const overlay = fixture.nativeElement.querySelector('.spinner-overlay');
      expect(overlay.getAttribute('aria-live')).toBe('polite');
    });

    it('should have visually-hidden text for screen readers', async () => {
      loadingService.show();
      fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const hiddenText = fixture.nativeElement.querySelector('.visually-hidden');
      expect(hiddenText).toBeTruthy();
      expect(hiddenText.textContent).toContain('Cargando');
    });
  });

  describe('pokeball elements', () => {
    it('should render pokeball structure when loading', async () => {
      loadingService.show();
      fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      const pokeball = fixture.nativeElement.querySelector('.spinner__pokeball');
      const top = fixture.nativeElement.querySelector('.spinner__pokeball-top');
      const center = fixture.nativeElement.querySelector('.spinner__pokeball-center');
      const bottom = fixture.nativeElement.querySelector('.spinner__pokeball-bottom');
      const button = fixture.nativeElement.querySelector('.spinner__pokeball-button');

      expect(pokeball).toBeTruthy();
      expect(top).toBeTruthy();
      expect(center).toBeTruthy();
      expect(bottom).toBeTruthy();
      expect(button).toBeTruthy();
    });
  });

  describe('observable subscriptions', () => {
    it('should expose isLoading$ from LoadingService', () => {
      expect(component.isLoading$).toBe(loadingService.isLoading$);
    });

    it('should expose message$ from LoadingService', () => {
      expect(component.message$).toBe(loadingService.message$);
    });
  });
});
