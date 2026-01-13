import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();
  });

  function createComponent(options?: {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    iconLeft?: string;
    iconRight?: string;
  }) {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;

    if (options) {
      if (options.variant) component.variant = options.variant;
      if (options.size) component.size = options.size;
      if (options.type) component.type = options.type;
      if (options.disabled !== undefined) component.disabled = options.disabled;
      if (options.loading !== undefined) component.loading = options.loading;
      if (options.fullWidth !== undefined) component.fullWidth = options.fullWidth;
      if (options.iconLeft) component.iconLeft = options.iconLeft;
      if (options.iconRight) component.iconRight = options.iconRight;
    }

    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    beforeEach(() => createComponent());

    it('should have primary variant by default', () => {
      expect(component.variant).toBe('primary');
    });

    it('should have md size by default', () => {
      expect(component.size).toBe('md');
    });

    it('should have button type by default', () => {
      expect(component.type).toBe('button');
    });

    it('should not be disabled by default', () => {
      expect(component.disabled).toBe(false);
    });

    it('should not be loading by default', () => {
      expect(component.loading).toBe(false);
    });
  });

  describe('buttonClasses getter', () => {
    it('should include base button class', () => {
      createComponent();
      expect(component.buttonClasses).toContain('button');
    });

    it('should include variant class', () => {
      createComponent({ variant: 'secondary' });
      expect(component.buttonClasses).toContain('button--secondary');
    });

    it('should include size class', () => {
      createComponent({ size: 'lg' });
      expect(component.buttonClasses).toContain('button--lg');
    });

    it('should include disabled class when disabled', () => {
      createComponent({ disabled: true });
      expect(component.buttonClasses).toContain('button--disabled');
    });

    it('should include loading class when loading', () => {
      createComponent({ loading: true });
      expect(component.buttonClasses).toContain('button--loading');
    });

    it('should include full-width class when fullWidth is true', () => {
      createComponent({ fullWidth: true });
      expect(component.buttonClasses).toContain('button--full-width');
    });

    it('should include with-icon class when iconLeft is set', () => {
      createComponent({ iconLeft: 'arrow-left' });
      expect(component.buttonClasses).toContain('button--with-icon');
    });

    it('should include with-icon class when iconRight is set', () => {
      createComponent({ iconRight: 'arrow-right' });
      expect(component.buttonClasses).toContain('button--with-icon');
    });
  });

  describe('onClick()', () => {
    it('should emit buttonClick event when clicked', () => {
      createComponent();
      const spy = vi.spyOn(component.buttonClick, 'emit');
      const mockEvent = new MouseEvent('click');

      component.onClick(mockEvent);

      expect(spy).toHaveBeenCalledWith(mockEvent);
    });

    it('should not emit when disabled', () => {
      createComponent({ disabled: true });
      const spy = vi.spyOn(component.buttonClick, 'emit');

      component.onClick(new MouseEvent('click'));

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit when loading', () => {
      createComponent({ loading: true });
      const spy = vi.spyOn(component.buttonClick, 'emit');

      component.onClick(new MouseEvent('click'));

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    it('should render button element', () => {
      createComponent();
      const button = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
    });

    it('should have correct type attribute', () => {
      createComponent({ type: 'submit' });
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('type')).toBe('submit');
    });

    it('should be disabled when disabled input is true', () => {
      createComponent({ disabled: true });
      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(true);
    });

    it('should be disabled when loading', () => {
      createComponent({ loading: true });
      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(true);
    });

    it('should show spinner when loading', () => {
      createComponent({ loading: true });
      const spinner = fixture.nativeElement.querySelector('.button__spinner');
      expect(spinner).toBeTruthy();
    });

    it('should not show spinner when not loading', () => {
      createComponent({ loading: false });
      const spinner = fixture.nativeElement.querySelector('.button__spinner');
      expect(spinner).toBeFalsy();
    });
  });

  describe('accessibility', () => {
    it('should have aria-disabled when disabled', () => {
      createComponent({ disabled: true });
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-disabled')).toBe('true');
    });

    it('should have aria-busy when loading', () => {
      createComponent({ loading: true });
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-busy')).toBe('true');
    });
  });
});
