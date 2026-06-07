import { Injectable, inject } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { SupabaseService } from '../../../core/supabase/supabase.service';
import { LinkedinAudit, LinkedinAuditRow } from './linkedin-audit.model';
import { rowToLinkedinAudit } from './linkedin-audit.mapper';

export interface LinkedinAuditSaveResult {
  readonly ok: boolean;
  readonly message: string;
  readonly audit?: LinkedinAudit;
}

@Injectable({
  providedIn: 'root',
})
export class LinkedinAuditService {
  private readonly authService = inject(AuthService);
  private readonly supabase = inject(SupabaseService);

  async listAudits(): Promise<LinkedinAudit[]> {
    const userId = this.authService.currentUser()?.id;

    if (!userId || !this.supabase.isConfigured()) {
      return [];
    }

    const { data, error } = await this.supabase.client
      .from('linkedin_audits')
      .select(
        'id,user_id,profile_url,headline_score,about_score,experience_score,skills_score,total_score,suggestions,created_at',
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) => rowToLinkedinAudit(row as LinkedinAuditRow));
  }

  async saveAudit(audit: LinkedinAudit): Promise<LinkedinAuditSaveResult> {
    if (!this.supabase.isConfigured()) {
      return {
        ok: true,
        message: 'Auditoria salva em modo mock.',
        audit: {
          ...audit,
          id: audit.id ?? 'mock-linkedin-audit',
        },
      };
    }

    const { data, error } = await this.supabase.client
      .from('linkedin_audits')
      .insert({
        user_id: audit.userId,
        profile_url: audit.profileUrl || null,
        headline_score: audit.headlineScore,
        about_score: audit.aboutScore,
        experience_score: audit.experienceScore,
        skills_score: audit.skillsScore,
        total_score: audit.totalScore,
        suggestions: audit.suggestions,
      })
      .select(
        'id,user_id,profile_url,headline_score,about_score,experience_score,skills_score,total_score,suggestions,created_at',
      )
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: true,
      message: 'Auditoria de LinkedIn salva com sucesso.',
      audit: rowToLinkedinAudit(data as LinkedinAuditRow),
    };
  }
}
