export interface CvContent {
  readonly headline: string;
  readonly summary: string;
  readonly targetJob: string;
  readonly matchedSkills: string[];
  readonly missingSkills: string[];
  readonly experienceBullets: string[];
  readonly education: string[];
  readonly languages: string[];
  readonly keywords: string[];
}

export interface CvVersion {
  readonly id?: string;
  readonly userId: string;
  readonly jobId: string;
  readonly title: string;
  readonly language: string;
  readonly content: CvContent;
  readonly storagePath: string;
  readonly atsScore: number;
  readonly createdAt?: string;
}

export interface CvVersionRow {
  readonly id: string;
  readonly user_id: string;
  readonly job_id: string | null;
  readonly title: string;
  readonly language: string;
  readonly content: CvContent | null;
  readonly storage_path: string | null;
  readonly ats_score: number | string | null;
  readonly created_at: string;
}
