import { Injectable, inject } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { SupabaseService } from '../../../core/supabase/supabase.service';
import { ProfessionalProfile, ProfessionalProfileRow } from './professional-profile.model';
import { rowToProfile } from './profile-form.mapper';

export interface ProfileSaveResult {
  readonly ok: boolean;
  readonly message: string;
  readonly profile?: ProfessionalProfile;
}

@Injectable({
  providedIn: 'root',
})
export class ProfessionalProfileService {
  private readonly authService = inject(AuthService);
  private readonly supabase = inject(SupabaseService);

  async getCurrentProfile(): Promise<ProfessionalProfile | null> {
    const userId = this.authService.currentUser()?.id;

    if (!userId || !this.supabase.isConfigured()) {
      return null;
    }

    const { data, error } = await this.supabase.client
      .from('professional_profiles')
      .select(
        'id,user_id,full_name,headline,target_role,target_seniority,target_countries,location,relocation_goal,languages,summary',
      )
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? rowToProfile(data as ProfessionalProfileRow) : null;
  }

  async saveProfile(profile: Omit<ProfessionalProfile, 'id'>): Promise<ProfileSaveResult> {
    if (!this.supabase.isConfigured()) {
      return {
        ok: true,
        message: 'Perfil salvo em modo mock. Configure o Supabase para persistir dados reais.',
        profile: {
          ...profile,
          id: 'mock-profile',
        },
      };
    }

    const { data, error } = await this.supabase.client
      .from('professional_profiles')
      .upsert(
        {
          user_id: profile.userId,
          full_name: profile.fullName,
          headline: profile.headline,
          target_role: profile.targetRole,
          target_seniority: profile.targetSeniority,
          target_countries: profile.targetCountries,
          location: profile.location,
          relocation_goal: profile.relocationGoal,
          languages: profile.languages,
          summary: profile.summary,
        },
        {
          onConflict: 'user_id',
        },
      )
      .select(
        'id,user_id,full_name,headline,target_role,target_seniority,target_countries,location,relocation_goal,languages,summary',
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
      message: 'Perfil profissional salvo com sucesso.',
      profile: rowToProfile(data as ProfessionalProfileRow),
    };
  }
}
