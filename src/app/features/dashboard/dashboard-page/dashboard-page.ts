import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LucideBriefcaseBusiness,
  LucideChartColumnIncreasing,
  LucideFileText,
  LucideGlobe,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideSparkles,
  LucideTarget,
  LucideUserRoundPen,
} from '@lucide/angular';

import { AuthService } from '../../../core/auth/auth.service';
import { dashboardMetrics, nextActions, pipelineColumns } from '../../../core/data/product-content';

@Component({
  selector: 'rp-dashboard-page',
  imports: [
    RouterLink,
    LucideBriefcaseBusiness,
    LucideChartColumnIncreasing,
    LucideFileText,
    LucideGlobe,
    LucideLayoutDashboard,
    LucideLogOut,
    LucideSparkles,
    LucideTarget,
    LucideUserRoundPen,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.authService.currentUser;
  protected readonly dashboardMetrics = dashboardMetrics;
  protected readonly pipelineColumns = pipelineColumns;
  protected readonly nextActions = nextActions;

  protected async signOut(): Promise<void> {
    await this.authService.signOut();
    await this.router.navigateByUrl('/login');
  }
}
