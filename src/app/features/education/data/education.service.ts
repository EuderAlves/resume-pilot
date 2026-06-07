import { Injectable, inject } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { SupabaseService } from '../../../core/supabase/supabase.service';
import { EducationRecord, EducationRow } from './education.model';
import { rowToEducation } from './education-form.mapper';

export interface EducationSaveResult {
  readonly ok: boolean;
  readonly message: string;
  readonly education?: EducationRecord;
}

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  private readonly authService = inject(AuthService);
  private readonly supabase = inject(SupabaseService);

  async listEducation(): Promise<EducationRecord[]> {
    const userId = this.authService.currentUser()?.id;

    if (!userId || !this.supabase.isConfigured()) {
      return [];
    }

    const { data, error } = await this.supabase.client
      .from('education')
      .select('id,user_id,course,institution,start_date,end_date,description')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) => rowToEducation(row as EducationRow));
  }

  async saveEducation(education: EducationRecord): Promise<EducationSaveResult> {
    if (!this.supabase.isConfigured()) {
      return {
        ok: true,
        message: 'Formacao salva em modo mock.',
        education: {
          ...education,
          id: education.id ?? 'mock-education',
        },
      };
    }

    const payload = {
      user_id: education.userId,
      course: education.course,
      institution: education.institution,
      start_date: education.startDate || null,
      end_date: education.endDate || null,
      description: education.description || null,
    };

    const query = education.id
      ? this.supabase.client.from('education').update(payload).eq('id', education.id)
      : this.supabase.client.from('education').insert(payload);

    const { data, error } = await query
      .select('id,user_id,course,institution,start_date,end_date,description')
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: true,
      message: 'Formacao salva com sucesso.',
      education: rowToEducation(data as EducationRow),
    };
  }

  async deleteEducation(educationId: string): Promise<EducationSaveResult> {
    if (!this.supabase.isConfigured()) {
      return {
        ok: true,
        message: 'Formacao removida em modo mock.',
      };
    }

    const { error } = await this.supabase.client.from('education').delete().eq('id', educationId);

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: true,
      message: 'Formacao removida com sucesso.',
    };
  }
}
