import { Injectable, inject } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { SupabaseService } from '../../../core/supabase/supabase.service';
import {
  ProfessionalExperience,
  ProfessionalExperienceRow,
} from './professional-experience.model';
import { rowToExperience } from './experience-form.mapper';

export interface ExperienceSaveResult {
  readonly ok: boolean;
  readonly message: string;
  readonly experience?: ProfessionalExperience;
}

@Injectable({
  providedIn: 'root',
})
export class ProfessionalExperienceService {
  private readonly authService = inject(AuthService);
  private readonly supabase = inject(SupabaseService);

  async listExperiences(): Promise<ProfessionalExperience[]> {
    const userId = this.authService.currentUser()?.id;

    if (!userId || !this.supabase.isConfigured()) {
      return [];
    }

    const { data, error } = await this.supabase.client
      .from('experiences')
      .select(
        'id,user_id,company,role,location,start_date,end_date,is_current,activities,tools,achievements,generated_bullets',
      )
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) => rowToExperience(row as ProfessionalExperienceRow));
  }

  async saveExperience(experience: ProfessionalExperience): Promise<ExperienceSaveResult> {
    if (!this.supabase.isConfigured()) {
      return {
        ok: true,
        message: 'Experiencia salva em modo mock.',
        experience: {
          ...experience,
          id: experience.id ?? 'mock-experience',
        },
      };
    }

    const payload = {
      user_id: experience.userId,
      company: experience.company,
      role: experience.role,
      location: experience.location || null,
      start_date: experience.startDate || null,
      end_date: experience.isCurrent ? null : experience.endDate || null,
      is_current: experience.isCurrent,
      activities: experience.activities,
      tools: experience.tools,
      achievements: experience.achievements,
      generated_bullets: experience.generatedBullets,
    };

    const query = experience.id
      ? this.supabase.client.from('experiences').update(payload).eq('id', experience.id)
      : this.supabase.client.from('experiences').insert(payload);

    const { data, error } = await query
      .select(
        'id,user_id,company,role,location,start_date,end_date,is_current,activities,tools,achievements,generated_bullets',
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
      message: 'Experiencia profissional salva com sucesso.',
      experience: rowToExperience(data as ProfessionalExperienceRow),
    };
  }

  async deleteExperience(experienceId: string): Promise<ExperienceSaveResult> {
    if (!this.supabase.isConfigured()) {
      return {
        ok: true,
        message: 'Experiencia removida em modo mock.',
      };
    }

    const { error } = await this.supabase.client.from('experiences').delete().eq('id', experienceId);

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: true,
      message: 'Experiencia removida com sucesso.',
    };
  }
}
