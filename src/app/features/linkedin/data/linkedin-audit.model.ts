export interface LinkedinSuggestion {
  readonly area: string;
  readonly title: string;
  readonly description: string;
}

export interface LinkedinAuditSuggestions {
  readonly strengths: string[];
  readonly improvements: LinkedinSuggestion[];
  readonly rewrittenHeadline: string;
  readonly rewrittenAbout: string;
}

export interface LinkedinAudit {
  readonly id?: string;
  readonly userId: string;
  readonly profileUrl: string;
  readonly headlineScore: number;
  readonly aboutScore: number;
  readonly experienceScore: number;
  readonly skillsScore: number;
  readonly totalScore: number;
  readonly suggestions: LinkedinAuditSuggestions;
  readonly createdAt?: string;
}

export interface LinkedinAuditInput {
  readonly profileUrl: string;
  readonly headline: string;
  readonly about: string;
  readonly experienceCount: number;
  readonly skillCount: number;
  readonly targetRole: string;
  readonly targetCountries: readonly string[];
  readonly topSkills: readonly string[];
}

export interface LinkedinAuditRow {
  readonly id: string;
  readonly user_id: string;
  readonly profile_url: string | null;
  readonly headline_score: number | string | null;
  readonly about_score: number | string | null;
  readonly experience_score: number | string | null;
  readonly skills_score: number | string | null;
  readonly total_score: number | string | null;
  readonly suggestions: LinkedinAuditSuggestions | null;
  readonly created_at: string;
}
