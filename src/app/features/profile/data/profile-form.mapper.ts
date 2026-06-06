import {
  ProfessionalProfile,
  ProfessionalProfileFormValue,
  ProfessionalProfileRow,
  ProfileLanguage,
} from './professional-profile.model';

export function parseCsvList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseLanguages(value: string): ProfileLanguage[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, ...levelParts] = line.split(/[-:]/);

      return {
        name: name.trim(),
        level: levelParts.join('-').trim() || 'Nao informado',
      };
    })
    .filter((language) => language.name.length > 0);
}

export function formatLanguages(languages: readonly ProfileLanguage[]): string {
  return languages.map((language) => `${language.name} - ${language.level}`).join('\n');
}

export function toProfilePayload(
  value: ProfessionalProfileFormValue,
  userId: string,
): Omit<ProfessionalProfile, 'id'> {
  return {
    userId,
    fullName: value.fullName.trim(),
    headline: value.headline.trim(),
    targetRole: value.targetRole.trim(),
    targetSeniority: value.targetSeniority.trim(),
    targetCountries: parseCsvList(value.targetCountriesInput),
    location: value.location.trim(),
    relocationGoal: value.relocationGoal.trim(),
    languages: parseLanguages(value.languagesInput),
    summary: value.summary.trim(),
  };
}

export function rowToProfile(row: ProfessionalProfileRow): ProfessionalProfile {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name ?? '',
    headline: row.headline ?? '',
    targetRole: row.target_role ?? '',
    targetSeniority: row.target_seniority ?? '',
    targetCountries: row.target_countries ?? [],
    location: row.location ?? '',
    relocationGoal: row.relocation_goal ?? '',
    languages: row.languages ?? [],
    summary: row.summary ?? '',
  };
}

export function profileToFormValue(
  profile: ProfessionalProfile | null,
  fallbackEmail = '',
): ProfessionalProfileFormValue {
  return {
    fullName: profile?.fullName ?? '',
    headline: profile?.headline ?? '',
    targetRole: profile?.targetRole ?? '',
    targetSeniority: profile?.targetSeniority ?? '',
    targetCountriesInput: profile?.targetCountries.join(', ') ?? '',
    location: profile?.location ?? '',
    relocationGoal: profile?.relocationGoal ?? '',
    languagesInput: profile ? formatLanguages(profile.languages) : '',
    summary: profile?.summary ?? `Profissional em evolucao internacional (${fallbackEmail}).`,
  };
}
