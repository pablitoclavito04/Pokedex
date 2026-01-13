import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService, Theme } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  // Mock localStorage
  let localStorageMock: { [key: string]: string } = {};

  beforeEach(() => {
    // Reset localStorage mock
    localStorageMock = {};

    // Mock localStorage methods
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => localStorageMock[key] || null,
        setItem: (key: string, value: string) => { localStorageMock[key] = value; },
        removeItem: (key: string) => { delete localStorageMock[key]; },
        clear: () => { localStorageMock = {}; }
      },
      writable: true
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {}
      }),
      writable: true
    });

    // Mock document.body and document.documentElement
    document.body.classList.remove('light-theme', 'dark-theme', 'theme-transitioning', 'no-transitions');
    document.documentElement.classList.remove('light-theme', 'dark-theme');

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should default to light theme', () => {
      expect(service.currentTheme()).toBe('light');
    });
  });

  describe('setTheme()', () => {
    it('should set theme to dark', () => {
      service.setTheme('dark');
      expect(service.currentTheme()).toBe('dark');
    });

    it('should set theme to light', () => {
      service.setTheme('dark');
      service.setTheme('light');
      expect(service.currentTheme()).toBe('light');
    });

    it('should persist theme to localStorage', () => {
      service.setTheme('dark');
      expect(localStorageMock['theme']).toBe('dark');
    });
  });

  describe('toggleTheme()', () => {
    it('should toggle from light to dark', () => {
      service.setTheme('light');
      service.toggleTheme();
      expect(service.currentTheme()).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      service.setTheme('dark');
      service.toggleTheme();
      expect(service.currentTheme()).toBe('light');
    });
  });

  describe('setTemporaryLightTheme()', () => {
    it('should set theme to light', () => {
      service.setTheme('dark');
      service.setTemporaryLightTheme();
      expect(service.currentTheme()).toBe('light');
    });
  });

  describe('restoreSavedTheme()', () => {
    it('should restore theme from localStorage', () => {
      localStorageMock['theme'] = 'dark';
      service.restoreSavedTheme();
      expect(service.currentTheme()).toBe('dark');
    });

    it('should do nothing if no saved theme', () => {
      service.setTheme('light');
      localStorageMock = {};
      service.restoreSavedTheme();
      expect(service.currentTheme()).toBe('light');
    });
  });

  describe('resetToSystemPreference()', () => {
    it('should set theme to light', () => {
      service.setTheme('dark');
      service.resetToSystemPreference();
      expect(service.currentTheme()).toBe('light');
    });
  });

  describe('signal reactivity', () => {
    it('should update currentTheme signal when theme changes', () => {
      const themeValues: Theme[] = [];

      // Capture initial value
      themeValues.push(service.currentTheme());

      service.setTheme('dark');
      themeValues.push(service.currentTheme());

      service.setTheme('light');
      themeValues.push(service.currentTheme());

      expect(themeValues).toEqual(['light', 'dark', 'light']);
    });
  });
});
