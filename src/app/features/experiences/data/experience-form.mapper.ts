import {
  ExperienceActivity,
  ProfessionalExperience,
  ProfessionalExperienceFormValue,
  ProfessionalExperienceRow,
} from './professional-experience.model';

export function parseLineList(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseCsvList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseActivities(value: string): ExperienceActivity[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [activity = '', frequency = '', result = ''] = line.split('|').map((part) => part.trim());

      return {
        activity,
        frequency: frequency || 'Nao informado',
        result: result || 'Nao informado',
      };
    })
    .filter((item) => item.activity.length > 0);
}

export function formatActivities(activities: readonly ExperienceActivity[]): string {
  return activities
    .map((item) => `${item.activity} | ${item.frequency} | ${item.result}`)
    .join('\n');
}

export function rowToExperience(row: ProfessionalExperienceRow): ProfessionalExperience {
  return {
    id: row.id,
    userId: row.user_id,
    company: row.company,
    role: row.role,
    location: row.location ?? '',
    startDate: row.start_date ?? '',
    endDate: row.end_date ?? '',
    isCurrent: row.is_current,
    activities: row.activities ?? [],
    tools: row.tools ?? [],
    achievements: row.achievements ?? [],
    generatedBullets: row.generated_bullets ?? [],
  };
}

export function experienceToFormValue(
  experience: ProfessionalExperience | null,
): ProfessionalExperienceFormValue {
  return {
    company: experience?.company ?? '',
    role: experience?.role ?? '',
    location: experience?.location ?? '',
    startDate: experience?.startDate ?? '',
    endDate: experience?.endDate ?? '',
    isCurrent: experience?.isCurrent ?? false,
    activitiesInput: experience ? formatActivities(experience.activities) : '',
    toolsInput: experience?.tools.join(', ') ?? '',
    achievementsInput: experience?.achievements.join('\n') ?? '',
    generatedBulletsInput: experience?.generatedBullets.join('\n') ?? '',
  };
}

export function toExperiencePayload(
  value: ProfessionalExperienceFormValue,
  userId: string,
  id?: string,
): ProfessionalExperience {
  return {
    id,
    userId,
    company: value.company.trim(),
    role: value.role.trim(),
    location: value.location.trim(),
    startDate: value.startDate,
    endDate: value.isCurrent ? '' : value.endDate,
    isCurrent: value.isCurrent,
    activities: parseActivities(value.activitiesInput),
    tools: parseCsvList(value.toolsInput),
    achievements: parseLineList(value.achievementsInput),
    generatedBullets: parseLineList(value.generatedBulletsInput),
  };
}
