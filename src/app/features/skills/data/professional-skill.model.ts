export interface ProfessionalSkill {
  readonly id?: string;
  readonly userId: string;
  readonly name: string;
  readonly category: string;
  readonly level: string;
  readonly evidence: string;
}

export interface SkillFormValue {
  readonly name: string;
  readonly category: string;
  readonly level: string;
  readonly evidence: string;
}

export interface SkillRow {
  readonly id: string;
  readonly user_id: string;
  readonly name: string;
  readonly category: string;
  readonly level: string | null;
  readonly evidence: string | null;
}

export interface SkillOption {
  readonly value: string;
  readonly label: string;
}
