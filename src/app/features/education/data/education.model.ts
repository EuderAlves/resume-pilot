export interface EducationRecord {
  readonly id?: string;
  readonly userId: string;
  readonly course: string;
  readonly institution: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly description: string;
}

export interface EducationFormValue {
  readonly course: string;
  readonly institution: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly description: string;
}

export interface EducationRow {
  readonly id: string;
  readonly user_id: string;
  readonly course: string;
  readonly institution: string;
  readonly start_date: string | null;
  readonly end_date: string | null;
  readonly description: string | null;
}
