import { Component, Input } from '@angular/core';

/**
 * TabPanelComponent - Panel de contenido para una pestaña
 *
 * Uso:
 * <app-tabs [tabs]="tabs" [activeTabId]="activeTab" (tabChange)="activeTab = $event">
 *   <app-tab-panel id="stats" [active]="activeTab === 'stats'">
 *     Contenido de estadísticas
 *   </app-tab-panel>
 *   <app-tab-panel id="moves" [active]="activeTab === 'moves'">
 *     Contenido de movimientos
 *   </app-tab-panel>
 * </app-tabs>
 */
@Component({
  selector: 'app-tab-panel',
  standalone: true,
  template: `
    @if (active) {
      <div
        class="tabs-panel tabs-panel--active"
        role="tabpanel"
        [id]="'panel-' + id"
        [attr.aria-labelledby]="'tab-' + id">
        <ng-content></ng-content>
      </div>
    }
  `,
  styles: [`
    .tabs-panel {
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class TabPanelComponent {
  /** ID del panel (debe coincidir con el id del tab) */
  @Input() id: string = '';

  /** ¿Está activo este panel? */
  @Input() active: boolean = false;
}
