import { Injectable, inject } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { SupabaseService } from '../../../core/supabase/supabase.service';
import { ApplicationRecord, ApplicationRow } from './application.model';
import { rowToApplication } from './application-form.mapper';

export interface ApplicationSaveResult {
  readonly ok: boolean;
  readonly message: string;
  readonly application?: ApplicationRecord;
}

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private readonly authService = inject(AuthService);
  private readonly supabase = inject(SupabaseService);

  async listApplications(): Promise<ApplicationRecord[]> {
    const userId = this.authService.currentUser()?.id;

    if (!userId || !this.supabase.isConfigured()) {
      return [];
    }

    const { data, error } = await this.supabase.client
      .from('applications')
      .select('id,user_id,job_id,applied_at,status,follow_up_at,notes,contact_name,contact_url')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) => rowToApplication(row as ApplicationRow));
  }

  async saveApplication(application: ApplicationRecord): Promise<ApplicationSaveResult> {
    if (!this.supabase.isConfigured()) {
      return {
        ok: true,
        message: 'Candidatura salva em modo mock.',
        application: {
          ...application,
          id: application.id ?? 'mock-application',
        },
      };
    }

    const payload = {
      user_id: application.userId,
      job_id: application.jobId || null,
      applied_at: application.appliedAt || null,
      status: application.status,
      follow_up_at: application.followUpAt || null,
      notes: application.notes || null,
      contact_name: application.contactName || null,
      contact_url: application.contactUrl || null,
    };

    const query = application.id
      ? this.supabase.client.from('applications').update(payload).eq('id', application.id)
      : this.supabase.client.from('applications').insert(payload);

    const { data, error } = await query
      .select('id,user_id,job_id,applied_at,status,follow_up_at,notes,contact_name,contact_url')
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: true,
      message: 'Candidatura salva com sucesso.',
      application: rowToApplication(data as ApplicationRow),
    };
  }

  async deleteApplication(applicationId: string): Promise<ApplicationSaveResult> {
    if (!this.supabase.isConfigured()) {
      return {
        ok: true,
        message: 'Candidatura removida em modo mock.',
      };
    }

    const { error } = await this.supabase.client.from('applications').delete().eq('id', applicationId);

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: true,
      message: 'Candidatura removida com sucesso.',
    };
  }
}
