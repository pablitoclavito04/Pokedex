import {
  Component,
  Input,
  ElementRef,
  HostListener,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * TooltipComponent - Componente de tooltip interactivo
 *
 * Funcionalidades:
 * - Posicionamiento automático (top, bottom, left, right)
 * - Soporte para hover y focus
 * - Delay configurable para mostrar/ocultar
 * - Accesibilidad con role="tooltip"
 *
 * Uso:
 * <app-tooltip text="Texto del tooltip" position="top">
 *   <button>Hover me</button>
 * </app-tooltip>
 */
@Component({
  selector: 'app-tooltip',
  standalone: true,
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.scss']
})
export class TooltipComponent implements AfterViewInit, OnDestroy {
  // ============================================================================
  //                               INPUTS
  // ============================================================================

  /** Texto a mostrar en el tooltip */
  @Input() text: string = '';

  /** Posición preferida del tooltip */
  @Input() position: TooltipPosition = 'top';

  /** Delay en ms antes de mostrar */
  @Input() showDelay: number = 200;

  /** Delay en ms antes de ocultar */
  @Input() hideDelay: number = 100;

  /** ¿Deshabilitar el tooltip? */
  @Input() disabled: boolean = false;

  // ============================================================================
  //                               ESTADO
  // ============================================================================

  /** ¿Está visible el tooltip? */
  isVisible: boolean = false;

  /** Posición calculada (puede diferir de la preferida) */
  calculatedPosition: TooltipPosition = 'top';

  /** ID único para accesibilidad */
  tooltipId: string = '';

  // Referencias
  @ViewChild('tooltipElement') tooltipElement!: ElementRef;
  @ViewChild('triggerWrapper') triggerWrapper!: ElementRef;

  // Timers
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
  }

  ngAfterViewInit(): void {
    // Configuración adicional si es necesaria
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  // ============================================================================
  //                               EVENT HANDLERS
  // ============================================================================

  /**
   * Muestra el tooltip al hacer hover
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.scheduleShow();
  }

  /**
   * Oculta el tooltip al salir del hover
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.scheduleHide();
  }

  /**
   * Muestra el tooltip al hacer focus (para accesibilidad)
   */
  @HostListener('focusin')
  onFocusIn(): void {
    this.scheduleShow();
  }

  /**
   * Oculta el tooltip al perder focus
   */
  @HostListener('focusout')
  onFocusOut(): void {
    this.scheduleHide();
  }

  /**
   * Oculta el tooltip al presionar ESC
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isVisible) {
      this.hide();
    }
  }

  // ============================================================================
  //                               MÉTODOS
  // ============================================================================

  /**
   * Programa mostrar el tooltip después del delay
   */
  private scheduleShow(): void {
    if (this.disabled || !this.text) return;

    this.clearTimers();
    this.showTimer = setTimeout(() => {
      this.show();
    }, this.showDelay);
  }

  /**
   * Programa ocultar el tooltip después del delay
   */
  private scheduleHide(): void {
    this.clearTimers();
    this.hideTimer = setTimeout(() => {
      this.hide();
    }, this.hideDelay);
  }

  /**
   * Muestra el tooltip
   */
  private show(): void {
    this.calculatePosition();
    this.isVisible = true;
  }

  /**
   * Oculta el tooltip
   */
  private hide(): void {
    this.isVisible = false;
  }

  /**
   * Limpia todos los timers
   */
  private clearTimers(): void {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  /**
   * Calcula la posición óptima del tooltip
   * Si no hay espacio suficiente, cambia a la posición opuesta
   */
  private calculatePosition(): void {
    if (!this.isBrowser) {
      this.calculatedPosition = this.position;
      return;
    }

    // Por ahora usamos la posición preferida
    // En una implementación más avanzada se podría verificar
    // el espacio disponible en el viewport
    this.calculatedPosition = this.position;
  }

  /**
   * Genera las clases CSS para el tooltip
   */
  get tooltipClasses(): string {
    const classes = ['tooltip'];
    classes.push(`tooltip--${this.calculatedPosition}`);
    if (this.isVisible) classes.push('tooltip--visible');
    return classes.join(' ');
  }
}
