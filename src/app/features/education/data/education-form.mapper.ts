import { EducationFormValue, EducationRecord, EducationRow } from './education.model';

export function rowToEducation(row: EducationRow): EducationRecord {
  return {
    id: row.id,
    userId: row.user_id,
    course: row.course,
    institution: row.institution,
    startDate: row.start_date ?? '',
    endDate: row.end_date ?? '',
    description: row.description ?? '',
  };
}

export function educationToFormValue(education: EducationRecord | null): EducationFormValue {
  return {
    course: education?.course ?? '',
    institution: education?.institution ?? '',
    startDate: education?.startDate ?? '',
    endDate: education?.endDate ?? '',
    description: education?.description ?? '',
  };
}

export function toEducationPayload(
  value: EducationFormValue,
  userId: string,
  id?: string,
): EducationRecord {
  return {
    id,
    userId,
    course: value.course.trim(),
    institution: value.institution.trim(),
    startDate: value.startDate,
    endDate: value.endDate,
    description: value.description.trim(),
  };
}
