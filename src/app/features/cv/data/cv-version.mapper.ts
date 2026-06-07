import { CvContent, CvVersion, CvVersionRow } from './cv-version.model';

export function rowToCvVersion(row: CvVersionRow): CvVersion {
  return {
    id: row.id,
    userId: row.user_id,
    jobId: row.job_id ?? '',
    title: row.title,
    language: row.language,
    content: row.content ?? emptyCvContent(),
    storagePath: row.storage_path ?? '',
    atsScore: Number(row.ats_score ?? 0),
    createdAt: row.created_at,
  };
}

export function emptyCvContent(): CvContent {
  return {
    headline: '',
    summary: '',
    targetJob: '',
    matchedSkills: [],
    missingSkills: [],
    experienceBullets: [],
    education: [],
    languages: [],
    keywords: [],
  };
}
