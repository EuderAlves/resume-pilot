import { Injectable, inject } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { DashboardMetric, PipelineColumn } from '../../../core/data/product-content';
import { SupabaseService } from '../../../core/supabase/supabase.service';

export interface DashboardSnapshot {
  readonly metrics: readonly DashboardMetric[];
  readonly pipeline: readonly PipelineColumn[];
}

type ApplicationStatusCount = Record<string, number>;

@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {
  private readonly authService = inject(AuthService);
  private readonly supabase = inject(SupabaseService);

  async getSnapshot(): Promise<DashboardSnapshot | null> {
    const userId = this.authService.currentUser()?.id;

    if (!userId || !this.supabase.isConfigured()) {
      return null;
    }

    const [jobs, applications, cvVersions, audits] = await Promise.all([
      this.fetchRows('jobs', 'fit_score', userId),
      this.fetchRows('applications', 'status', userId),
      this.fetchRows('cv_versions', 'id', userId),
      this.fetchRows('linkedin_audits', 'total_score', userId),
    ]);
    const averageFit = averageNumber(jobs.map((row) => row['fit_score']));
    const latestLinkedinScore = Number(audits[0]?.['total_score'] ?? 0);
    const applicationStatusCounts = countByStatus(applications.map((row) => String(row['status'])));
    const activeApplications = applications.filter(
      (row) => !['rejected', 'archived'].includes(String(row['status'])),
    ).length;

    return {
      metrics: [
        {
          label: 'Aderencia media',
          value: averageFit ? `${averageFit}%` : '0%',
          detail: `${jobs.length} vaga${jobs.length === 1 ? '' : 's'} analisada${jobs.length === 1 ? '' : 's'}`,
        },
        {
          label: 'CVs ajustados',
          value: String(cvVersions.length),
          detail: 'Versoes salvas por vaga',
        },
        {
          label: 'Aplicacoes ativas',
          value: String(activeApplications),
          detail: 'Pipeline real de candidaturas',
        },
        {
          label: 'LinkedIn',
          value: latestLinkedinScore ? `${latestLinkedinScore}/100` : '0/100',
          detail: 'Ultima auditoria salva',
        },
      ],
      pipeline: [
        {
          label: 'Salvas',
          count: applicationStatusCounts['saved'] ?? 0,
          tone: 'neutral',
        },
        {
          label: 'CV ajustado',
          count: applicationStatusCounts['cv_tailored'] ?? 0,
          tone: 'warning',
        },
        {
          label: 'Aplicado',
          count: (applicationStatusCounts['applied'] ?? 0) + (applicationStatusCounts['follow_up_sent'] ?? 0),
          tone: 'success',
        },
        {
          label: 'Negado',
          count: applicationStatusCounts['rejected'] ?? 0,
          tone: 'danger',
        },
      ],
    };
  }

  private async fetchRows(
    table: 'jobs' | 'applications' | 'cv_versions' | 'linkedin_audits',
    select: string,
    userId: string,
  ): Promise<Array<Record<string, unknown>>> {
    const { data, error } = await this.supabase.client
      .from(table)
      .select(select)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as unknown as Array<Record<string, unknown>>;
  }
}

function averageNumber(values: readonly unknown[]): number {
  const numbers = values.map(Number).filter((value) => Number.isFinite(value) && value > 0);

  if (numbers.length === 0) {
    return 0;
  }

  return Math.round(numbers.reduce((total, value) => total + value, 0) / numbers.length);
}

function countByStatus(statuses: readonly string[]): ApplicationStatusCount {
  return statuses.reduce<ApplicationStatusCount>((accumulator, status) => {
    accumulator[status] = (accumulator[status] ?? 0) + 1;
    return accumulator;
  }, {});
}
