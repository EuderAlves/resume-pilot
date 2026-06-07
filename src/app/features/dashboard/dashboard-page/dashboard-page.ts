import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LucideBriefcaseBusiness,
  LucideBrainCircuit,
  LucideChartColumnIncreasing,
  LucideClipboardCheck,
  LucideFileText,
  LucideGlobe,
  LucideGraduationCap,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideSparkles,
  LucideTarget,
  LucideUserRoundPen,
} from '@lucide/angular';

import { AuthService } from '../../../core/auth/auth.service';
import { dashboardMetrics, nextActions, pipelineColumns } from '../../../core/data/product-content';
import { DashboardDataService } from '../data/dashboard-data.service';

@Component({
  selector: 'rp-dashboard-page',
  imports: [
    RouterLink,
    LucideBriefcaseBusiness,
    LucideBrainCircuit,
    LucideChartColumnIncreasing,
    LucideClipboardCheck,
    LucideFileText,
    LucideGlobe,
    LucideGraduationCap,
    LucideLayoutDashboard,
    LucideLogOut,
    LucideSparkles,
    LucideTarget,
    LucideUserRoundPen,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dashboardDataService = inject(DashboardDataService);
  private readonly router = inject(Router);

  protected readonly user = this.authService.currentUser;
  protected readonly dashboardMetrics = signal(dashboardMetrics);
  protected readonly pipelineColumns = signal(pipelineColumns);
  protected readonly nextActions = nextActions;
  protected readonly dashboardError = signal('');

  async ngOnInit(): Promise<void> {
    try {
      const snapshot = await this.dashboardDataService.getSnapshot();

      if (snapshot) {
        this.dashboardMetrics.set(snapshot.metrics);
        this.pipelineColumns.set(snapshot.pipeline);
      }
    } catch (error) {
      this.dashboardError.set(
        error instanceof Error ? error.message : 'Nao foi possivel carregar metricas reais.',
      );
    }
  }

  protected async signOut(): Promise<void> {
    await this.authService.signOut();
    await this.router.navigateByUrl('/login');
  }
}
