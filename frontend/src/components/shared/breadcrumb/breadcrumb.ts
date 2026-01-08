// ============================================================================
//          BREADCRUMB COMPONENT - Componente de migas de pan
// ============================================================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbService, Breadcrumb } from '../../../app/services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss'
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [];
  private subscription?: Subscription;

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.subscription = this.breadcrumbService.breadcrumbs$.subscribe(
      breadcrumbs => this.breadcrumbs = breadcrumbs
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
