// ============================================================================
//          DOM DEMO - Demostración de Rúbrica 1.3
// ============================================================================

import { Component, Renderer2, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicListComponent } from '../../../components/demos/dynamic-list/dynamic-list';
import { ToastContainerComponent } from '../../../components/demos/toast-container/toast-container';
import { ParticleSystemComponent } from '../../../components/demos/particle-system/particle-system';

/**
 * DEMOSTRACIÓN DE RÚBRICA 1.3: Creación y Eliminación de Elementos del DOM
 *
 * Esta página demuestra:
 * 1. createElement() y appendChild() con Renderer2 en 3+ componentes
 * 2. removeChild() para eliminar elementos
 * 3. Clonación de nodos
 * 4. Gestión correcta del ciclo de vida con ngOnDestroy()
 */
@Component({
  selector: 'app-dom-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicListComponent,
    ToastContainerComponent,
    ParticleSystemComponent
  ],
  templateUrl: './dom-demo.html',
  styleUrls: ['./dom-demo.scss']
})
export class DomDemoComponent implements AfterViewInit, OnDestroy {

  @ViewChild('dynamicContainer', { read: ElementRef }) dynamicContainer!: ElementRef;
  @ViewChild('cloneContainer', { read: ElementRef }) cloneContainer!: ElementRef;

  // Referencias a elementos creados dinámicamente (para limpieza)
  private createdElements: any[] = [];
  private intervalIds: any[] = [];

  // Estado de la UI
  cardTitle = '';
  cardContent = '';
  createdCardsCount = 0;
  clonedCardsCount = 0;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    // Crear algunos elementos de ejemplo al iniciar
    this.createWelcomeMessage();
  }

  // ============================================================================
  // SECCIÓN 1: CREACIÓN DE ELEMENTOS CON createElement() y appendChild()
  // ============================================================================

  /**
   * DEMOSTRACIÓN: createElement() + appendChild() + setAttribute()
   * Crea una tarjeta dinámica con múltiples elementos anidados
   */
  createCard(): void {
    if (!this.cardTitle.trim()) {
      alert('Por favor ingresa un título');
      return;
    }

    // 1. Crear elemento contenedor
    const card = this.renderer.createElement('div');
    this.renderer.addClass(card, 'dynamic-card');

    // 2. Crear header
    const header = this.renderer.createElement('div');
    this.renderer.addClass(header, 'dynamic-card__header');

    // 3. Crear título
    const title = this.renderer.createElement('h3');
    const titleText = this.renderer.createText(this.cardTitle);
    this.renderer.appendChild(title, titleText);
    this.renderer.appendChild(header, title);

    // 4. Crear botón de eliminar
    const deleteBtn = this.renderer.createElement('button');
    this.renderer.addClass(deleteBtn, 'btn-delete');
    const deleteText = this.renderer.createText('×');
    this.renderer.appendChild(deleteBtn, deleteText);

    // 5. Agregar event listener con Renderer2
    this.renderer.listen(deleteBtn, 'click', () => {
      this.removeCard(card);
    });

    this.renderer.appendChild(header, deleteBtn);

    // 6. Crear contenido
    const content = this.renderer.createElement('div');
    this.renderer.addClass(content, 'dynamic-card__content');
    const contentText = this.renderer.createText(this.cardContent || 'Sin contenido');
    this.renderer.appendChild(content, contentText);

    // 7. Crear footer con timestamp
    const footer = this.renderer.createElement('div');
    this.renderer.addClass(footer, 'dynamic-card__footer');
    const timestamp = this.renderer.createText(`Creado: ${new Date().toLocaleTimeString()}`);
    this.renderer.appendChild(footer, timestamp);

    // 8. Ensamblar la tarjeta
    this.renderer.appendChild(card, header);
    this.renderer.appendChild(card, content);
    this.renderer.appendChild(card, footer);

    // 9. Agregar al contenedor con animación
    this.renderer.setStyle(card, 'opacity', '0');
    this.renderer.setStyle(card, 'transform', 'translateY(-20px)');
    this.renderer.appendChild(this.dynamicContainer.nativeElement, card);

    // 10. Animar entrada
    setTimeout(() => {
      this.renderer.setStyle(card, 'opacity', '1');
      this.renderer.setStyle(card, 'transform', 'translateY(0)');
    }, 10);

    // 11. Guardar referencia para limpieza
    this.createdElements.push(card);
    this.createdCardsCount++;

    // 12. Limpiar inputs
    this.cardTitle = '';
    this.cardContent = '';

    console.log('✓ Tarjeta creada con Renderer2.createElement() y appendChild()');
  }

  /**
   * DEMOSTRACIÓN: removeChild()
   * Elimina un elemento específico del DOM
   */
  removeCard(card: any): void {
    // Animar salida
    this.renderer.setStyle(card, 'opacity', '0');
    this.renderer.setStyle(card, 'transform', 'translateX(100px)');

    setTimeout(() => {
      // Eliminar del DOM usando removeChild
      this.renderer.removeChild(this.dynamicContainer.nativeElement, card);

      // Eliminar de la lista de referencias
      const index = this.createdElements.indexOf(card);
      if (index > -1) {
        this.createdElements.splice(index, 1);
      }

      this.createdCardsCount--;
      console.log('✓ Tarjeta eliminada con Renderer2.removeChild()');
    }, 300);
  }

  /**
   * Elimina todas las tarjetas
   */
  clearAllCards(): void {
    // Crear una copia del array para evitar problemas al modificar durante iteración
    const elements = [...this.createdElements];

    elements.forEach(card => {
      this.removeCard(card);
    });
  }

  // ============================================================================
  // SECCIÓN 2: CLONACIÓN DE NODOS
  // ============================================================================

  /**
   * DEMOSTRACIÓN: cloneNode()
   * Clona un nodo existente y lo agrega al DOM
   */
  cloneFirstCard(): void {
    const cards = this.dynamicContainer.nativeElement.children;

    if (cards.length === 0) {
      alert('Primero crea una tarjeta para poder clonarla');
      return;
    }

    const firstCard = cards[0];

    // 1. Clonar el nodo (true = deep clone, incluye hijos)
    const clonedCard = firstCard.cloneNode(true);

    // 2. Modificar el clon para diferenciarlo
    const cloneHeader = clonedCard.querySelector('.dynamic-card__header h3');
    if (cloneHeader) {
      cloneHeader.textContent = `[CLON] ${cloneHeader.textContent}`;
    }

    // 3. Actualizar footer
    const cloneFooter = clonedCard.querySelector('.dynamic-card__footer');
    if (cloneFooter) {
      cloneFooter.textContent = `Clonado: ${new Date().toLocaleTimeString()}`;
    }

    // 4. Agregar clase especial al clon
    this.renderer.addClass(clonedCard, 'cloned-card');

    // 5. Re-agregar event listener al botón de eliminar del clon
    const deleteBtn = clonedCard.querySelector('.btn-delete');
    if (deleteBtn) {
      this.renderer.listen(deleteBtn, 'click', () => {
        this.removeCard(clonedCard);
      });
    }

    // 6. Agregar al contenedor de clones
    this.renderer.appendChild(this.cloneContainer.nativeElement, clonedCard);

    // 7. Guardar referencia
    this.createdElements.push(clonedCard);
    this.clonedCardsCount++;

    console.log('✓ Nodo clonado con cloneNode(true)');
  }

  /**
   * Elimina todas las tarjetas clonadas
   */
  clearClonedCards(): void {
    const clones = this.cloneContainer.nativeElement.children;

    // Convertir a array y eliminar en orden inverso
    Array.from(clones).reverse().forEach((clone: any) => {
      this.renderer.removeChild(this.cloneContainer.nativeElement, clone);

      const index = this.createdElements.indexOf(clone);
      if (index > -1) {
        this.createdElements.splice(index, 1);
      }
    });

    this.clonedCardsCount = 0;
    console.log('✓ Todos los clones eliminados');
  }

  // ============================================================================
  // SECCIÓN 3: ELEMENTOS DE EJEMPLO
  // ============================================================================

  /**
   * Crea un mensaje de bienvenida usando Renderer2
   */
  private createWelcomeMessage(): void {
    const container = this.dynamicContainer.nativeElement;

    // Crear card de bienvenida
    const welcomeCard = this.renderer.createElement('div');
    this.renderer.addClass(welcomeCard, 'dynamic-card');
    this.renderer.addClass(welcomeCard, 'welcome-card');

    const header = this.renderer.createElement('div');
    this.renderer.addClass(header, 'dynamic-card__header');

    const title = this.renderer.createElement('h3');
    const titleText = this.renderer.createText('👋 Bienvenido');
    this.renderer.appendChild(title, titleText);
    this.renderer.appendChild(header, title);

    const content = this.renderer.createElement('div');
    this.renderer.addClass(content, 'dynamic-card__content');
    const contentText = this.renderer.createText('Esta tarjeta fue creada programáticamente con Renderer2');
    this.renderer.appendChild(content, contentText);

    this.renderer.appendChild(welcomeCard, header);
    this.renderer.appendChild(welcomeCard, content);
    this.renderer.appendChild(container, welcomeCard);

    this.createdElements.push(welcomeCard);
    this.createdCardsCount++;
  }

  // ============================================================================
  // LIMPIEZA: ngOnDestroy()
  // ============================================================================

  /**
   * DEMOSTRACIÓN: Gestión correcta del ciclo de vida
   * Limpia todos los elementos creados y listeners cuando el componente se destruye
   */
  ngOnDestroy(): void {
    console.log('🧹 Limpiando elementos creados en ngOnDestroy()...');

    // 1. Limpiar intervalos
    this.intervalIds.forEach(id => clearInterval(id));
    this.intervalIds = [];

    // 2. Eliminar todos los elementos creados
    this.createdElements.forEach(element => {
      if (element && element.parentNode) {
        this.renderer.removeChild(element.parentNode, element);
      }
    });

    // 3. Limpiar referencias
    this.createdElements = [];

    console.log('✓ Limpieza completada');
  }
}
