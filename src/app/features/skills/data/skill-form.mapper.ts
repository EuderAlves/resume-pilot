import { ProfessionalSkill, SkillFormValue, SkillRow } from './professional-skill.model';

export function rowToSkill(row: SkillRow): ProfessionalSkill {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    category: row.category,
    level: row.level ?? '',
    evidence: row.evidence ?? '',
  };
}

export function skillToFormValue(skill: ProfessionalSkill | null): SkillFormValue {
  return {
    name: skill?.name ?? '',
    category: skill?.category ?? 'technical',
    level: skill?.level ?? 'intermediate',
    evidence: skill?.evidence ?? '',
  };
}

export function toSkillPayload(value: SkillFormValue, userId: string, id?: string): ProfessionalSkill {
  return {
    id,
    userId,
    name: value.name.trim(),
    category: value.category.trim(),
    level: value.level.trim(),
    evidence: value.evidence.trim(),
  };
}
