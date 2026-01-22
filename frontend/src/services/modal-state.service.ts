// ============================================================================
//          MODAL STATE SERVICE - Gestión del estado de modales globales
// ============================================================================

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalStateService {
  // Signal para indicar si hay un modal de pantalla completa abierto
  private _isFullscreenModalOpen = signal(false);

  /**
   * Indica si hay un modal de pantalla completa abierto
   */
  get isFullscreenModalOpen() {
    return this._isFullscreenModalOpen.asReadonly();
  }

  /**
   * Abre el modal de pantalla completa
   */
  openFullscreenModal(): void {
    this._isFullscreenModalOpen.set(true);
  }

  /**
   * Cierra el modal de pantalla completa
   */
  closeFullscreenModal(): void {
    this._isFullscreenModalOpen.set(false);
  }
}
