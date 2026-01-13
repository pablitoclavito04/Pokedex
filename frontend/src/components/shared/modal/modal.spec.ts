import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal';
import { PLATFORM_ID } from '@angular/core';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();
  });

  function createComponent(options?: {
    isOpen?: boolean;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    showCloseButton?: boolean;
    blockScroll?: boolean;
  }) {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;

    if (options) {
      if (options.isOpen !== undefined) component.isOpen = options.isOpen;
      if (options.title !== undefined) component.title = options.title;
      if (options.size) component.size = options.size;
      if (options.closeOnOverlay !== undefined) component.closeOnOverlay = options.closeOnOverlay;
      if (options.closeOnEsc !== undefined) component.closeOnEsc = options.closeOnEsc;
      if (options.showCloseButton !== undefined) component.showCloseButton = options.showCloseButton;
      if (options.blockScroll !== undefined) component.blockScroll = options.blockScroll;
    }

    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    beforeEach(() => createComponent());

    it('should be closed by default', () => {
      expect(component.isOpen).toBe(false);
    });

    it('should have empty title by default', () => {
      expect(component.title).toBe('');
    });

    it('should have md size by default', () => {
      expect(component.size).toBe('md');
    });

    it('should close on overlay click by default', () => {
      expect(component.closeOnOverlay).toBe(true);
    });

    it('should close on ESC by default', () => {
      expect(component.closeOnEsc).toBe(true);
    });

    it('should show close button by default', () => {
      expect(component.showCloseButton).toBe(true);
    });

    it('should block scroll by default', () => {
      expect(component.blockScroll).toBe(true);
    });
  });

  describe('visibility', () => {
    it('should not render overlay when closed', () => {
      createComponent({ isOpen: false });
      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      expect(overlay).toBeFalsy();
    });

    it('should render overlay when open', () => {
      createComponent({ isOpen: true });
      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      expect(overlay).toBeTruthy();
    });

    it('should render modal dialog when open', () => {
      createComponent({ isOpen: true });
      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal).toBeTruthy();
    });
  });

  describe('title', () => {
    it('should display title when provided', () => {
      createComponent({ isOpen: true, title: 'Test Modal Title' });
      const titleElement = fixture.nativeElement.querySelector('.modal__title');
      expect(titleElement).toBeTruthy();
      expect(titleElement.textContent).toBe('Test Modal Title');
    });

    it('should not render title element when empty', () => {
      createComponent({ isOpen: true, title: '' });
      const titleElement = fixture.nativeElement.querySelector('.modal__title');
      expect(titleElement).toBeFalsy();
    });
  });

  describe('close button', () => {
    it('should render close button when showCloseButton is true', () => {
      createComponent({ isOpen: true, showCloseButton: true });
      const closeButton = fixture.nativeElement.querySelector('.modal__close');
      expect(closeButton).toBeTruthy();
    });

    it('should not render close button when showCloseButton is false', () => {
      createComponent({ isOpen: true, showCloseButton: false });
      const closeButton = fixture.nativeElement.querySelector('.modal__close');
      expect(closeButton).toBeFalsy();
    });

    it('should emit closed event when close button is clicked', () => {
      createComponent({ isOpen: true, showCloseButton: true });
      const closeSpy = vi.spyOn(component.closed, 'emit');

      const closeButton = fixture.nativeElement.querySelector('.modal__close');
      closeButton.click();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('overlay click', () => {
    it('should emit closed when overlay is clicked and closeOnOverlay is true', () => {
      createComponent({ isOpen: true, closeOnOverlay: true });
      const closeSpy = vi.spyOn(component.closed, 'emit');

      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      overlay.click();

      expect(closeSpy).toHaveBeenCalled();
    });

    it('should not emit closed when overlay is clicked and closeOnOverlay is false', () => {
      createComponent({ isOpen: true, closeOnOverlay: false });
      const closeSpy = vi.spyOn(component.closed, 'emit');

      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      overlay.click();

      expect(closeSpy).not.toHaveBeenCalled();
    });
  });

  describe('modal content click', () => {
    it('should stop propagation when modal content is clicked', () => {
      createComponent({ isOpen: true });

      const modal = fixture.nativeElement.querySelector('.modal');
      const event = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

      modal.dispatchEvent(event);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe('size classes', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;

    sizes.forEach(size => {
      it(`should apply ${size} size class`, () => {
        createComponent({ isOpen: true, size });
        expect(component.modalClasses).toContain(`modal--${size}`);
      });
    });
  });

  describe('modalClasses getter', () => {
    it('should include base modal class', () => {
      createComponent({ isOpen: true });
      expect(component.modalClasses).toContain('modal');
    });

    it('should include size class', () => {
      createComponent({ isOpen: true, size: 'lg' });
      expect(component.modalClasses).toBe('modal modal--lg');
    });
  });

  describe('accessibility', () => {
    it('should have role="dialog" on overlay', () => {
      createComponent({ isOpen: true });
      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      expect(overlay.getAttribute('role')).toBe('dialog');
    });

    it('should have aria-modal="true" on overlay', () => {
      createComponent({ isOpen: true });
      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      expect(overlay.getAttribute('aria-modal')).toBe('true');
    });

    it('should have aria-labelledby when title is present', () => {
      createComponent({ isOpen: true, title: 'Test Title' });
      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      expect(overlay.getAttribute('aria-labelledby')).toBe('modal-title');
    });

    it('should not have aria-labelledby when title is empty', () => {
      createComponent({ isOpen: true, title: '' });
      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      expect(overlay.getAttribute('aria-labelledby')).toBeNull();
    });

    it('should have role="document" on modal content', () => {
      createComponent({ isOpen: true });
      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal.getAttribute('role')).toBe('document');
    });

    it('should have aria-label on close button', () => {
      createComponent({ isOpen: true, showCloseButton: true });
      const closeButton = fixture.nativeElement.querySelector('.modal__close');
      expect(closeButton.getAttribute('aria-label')).toBe('Cerrar modal');
    });
  });

  describe('ESC key handling', () => {
    it('should call close when ESC is pressed and modal is open', () => {
      createComponent({ isOpen: true, closeOnEsc: true });
      const closeSpy = vi.spyOn(component, 'close');

      component.onEscapeKey();

      expect(closeSpy).toHaveBeenCalled();
    });

    it('should not call close when ESC is pressed and closeOnEsc is false', () => {
      createComponent({ isOpen: true, closeOnEsc: false });
      const closeSpy = vi.spyOn(component, 'close');

      component.onEscapeKey();

      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('should not call close when ESC is pressed and modal is closed', () => {
      createComponent({ isOpen: false, closeOnEsc: true });
      const closeSpy = vi.spyOn(component, 'close');

      component.onEscapeKey();

      expect(closeSpy).not.toHaveBeenCalled();
    });
  });

  describe('close method', () => {
    it('should emit closed event when close is called', () => {
      createComponent({ isOpen: true });
      const closeSpy = vi.spyOn(component.closed, 'emit');

      component.close();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('structure', () => {
    beforeEach(() => createComponent({ isOpen: true, title: 'Test' }));

    it('should have header section', () => {
      const header = fixture.nativeElement.querySelector('.modal__header');
      expect(header).toBeTruthy();
    });

    it('should have body section', () => {
      const body = fixture.nativeElement.querySelector('.modal__body');
      expect(body).toBeTruthy();
    });

    it('should have footer section', () => {
      const footer = fixture.nativeElement.querySelector('.modal__footer');
      expect(footer).toBeTruthy();
    });
  });
});
