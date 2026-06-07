import { Injectable, inject } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { SupabaseService } from '../../../core/supabase/supabase.service';
import { ProfessionalSkill, SkillRow } from './professional-skill.model';
import { rowToSkill } from './skill-form.mapper';

export interface SkillSaveResult {
  readonly ok: boolean;
  readonly message: string;
  readonly skill?: ProfessionalSkill;
}

@Injectable({
  providedIn: 'root',
})
export class ProfessionalSkillService {
  private readonly authService = inject(AuthService);
  private readonly supabase = inject(SupabaseService);

  async listSkills(): Promise<ProfessionalSkill[]> {
    const userId = this.authService.currentUser()?.id;

    if (!userId || !this.supabase.isConfigured()) {
      return [];
    }

    const { data, error } = await this.supabase.client
      .from('skills')
      .select('id,user_id,name,category,level,evidence')
      .eq('user_id', userId)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) => rowToSkill(row as SkillRow));
  }

  async saveSkill(skill: ProfessionalSkill): Promise<SkillSaveResult> {
    if (!this.supabase.isConfigured()) {
      return {
        ok: true,
        message: 'Skill salva em modo mock.',
        skill: {
          ...skill,
          id: skill.id ?? 'mock-skill',
        },
      };
    }

    const payload = {
      user_id: skill.userId,
      name: skill.name,
      category: skill.category,
      level: skill.level || null,
      evidence: skill.evidence || null,
    };

    const query = skill.id
      ? this.supabase.client.from('skills').update(payload).eq('id', skill.id)
      : this.supabase.client.from('skills').upsert(payload, { onConflict: 'user_id,name' });

    const { data, error } = await query.select('id,user_id,name,category,level,evidence').single();

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: true,
      message: 'Skill salva com sucesso.',
      skill: rowToSkill(data as SkillRow),
    };
  }

  async deleteSkill(skillId: string): Promise<SkillSaveResult> {
    if (!this.supabase.isConfigured()) {
      return {
        ok: true,
        message: 'Skill removida em modo mock.',
      };
    }

    const { error } = await this.supabase.client.from('skills').delete().eq('id', skillId);

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: true,
      message: 'Skill removida com sucesso.',
    };
  }
}
