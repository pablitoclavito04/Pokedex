import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent]
    }).compileComponents();
  });

  function createComponent(options?: {
    variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    size?: 'sm' | 'md' | 'lg';
    dot?: boolean;
    color?: string | null;
    textColor?: string;
    outline?: boolean;
    count?: number | null;
    maxCount?: number;
  }) {
    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;

    if (options) {
      if (options.variant) component.variant = options.variant;
      if (options.size) component.size = options.size;
      if (options.dot !== undefined) component.dot = options.dot;
      if (options.color !== undefined) component.color = options.color;
      if (options.textColor) component.textColor = options.textColor;
      if (options.outline !== undefined) component.outline = options.outline;
      if (options.count !== undefined) component.count = options.count;
      if (options.maxCount) component.maxCount = options.maxCount;
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

    it('should not be a dot by default', () => {
      expect(component.dot).toBe(false);
    });

    it('should not have custom color by default', () => {
      expect(component.color).toBeNull();
    });

    it('should not be outline by default', () => {
      expect(component.outline).toBe(false);
    });

    it('should not have count by default', () => {
      expect(component.count).toBeNull();
    });

    it('should have maxCount of 99 by default', () => {
      expect(component.maxCount).toBe(99);
    });
  });

  describe('badgeClasses getter', () => {
    it('should include base badge class', () => {
      createComponent();
      expect(component.badgeClasses).toContain('badge');
    });

    it('should include size class', () => {
      createComponent({ size: 'lg' });
      expect(component.badgeClasses).toContain('badge--lg');
    });

    it('should include variant class when no custom color', () => {
      createComponent({ variant: 'success' });
      expect(component.badgeClasses).toContain('badge--success');
    });

    it('should not include variant class when custom color is set', () => {
      createComponent({ color: '#ff0000', variant: 'success' });
      expect(component.badgeClasses).not.toContain('badge--success');
    });

    it('should include dot class when dot is true', () => {
      createComponent({ dot: true });
      expect(component.badgeClasses).toContain('badge--dot');
    });

    it('should include outline class when outline is true', () => {
      createComponent({ outline: true });
      expect(component.badgeClasses).toContain('badge--outline');
    });

    it('should include count class when count is set', () => {
      createComponent({ count: 5 });
      expect(component.badgeClasses).toContain('badge--count');
    });
  });

  describe('customStyles getter', () => {
    it('should return null when no custom color', () => {
      createComponent();
      expect(component.customStyles).toBeNull();
    });

    it('should return styles object when custom color is set', () => {
      createComponent({ color: '#ff5500', textColor: '#000000' });
      expect(component.customStyles).toEqual({
        'background-color': '#ff5500',
        'color': '#000000'
      });
    });

    it('should use default textColor when not specified', () => {
      createComponent({ color: '#ff5500' });
      expect(component.customStyles).toEqual({
        'background-color': '#ff5500',
        'color': '#ffffff'
      });
    });
  });

  describe('displayCount getter', () => {
    it('should return empty string when count is null', () => {
      createComponent({ count: null });
      expect(component.displayCount).toBe('');
    });

    it('should return count as string when below maxCount', () => {
      createComponent({ count: 42 });
      expect(component.displayCount).toBe('42');
    });

    it('should return count as string when equal to maxCount', () => {
      createComponent({ count: 99 });
      expect(component.displayCount).toBe('99');
    });

    it('should return maxCount+ when count exceeds maxCount', () => {
      createComponent({ count: 150 });
      expect(component.displayCount).toBe('99+');
    });

    it('should respect custom maxCount', () => {
      createComponent({ maxCount: 50, count: 51 });
      expect(component.displayCount).toBe('50+');
    });

    it('should handle zero count', () => {
      createComponent({ count: 0 });
      expect(component.displayCount).toBe('0');
    });
  });

  describe('template rendering', () => {
    it('should render span element', () => {
      createComponent();
      const span = fixture.nativeElement.querySelector('span');
      expect(span).toBeTruthy();
    });

    it('should display count when count is set', () => {
      createComponent({ count: 25 });
      const span = fixture.nativeElement.querySelector('span');
      expect(span.textContent.trim()).toBe('25');
    });

    it('should display 99+ for counts over 99', () => {
      createComponent({ count: 100 });
      const span = fixture.nativeElement.querySelector('span');
      expect(span.textContent.trim()).toBe('99+');
    });

    it('should apply custom styles when color is set', () => {
      createComponent({ color: '#ff0000' });
      const span = fixture.nativeElement.querySelector('span');
      expect(span.style.backgroundColor).toBe('rgb(255, 0, 0)');
    });
  });

  describe('variant classes', () => {
    const variants = ['primary', 'secondary', 'success', 'error', 'warning', 'info'] as const;

    variants.forEach(variant => {
      it(`should apply ${variant} variant class`, () => {
        createComponent({ variant });
        expect(component.badgeClasses).toContain(`badge--${variant}`);
      });
    });
  });

  describe('size classes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      it(`should apply ${size} size class`, () => {
        createComponent({ size });
        expect(component.badgeClasses).toContain(`badge--${size}`);
      });
    });
  });
});
