import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamBuilderService } from '../../../services/team-builder.service';
import { CommunicationService } from '../../../services/communication.service';
import { ToastService } from '../../../services/toast.service';
import { TrainerFormComponent } from './components/trainer-form/trainer-form';
import { TeamRosterComponent } from './components/team-roster/team-roster';
import { TeamStatsComponent } from './components/team-stats/team-stats';

@Component({
  selector: 'app-team-builder',
  standalone: true,
  imports: [
    CommonModule,
    TrainerFormComponent,
    TeamRosterComponent,
    TeamStatsComponent
  ],
  templateUrl: './team-builder.html',
  styleUrls: ['./team-builder.scss']
})
export class TeamBuilderComponent {
  private teamService = inject(TeamBuilderService);
  private communicationService = inject(CommunicationService);
  private toastService = inject(ToastService);

  // Tabs interactivas
  activeTab: 'entrenador' | 'equipo' | 'estadisticas' = 'entrenador';
  tabs: { id: 'entrenador' | 'equipo' | 'estadisticas'; label: string; icon: string }[] = [
    { id: 'entrenador', label: 'Entrenador', icon: '' },
    { id: 'equipo', label: 'Equipo', icon: '' },
    { id: 'estadisticas', label: 'Estadísticas', icon: '' }
  ];

  constructor() {
    // Suscribirse a notificaciones del servicio para mostrar toasts
    this.teamService.teamNotification$.subscribe(msg => {
      if (msg) {
        this.toastService.info(msg);
      }
    });

    // Compartir datos con CommunicationService para componentes externos
    this.teamService.teamMembers$.subscribe(members => {
      this.communicationService.setSharedData({
        type: 'team-builder',
        teamSize: members.length,
        isComplete: members.length === 6
      });
    });
  }

  /**
   * Seleccionar tab con click
   */
  selectTab(tabId: 'entrenador' | 'equipo' | 'estadisticas'): void {
    this.activeTab = tabId;
  }

  /**
   * Navegación por teclado en las tabs
   * Arrow Left/Right para cambiar de tab
   * Home/End para ir a primera/última tab
   */
  onTabKeydown(event: KeyboardEvent, index: number): void {
    const tabCount = this.tabs.length;
    let newIndex = index;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        newIndex = (index + 1) % tabCount;
        break;
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = (index - 1 + tabCount) % tabCount;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = tabCount - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectTab(this.tabs[index].id);
        return;
      default:
        return;
    }

    this.selectTab(this.tabs[newIndex].id);

    // Mover foco al nuevo tab
    const tabElements = document.querySelectorAll('.team-builder__tab');
    (tabElements[newIndex] as HTMLElement)?.focus();
  }
}
