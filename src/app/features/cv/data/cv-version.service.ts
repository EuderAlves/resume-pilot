import { Injectable, inject } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { SupabaseService } from '../../../core/supabase/supabase.service';
import { CvVersion, CvVersionRow } from './cv-version.model';
import { rowToCvVersion } from './cv-version.mapper';

export interface CvVersionSaveResult {
  readonly ok: boolean;
  readonly message: string;
  readonly version?: CvVersion;
}

@Injectable({
  providedIn: 'root',
})
export class CvVersionService {
  private readonly authService = inject(AuthService);
  private readonly supabase = inject(SupabaseService);

  async listVersions(): Promise<CvVersion[]> {
    const userId = this.authService.currentUser()?.id;

    if (!userId || !this.supabase.isConfigured()) {
      return [];
    }

    const { data, error } = await this.supabase.client
      .from('cv_versions')
      .select('id,user_id,job_id,title,language,content,storage_path,ats_score,created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((row) => rowToCvVersion(row as CvVersionRow));
  }

  async saveVersion(version: CvVersion): Promise<CvVersionSaveResult> {
    if (!this.supabase.isConfigured()) {
      return {
        ok: true,
        message: 'CV salvo em modo mock.',
        version: {
          ...version,
          id: version.id ?? 'mock-cv',
        },
      };
    }

    const { data, error } = await this.supabase.client
      .from('cv_versions')
      .insert({
        user_id: version.userId,
        job_id: version.jobId || null,
        title: version.title,
        language: version.language,
        content: version.content,
        storage_path: version.storagePath || null,
        ats_score: version.atsScore,
      })
      .select('id,user_id,job_id,title,language,content,storage_path,ats_score,created_at')
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: true,
      message: 'Versao de CV gerada com sucesso.',
      version: rowToCvVersion(data as CvVersionRow),
    };
  }
}
