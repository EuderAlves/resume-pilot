export interface ProfileLanguage {
  readonly name: string;
  readonly level: string;
}

export interface ProfessionalProfile {
  readonly id?: string;
  readonly userId: string;
  readonly fullName: string;
  readonly headline: string;
  readonly targetRole: string;
  readonly targetSeniority: string;
  readonly targetCountries: string[];
  readonly location: string;
  readonly relocationGoal: string;
  readonly languages: ProfileLanguage[];
  readonly summary: string;
}

export interface ProfessionalProfileFormValue {
  readonly fullName: string;
  readonly headline: string;
  readonly targetRole: string;
  readonly targetSeniority: string;
  readonly targetCountriesInput: string;
  readonly location: string;
  readonly relocationGoal: string;
  readonly languagesInput: string;
  readonly summary: string;
}

export interface ProfessionalProfileRow {
  readonly id: string;
  readonly user_id: string;
  readonly full_name: string | null;
  readonly headline: string | null;
  readonly target_role: string | null;
  readonly target_seniority: string | null;
  readonly target_countries: string[] | null;
  readonly location: string | null;
  readonly relocation_goal: string | null;
  readonly languages: ProfileLanguage[] | null;
  readonly summary: string | null;
}
