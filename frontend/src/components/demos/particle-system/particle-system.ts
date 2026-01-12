import { Component, Renderer2, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * COMPONENTE 3: PARTICLE SYSTEM
 * Demuestra creación masiva de elementos con animaciones
 */
@Component({
  selector: 'app-particle-system',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './particle-system.html',
  styleUrls: ['./particle-system.scss']
})
export class ParticleSystemComponent implements AfterViewInit, OnDestroy {

  @ViewChild('particleContainer', { read: ElementRef }) particleContainer!: ElementRef;

  private createdParticles: any[] = [];
  private animationTimeouts: any[] = [];
  particleCount = 0;
  isAnimating = false;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Crear algunas partículas de ejemplo
    this.createParticles(5);
  }

  /**
   * DEMOSTRACIÓN: createElement() masivo + appendChild() + setStyle()
   * Crea múltiples partículas con posiciones y colores aleatorios
   */
  createParticles(count: number = 10): void {
    if (this.isAnimating) return;

    this.isAnimating = true;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.createSingleParticle();
      }, i * 50);
    }

    setTimeout(() => {
      this.isAnimating = false;
    }, count * 50 + 100);
  }

  /**
   * Crea una partícula individual
   */
  private createSingleParticle(): void {
    // 1. Crear elemento div
    const particle = this.renderer.createElement('div');
    this.renderer.addClass(particle, 'particle');

    // 2. Generar propiedades aleatorias
    const size = Math.random() * 30 + 10; // 10-40px
    const x = Math.random() * 100; // 0-100%
    const color = this.getRandomColor();
    const rotation = Math.random() * 360;
    const duration = Math.random() * 2 + 2; // 2-4s

    // 3. Aplicar estilos con Renderer2
    this.renderer.setStyle(particle, 'width', `${size}px`);
    this.renderer.setStyle(particle, 'height', `${size}px`);
    this.renderer.setStyle(particle, 'left', `${x}%`);
    this.renderer.setStyle(particle, 'bottom', '0');
    this.renderer.setStyle(particle, 'background', color);
    this.renderer.setStyle(particle, 'transform', `rotate(${rotation}deg)`);
    this.renderer.setStyle(particle, 'animation', `float ${duration}s ease-out forwards`);

    // 4. Agregar al DOM
    this.renderer.appendChild(this.particleContainer.nativeElement, particle);

    // 5. Guardar referencia
    this.createdParticles.push(particle);
    this.particleCount++;

    // 6. Eliminar después de la animación
    const timeoutId = setTimeout(() => {
      this.removeParticle(particle);
    }, duration * 1000);

    this.animationTimeouts.push(timeoutId);

    console.log(`✓ Partícula creada (${this.particleCount} total)`);
  }

  /**
   * DEMOSTRACIÓN: removeChild()
   * Elimina una partícula del DOM
   */
  private removeParticle(particle: any): void {
    if (particle.parentNode === this.particleContainer.nativeElement) {
      // Eliminar del DOM
      this.renderer.removeChild(this.particleContainer.nativeElement, particle);

      // Eliminar de referencias
      const index = this.createdParticles.indexOf(particle);
      if (index > -1) {
        this.createdParticles.splice(index, 1);
      }

      this.particleCount--;
      console.log(`✓ Partícula eliminada (${this.particleCount} restantes)`);
    }
  }

  /**
   * Genera un color aleatorio
   */
  private getRandomColor(): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Crea una explosión de partículas
   */
  explode(): void {
    this.createParticles(20);
  }

  /**
   * Limpia todas las partículas
   */
  clearAll(): void {
    // Limpiar todos los timeouts
    this.animationTimeouts.forEach(id => clearTimeout(id));
    this.animationTimeouts = [];

    // Eliminar todas las partículas
    this.createdParticles.forEach(particle => {
      if (particle && particle.parentNode) {
        this.renderer.removeChild(particle.parentNode, particle);
      }
    });

    this.createdParticles = [];
    this.particleCount = 0;
    console.log('✓ Todas las partículas eliminadas');
  }

  /**
   * DEMOSTRACIÓN: Limpieza en ngOnDestroy()
   */
  ngOnDestroy(): void {
    console.log('🧹 ParticleSystem: Limpiando partículas y timers...');

    // Limpiar timeouts
    this.animationTimeouts.forEach(id => clearTimeout(id));
    this.animationTimeouts = [];

    // Eliminar partículas
    this.createdParticles.forEach(particle => {
      if (particle && particle.parentNode) {
        this.renderer.removeChild(particle.parentNode, particle);
      }
    });

    this.createdParticles = [];
    console.log('✓ ParticleSystem: Limpieza completada');
  }
}
