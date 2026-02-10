import { Component, inject, OnDestroy, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Servicios
import {
  TeamBuilderService,
  TeamMember,
  TeamStats,
  TrainerData
} from '../../../../../services/team-builder.service';
import { CommunicationService } from '../../../../../services/communication.service';

@Component({
  selector: 'app-team-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-stats.html',
  styleUrls: ['./team-stats.scss']
})
export class TeamStatsComponent implements OnDestroy {
  private teamService = inject(TeamBuilderService);
  private communicationService = inject(CommunicationService);
  private renderer = inject(Renderer2);

  // @ViewChild para manipulación de barras de stats
  @ViewChild('statsContainer') statsContainer!: ElementRef;

  // Datos reactivos del equipo (suscripción al servicio)
  teamMembers: TeamMember[] = [];
  trainerData: TrainerData | null = null;
  stats: TeamStats = {
    totalHp: 0, totalAttack: 0, totalDefense: 0, totalSpeed: 0,
    avgHp: 0, avgAttack: 0, avgDefense: 0, avgSpeed: 0,
    typeCoverage: [], memberCount: 0
  };

  // Fortalezas y debilidades
  typeEffectiveness: { type: string; strong: string[]; weak: string[] }[] = [];

  // Suscripciones
  private subscriptions: Subscription[] = [];

  constructor() {
    // Suscripción reactiva a los miembros del equipo (comunicación entre hermanos)
    this.subscriptions.push(
      this.teamService.teamMembers$.subscribe(members => {
        this.teamMembers = members;
        this.stats = this.teamService.getTeamStats();
        this.analyzeTeam();
      })
    );

    // Suscripción a datos del entrenador (comunicación entre hermanos)
    this.subscriptions.push(
      this.teamService.trainerData$.subscribe(data => {
        this.trainerData = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Analizar equipo y notificar debilidades vía CommunicationService
   */
  private analyzeTeam(): void {
    if (this.teamMembers.length === 0) {
      this.typeEffectiveness = [];
      return;
    }

    // Calcular cobertura de tipos
    this.typeEffectiveness = this.calculateTypeEffectiveness();

    // Notificar debilidades al resto de componentes vía CommunicationService
    const weaknesses = this.getTeamWeaknesses();
    if (weaknesses.length > 0) {
      this.communicationService.sendNotification(
        `Debilidades del equipo: ${weaknesses.join(', ')}`
      );
    }
  }

  /**
   * Calcular efectividad de tipos del equipo
   */
  private calculateTypeEffectiveness(): { type: string; strong: string[]; weak: string[] }[] {
    const typeChart: Record<string, { strong: string[]; weak: string[] }> = {
      'Normal': { strong: [], weak: ['Lucha'] },
      'Fuego': { strong: ['Planta', 'Hielo', 'Bicho', 'Acero'], weak: ['Agua', 'Tierra', 'Roca'] },
      'Agua': { strong: ['Fuego', 'Tierra', 'Roca'], weak: ['Eléctrico', 'Planta'] },
      'Eléctrico': { strong: ['Agua', 'Volador'], weak: ['Tierra'] },
      'Planta': { strong: ['Agua', 'Tierra', 'Roca'], weak: ['Fuego', 'Hielo', 'Veneno', 'Volador', 'Bicho'] },
      'Hielo': { strong: ['Planta', 'Tierra', 'Volador', 'Dragón'], weak: ['Fuego', 'Lucha', 'Roca', 'Acero'] },
      'Lucha': { strong: ['Normal', 'Hielo', 'Roca', 'Siniestro', 'Acero'], weak: ['Volador', 'Psíquico', 'Hada'] },
      'Veneno': { strong: ['Planta', 'Hada'], weak: ['Tierra', 'Psíquico'] },
      'Tierra': { strong: ['Fuego', 'Eléctrico', 'Veneno', 'Roca', 'Acero'], weak: ['Agua', 'Planta', 'Hielo'] },
      'Volador': { strong: ['Planta', 'Lucha', 'Bicho'], weak: ['Eléctrico', 'Hielo', 'Roca'] },
      'Psíquico': { strong: ['Lucha', 'Veneno'], weak: ['Bicho', 'Fantasma', 'Siniestro'] },
      'Bicho': { strong: ['Planta', 'Psíquico', 'Siniestro'], weak: ['Fuego', 'Volador', 'Roca'] },
      'Roca': { strong: ['Fuego', 'Hielo', 'Volador', 'Bicho'], weak: ['Agua', 'Planta', 'Lucha', 'Tierra', 'Acero'] },
      'Fantasma': { strong: ['Psíquico', 'Fantasma'], weak: ['Fantasma', 'Siniestro'] },
      'Dragón': { strong: ['Dragón'], weak: ['Hielo', 'Dragón', 'Hada'] },
      'Siniestro': { strong: ['Psíquico', 'Fantasma'], weak: ['Lucha', 'Bicho', 'Hada'] },
      'Acero': { strong: ['Hielo', 'Roca', 'Hada'], weak: ['Fuego', 'Lucha', 'Tierra'] },
      'Hada': { strong: ['Lucha', 'Dragón', 'Siniestro'], weak: ['Veneno', 'Acero'] }
    };

    return this.stats.typeCoverage.map(type => ({
      type,
      strong: typeChart[type]?.strong || [],
      weak: typeChart[type]?.weak || []
    }));
  }

  /**
   * Obtener debilidades no cubiertas del equipo
   */
  getTeamWeaknesses(): string[] {
    const allWeaknesses = this.typeEffectiveness.flatMap(t => t.weak);
    const allStrengths = this.typeEffectiveness.flatMap(t => t.strong);
    const uncovered = allWeaknesses.filter(w => !allStrengths.includes(w));
    return [...new Set(uncovered)];
  }

  /**
   * Obtener fortalezas del equipo
   */
  getTeamStrengths(): string[] {
    return [...new Set(this.typeEffectiveness.flatMap(t => t.strong))];
  }

  /**
   * Calcular porcentaje para barras de progreso (máximo base stat = 255)
   */
  getStatPercentage(value: number): number {
    return Math.min(Math.round((value / 255) * 100), 100);
  }

  /**
   * Color de la barra según el valor
   */
  getStatColor(value: number): string {
    if (value >= 100) return 'var(--color-success, #22c55e)';
    if (value >= 70) return 'var(--color-warning, #f59e0b)';
    return 'var(--color-error, #ef4444)';
  }

  /**
   * Color de tipo
   */
  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'Normal': '#A8A77A', 'Fuego': '#EE8130', 'Agua': '#6390F0',
      'Eléctrico': '#F7D02C', 'Planta': '#7AC74C', 'Hielo': '#96D9D6',
      'Lucha': '#C22E28', 'Veneno': '#A33EA1', 'Tierra': '#E2BF65',
      'Volador': '#A98FF3', 'Psíquico': '#F95587', 'Bicho': '#A6B91A',
      'Roca': '#B6A136', 'Fantasma': '#735797', 'Dragón': '#6F35FC',
      'Siniestro': '#705746', 'Acero': '#B7B7CE', 'Hada': '#D685AD'
    };
    return colors[type] || '#888888';
  }
}
