import { Component, Renderer2, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * COMPONENTE 1: DYNAMIC LIST
 * Demuestra creación y eliminación de elementos <li> dinámicamente
 */
@Component({
  selector: 'app-dynamic-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-list.html',
  styleUrls: ['./dynamic-list.scss']
})
export class DynamicListComponent implements AfterViewInit, OnDestroy {

  @ViewChild('listContainer', { read: ElementRef }) listContainer!: ElementRef;

  itemText = '';
  itemCount = 0;
  private createdElements: any[] = [];

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Crear algunos items de ejemplo
    this.addExampleItems();
  }

  /**
   * DEMOSTRACIÓN: createElement() + appendChild()
   * Crea un elemento <li> y lo agrega a la lista
   */
  addItem(): void {
    if (!this.itemText.trim()) {
      alert('Por favor ingresa un texto');
      return;
    }

    // 1. Crear elemento <li>
    const li = this.renderer.createElement('li');
    this.renderer.addClass(li, 'list-item');

    // 2. Crear contenedor de contenido
    const content = this.renderer.createElement('span');
    this.renderer.addClass(content, 'list-item__content');
    const text = this.renderer.createText(this.itemText);
    this.renderer.appendChild(content, text);

    // 3. Crear botón de eliminar
    const deleteBtn = this.renderer.createElement('button');
    this.renderer.addClass(deleteBtn, 'list-item__delete');
    const deleteIcon = this.renderer.createText('🗑️');
    this.renderer.appendChild(deleteBtn, deleteIcon);

    // 4. Agregar event listener
    this.renderer.listen(deleteBtn, 'click', () => {
      this.removeItem(li);
    });

    // 5. Ensamblar
    this.renderer.appendChild(li, content);
    this.renderer.appendChild(li, deleteBtn);

    // 6. Agregar al DOM con animación
    this.renderer.setStyle(li, 'opacity', '0');
    this.renderer.setStyle(li, 'transform', 'translateX(-20px)');
    this.renderer.appendChild(this.listContainer.nativeElement, li);

    setTimeout(() => {
      this.renderer.setStyle(li, 'opacity', '1');
      this.renderer.setStyle(li, 'transform', 'translateX(0)');
    }, 10);

    // 7. Guardar referencia
    this.createdElements.push(li);
    this.itemCount++;
    this.itemText = '';

    console.log('✓ Item creado con Renderer2.createElement()');
  }

  /**
   * DEMOSTRACIÓN: removeChild()
   * Elimina un elemento específico de la lista
   */
  removeItem(li: any): void {
    // Animar salida
    this.renderer.setStyle(li, 'opacity', '0');
    this.renderer.setStyle(li, 'transform', 'translateX(100%)');

    setTimeout(() => {
      // Eliminar del DOM
      this.renderer.removeChild(this.listContainer.nativeElement, li);

      // Eliminar de referencias
      const index = this.createdElements.indexOf(li);
      if (index > -1) {
        this.createdElements.splice(index, 1);
      }

      this.itemCount--;
      console.log('✓ Item eliminado con Renderer2.removeChild()');
    }, 300);
  }

  /**
   * Elimina todos los items
   */
  clearAll(): void {
    const items = [...this.createdElements];
    items.forEach(item => this.removeItem(item));
  }

  /**
   * Agrega items de ejemplo al iniciar
   */
  private addExampleItems(): void {
    const examples = ['Item de ejemplo 1', 'Item de ejemplo 2', 'Item de ejemplo 3'];

    examples.forEach((text, index) => {
      setTimeout(() => {
        this.itemText = text;
        this.addItem();
      }, index * 200);
    });
  }

  /**
   * DEMOSTRACIÓN: Limpieza en ngOnDestroy()
   */
  ngOnDestroy(): void {
    console.log('🧹 DynamicList: Limpiando elementos...');

    this.createdElements.forEach(element => {
      if (element && element.parentNode) {
        this.renderer.removeChild(element.parentNode, element);
      }
    });

    this.createdElements = [];
    console.log('✓ DynamicList: Limpieza completada');
  }
}
