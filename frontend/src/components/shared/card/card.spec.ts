import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent, PokemonType } from './card';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent]
    }).compileComponents();
  });

  function createComponent(options?: {
    variant?: 'vertical' | 'horizontal' | 'pokemon' | 'responsive';
    imageUrl?: string;
    imageAlt?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    actionText?: string;
    clickable?: boolean;
    elevated?: boolean;
    pokemonNumber?: string;
    types?: PokemonType[];
    isFavorite?: boolean;
  }) {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;

    if (options) {
      if (options.variant) component.variant = options.variant;
      if (options.imageUrl !== undefined) component.imageUrl = options.imageUrl;
      if (options.imageAlt !== undefined) component.imageAlt = options.imageAlt;
      if (options.title !== undefined) component.title = options.title;
      if (options.subtitle !== undefined) component.subtitle = options.subtitle;
      if (options.description !== undefined) component.description = options.description;
      if (options.actionText !== undefined) component.actionText = options.actionText;
      if (options.clickable !== undefined) component.clickable = options.clickable;
      if (options.elevated !== undefined) component.elevated = options.elevated;
      if (options.pokemonNumber !== undefined) component.pokemonNumber = options.pokemonNumber;
      if (options.types !== undefined) component.types = options.types;
      if (options.isFavorite !== undefined) component.isFavorite = options.isFavorite;
    }

    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    beforeEach(() => createComponent());

    it('should have vertical variant by default', () => {
      expect(component.variant).toBe('vertical');
    });

    it('should have empty imageUrl by default', () => {
      expect(component.imageUrl).toBe('');
    });

    it('should have empty title by default', () => {
      expect(component.title).toBe('');
    });

    it('should not be clickable by default', () => {
      expect(component.clickable).toBe(false);
    });

    it('should not be elevated by default', () => {
      expect(component.elevated).toBe(false);
    });

    it('should not be favorite by default', () => {
      expect(component.isFavorite).toBe(false);
    });

    it('should have empty types array by default', () => {
      expect(component.types).toEqual([]);
    });
  });

  describe('cardClasses getter', () => {
    it('should include base card class', () => {
      createComponent();
      expect(component.cardClasses).toContain('card');
    });

    it('should include variant class', () => {
      createComponent({ variant: 'horizontal' });
      expect(component.cardClasses).toContain('card--horizontal');
    });

    it('should include clickable class when clickable', () => {
      createComponent({ clickable: true });
      expect(component.cardClasses).toContain('card--clickable');
    });

    it('should include elevated class when elevated', () => {
      createComponent({ elevated: true });
      expect(component.cardClasses).toContain('card--elevated');
    });

    it('should include has-image class when imageUrl is set', () => {
      createComponent({ imageUrl: 'https://example.com/image.png' });
      expect(component.cardClasses).toContain('card--has-image');
    });

    it('should include favorite class when isFavorite', () => {
      createComponent({ isFavorite: true });
      expect(component.cardClasses).toContain('card--favorite');
    });

    it('should combine multiple classes correctly', () => {
      createComponent({
        variant: 'pokemon',
        clickable: true,
        elevated: true,
        imageUrl: 'img.png',
        isFavorite: true
      });
      const classes = component.cardClasses;
      expect(classes).toContain('card');
      expect(classes).toContain('card--pokemon');
      expect(classes).toContain('card--clickable');
      expect(classes).toContain('card--elevated');
      expect(classes).toContain('card--has-image');
      expect(classes).toContain('card--favorite');
    });
  });

  describe('click events', () => {
    it('should emit cardClick when clickable card is clicked', () => {
      createComponent({ clickable: true });
      const clickSpy = vi.spyOn(component.cardClick, 'emit');

      component.onCardClick();

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should not emit cardClick when non-clickable card is clicked', () => {
      createComponent({ clickable: false });
      const clickSpy = vi.spyOn(component.cardClick, 'emit');

      component.onCardClick();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should emit actionClick and stop propagation when action is clicked', () => {
      createComponent({ actionText: 'Ver más' });
      const actionSpy = vi.spyOn(component.actionClick, 'emit');
      const event = new Event('click');
      const stopSpy = vi.spyOn(event, 'stopPropagation');

      component.onActionClick(event);

      expect(actionSpy).toHaveBeenCalled();
      expect(stopSpy).toHaveBeenCalled();
    });

    it('should emit favoriteClick and stop propagation when favorite is clicked', () => {
      createComponent({ variant: 'pokemon' });
      const favoriteSpy = vi.spyOn(component.favoriteClick, 'emit');

      // Create a mock button element
      const mockButton = document.createElement('button');
      const event = {
        stopPropagation: vi.fn(),
        currentTarget: mockButton
      } as unknown as Event;

      component.onFavoriteClick(event);

      expect(favoriteSpy).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('variant classes', () => {
    const variants = ['vertical', 'horizontal', 'pokemon', 'responsive'] as const;

    variants.forEach(variant => {
      it(`should apply ${variant} variant class`, () => {
        createComponent({ variant });
        expect(component.cardClasses).toContain(`card--${variant}`);
      });
    });
  });

  describe('pokemon variant rendering', () => {
    const mockTypes: PokemonType[] = [
      { name: 'Fire', color: '#F08030' },
      { name: 'Flying', color: '#A890F0' }
    ];

    it('should render pokemon variant with article element', () => {
      createComponent({
        variant: 'pokemon',
        title: 'Charizard',
        pokemonNumber: '006',
        types: mockTypes
      });
      const article = fixture.nativeElement.querySelector('article');
      expect(article).toBeTruthy();
    });

    it('should render watermark with pokemon number', () => {
      createComponent({
        variant: 'pokemon',
        pokemonNumber: '025'
      });
      const watermark = fixture.nativeElement.querySelector('.card__watermark');
      expect(watermark).toBeTruthy();
      expect(watermark.textContent).toContain('#025');
    });

    it('should render favorite button', () => {
      createComponent({
        variant: 'pokemon'
      });
      const favBtn = fixture.nativeElement.querySelector('.card__favorite-btn');
      expect(favBtn).toBeTruthy();
    });

    it('should apply active class to favorite button when isFavorite', () => {
      createComponent({
        variant: 'pokemon',
        isFavorite: true
      });
      const favBtn = fixture.nativeElement.querySelector('.card__favorite-btn');
      expect(favBtn.classList.contains('card__favorite-btn--active')).toBe(true);
    });

    it('should render pokemon image when imageUrl is provided', () => {
      createComponent({
        variant: 'pokemon',
        imageUrl: 'https://example.com/pikachu.png',
        imageAlt: 'Pikachu'
      });
      const img = fixture.nativeElement.querySelector('.card__pokemon-image img');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('https://example.com/pikachu.png');
      expect(img.getAttribute('alt')).toBe('Pikachu');
    });

    it('should render pokemon name', () => {
      createComponent({
        variant: 'pokemon',
        title: 'Pikachu'
      });
      const name = fixture.nativeElement.querySelector('.card__pokemon-name');
      expect(name).toBeTruthy();
      expect(name.textContent).toBe('Pikachu');
    });

    it('should render type badges', () => {
      createComponent({
        variant: 'pokemon',
        types: mockTypes
      });
      const badges = fixture.nativeElement.querySelectorAll('.card__type-badge');
      expect(badges.length).toBe(2);
      expect(badges[0].textContent).toContain('Fire');
      expect(badges[1].textContent).toContain('Flying');
    });

    it('should apply type color to badges', () => {
      createComponent({
        variant: 'pokemon',
        types: [{ name: 'Fire', color: '#F08030' }]
      });
      const badge = fixture.nativeElement.querySelector('.card__type-badge');
      expect(badge.style.backgroundColor).toBe('rgb(240, 128, 48)');
    });

    it('should render action button when actionText is provided', () => {
      createComponent({
        variant: 'pokemon',
        actionText: 'Ver detalles'
      });
      const actionBtn = fixture.nativeElement.querySelector('.card__pokemon-action');
      expect(actionBtn).toBeTruthy();
      expect(actionBtn.textContent).toContain('Ver detalles');
    });
  });

  describe('vertical variant rendering', () => {
    it('should render image when imageUrl is provided', () => {
      createComponent({
        variant: 'vertical',
        imageUrl: 'https://example.com/image.png'
      });
      const img = fixture.nativeElement.querySelector('.card__image');
      expect(img).toBeTruthy();
    });

    it('should render title in header', () => {
      createComponent({
        variant: 'vertical',
        title: 'Card Title'
      });
      const title = fixture.nativeElement.querySelector('.card__title');
      expect(title).toBeTruthy();
      expect(title.textContent).toBe('Card Title');
    });

    it('should render subtitle', () => {
      createComponent({
        variant: 'vertical',
        title: 'Card Title',
        subtitle: 'Card Subtitle'
      });
      const subtitle = fixture.nativeElement.querySelector('.card__subtitle');
      expect(subtitle).toBeTruthy();
      expect(subtitle.textContent).toBe('Card Subtitle');
    });

    it('should render description', () => {
      createComponent({
        variant: 'vertical',
        description: 'This is a card description'
      });
      const desc = fixture.nativeElement.querySelector('.card__description');
      expect(desc).toBeTruthy();
      expect(desc.textContent).toBe('This is a card description');
    });

    it('should render action button in footer', () => {
      createComponent({
        variant: 'vertical',
        actionText: 'Learn More'
      });
      const action = fixture.nativeElement.querySelector('.card__action');
      expect(action).toBeTruthy();
      expect(action.textContent).toContain('Learn More');
    });
  });

  describe('accessibility', () => {
    it('should have role="button" when clickable', () => {
      createComponent({ clickable: true });
      const article = fixture.nativeElement.querySelector('article');
      expect(article.getAttribute('role')).toBe('button');
    });

    it('should not have role when not clickable', () => {
      createComponent({ clickable: false });
      const article = fixture.nativeElement.querySelector('article');
      expect(article.getAttribute('role')).toBeNull();
    });

    it('should have tabindex="0" when clickable', () => {
      createComponent({ clickable: true });
      const article = fixture.nativeElement.querySelector('article');
      expect(article.getAttribute('tabindex')).toBe('0');
    });

    it('should not have tabindex when not clickable', () => {
      createComponent({ clickable: false });
      const article = fixture.nativeElement.querySelector('article');
      expect(article.getAttribute('tabindex')).toBeNull();
    });

    it('should have correct aria-label on favorite button when not favorite', () => {
      createComponent({ variant: 'pokemon', isFavorite: false });
      const favBtn = fixture.nativeElement.querySelector('.card__favorite-btn');
      expect(favBtn.getAttribute('aria-label')).toBe('Añadir a favoritos');
    });

    it('should have correct aria-label on favorite button when favorite', () => {
      createComponent({ variant: 'pokemon', isFavorite: true });
      const favBtn = fixture.nativeElement.querySelector('.card__favorite-btn');
      expect(favBtn.getAttribute('aria-label')).toBe('Quitar de favoritos');
    });

    it('should have aria-pressed on favorite button', () => {
      createComponent({ variant: 'pokemon', isFavorite: true });
      const favBtn = fixture.nativeElement.querySelector('.card__favorite-btn');
      expect(favBtn.getAttribute('aria-pressed')).toBe('true');
    });

    it('should have lazy loading on images', () => {
      createComponent({
        variant: 'vertical',
        imageUrl: 'https://example.com/image.png'
      });
      const img = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('loading')).toBe('lazy');
    });
  });

  describe('image alt text', () => {
    it('should use imageAlt when provided', () => {
      createComponent({
        variant: 'vertical',
        imageUrl: 'https://example.com/image.png',
        imageAlt: 'Custom Alt Text',
        title: 'Card Title'
      });
      const img = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('alt')).toBe('Custom Alt Text');
    });

    it('should fallback to title when imageAlt is empty', () => {
      createComponent({
        variant: 'vertical',
        imageUrl: 'https://example.com/image.png',
        imageAlt: '',
        title: 'Card Title'
      });
      const img = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('alt')).toBe('Card Title');
    });
  });
});
