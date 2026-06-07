export interface JobAnalysis {
  readonly requiredSkills: string[];
  readonly desiredSkills: string[];
  readonly languageRequirements: string[];
  readonly keywords: string[];
  readonly seniority: string;
  readonly workModel: string;
  readonly visaSignal: string;
  readonly fitScore: number;
  readonly matchedSkills: string[];
  readonly missingSkills: string[];
}

export interface JobOpportunity {
  readonly id?: string;
  readonly userId: string;
  readonly title: string;
  readonly company: string;
  readonly location: string;
  readonly country: string;
  readonly sourceUrl: string;
  readonly source: string;
  readonly description: string;
  readonly languageRequirements: string[];
  readonly requiredSkills: string[];
  readonly desiredSkills: string[];
  readonly seniority: string;
  readonly workModel: string;
  readonly visaSignal: string;
  readonly salary: string;
  readonly fitScore: number;
  readonly analysis: JobAnalysis;
}

export interface JobFormValue {
  readonly title: string;
  readonly company: string;
  readonly country: string;
  readonly location: string;
  readonly sourceUrl: string;
  readonly seniority: string;
  readonly workModel: string;
  readonly salary: string;
  readonly description: string;
}

export interface JobRow {
  readonly id: string;
  readonly user_id: string;
  readonly title: string;
  readonly company: string | null;
  readonly location: string | null;
  readonly country: string | null;
  readonly source_url: string | null;
  readonly source: string;
  readonly description: string | null;
  readonly language_requirements: string[] | null;
  readonly required_skills: string[] | null;
  readonly desired_skills: string[] | null;
  readonly seniority: string | null;
  readonly work_model: string | null;
  readonly visa_signal: string | null;
  readonly salary: string | null;
  readonly fit_score: number | string | null;
  readonly analysis: Partial<JobAnalysis> | null;
}

export interface JobOption {
  readonly value: string;
  readonly label: string;
}
