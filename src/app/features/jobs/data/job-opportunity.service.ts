import { Injectable, inject } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { SupabaseService } from '../../../core/supabase/supabase.service';
import { JobOpportunity, JobRow } from './job-opportunity.model';
import { rowToJob } from './job-form.mapper';

export interface JobSaveResult {
  readonly ok: boolean;
  readonly message: string;
  readonly job?: JobOpportunity;
}

@Injectable({
  providedIn: 'root',
})
export class JobOpportunityService {
  private readonly authService = inject(AuthService);
  private readonly supabase = inject(SupabaseService);

  async listJobs(): Promise<JobOpportunity[]> {
    const userId = this.authService.currentUser()?.id;

    if (!userId || !this.supabase.isConfigured()) {
      return [];
    }

    const { data, error } = await this.supabase.client
      .from('jobs')
      .select(
        'id,user_id,title,company,location,country,source_url,source,description,language_requirements,required_skills,desired_skills,seniority,work_model,visa_signal,salary,fit_score,analysis',
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) => rowToJob(row as JobRow));
  }

  async listCurrentSkillNames(): Promise<string[]> {
    const userId = this.authService.currentUser()?.id;

    if (!userId || !this.supabase.isConfigured()) {
      return [];
    }

    const { data, error } = await this.supabase.client
      .from('skills')
      .select('name')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) => String(row.name));
  }

  async saveJob(job: JobOpportunity): Promise<JobSaveResult> {
    if (!this.supabase.isConfigured()) {
      return {
        ok: true,
        message: 'Vaga salva em modo mock.',
        job: {
          ...job,
          id: job.id ?? 'mock-job',
        },
      };
    }

    const payload = {
      user_id: job.userId,
      title: job.title,
      company: job.company || null,
      location: job.location || null,
      country: job.country || null,
      source_url: job.sourceUrl || null,
      source: job.source,
      description: job.description,
      language_requirements: job.languageRequirements,
      required_skills: job.requiredSkills,
      desired_skills: job.desiredSkills,
      seniority: job.seniority || null,
      work_model: job.workModel || null,
      visa_signal: job.visaSignal || null,
      salary: job.salary || null,
      fit_score: job.fitScore,
      analysis: job.analysis,
    };

    const query = job.id
      ? this.supabase.client.from('jobs').update(payload).eq('id', job.id)
      : this.supabase.client.from('jobs').insert(payload);

    const { data, error } = await query
      .select(
        'id,user_id,title,company,location,country,source_url,source,description,language_requirements,required_skills,desired_skills,seniority,work_model,visa_signal,salary,fit_score,analysis',
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
      message: 'Vaga salva com sucesso.',
      job: rowToJob(data as JobRow),
    };
  }

  async deleteJob(jobId: string): Promise<JobSaveResult> {
    if (!this.supabase.isConfigured()) {
      return {
        ok: true,
        message: 'Vaga removida em modo mock.',
      };
    }

    const { error } = await this.supabase.client.from('jobs').delete().eq('id', jobId);

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: true,
      message: 'Vaga removida com sucesso.',
    };
  }
}
