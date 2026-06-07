export interface ExperienceActivity {
  readonly activity: string;
  readonly frequency: string;
  readonly result: string;
}

export interface ProfessionalExperience {
  readonly id?: string;
  readonly userId: string;
  readonly company: string;
  readonly role: string;
  readonly location: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly isCurrent: boolean;
  readonly activities: ExperienceActivity[];
  readonly tools: string[];
  readonly achievements: string[];
  readonly generatedBullets: string[];
}

export interface ProfessionalExperienceFormValue {
  readonly company: string;
  readonly role: string;
  readonly location: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly isCurrent: boolean;
  readonly activitiesInput: string;
  readonly toolsInput: string;
  readonly achievementsInput: string;
  readonly generatedBulletsInput: string;
}

export interface ProfessionalExperienceRow {
  readonly id: string;
  readonly user_id: string;
  readonly company: string;
  readonly role: string;
  readonly location: string | null;
  readonly start_date: string | null;
  readonly end_date: string | null;
  readonly is_current: boolean;
  readonly activities: ExperienceActivity[] | null;
  readonly tools: string[] | null;
  readonly achievements: string[] | null;
  readonly generated_bullets: string[] | null;
}
