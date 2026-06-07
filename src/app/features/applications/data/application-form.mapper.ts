import { ApplicationFormValue, ApplicationRecord, ApplicationRow } from './application.model';

export function rowToApplication(row: ApplicationRow): ApplicationRecord {
  return {
    id: row.id,
    userId: row.user_id,
    jobId: row.job_id ?? '',
    appliedAt: row.applied_at ?? '',
    status: row.status,
    followUpAt: row.follow_up_at ?? '',
    notes: row.notes ?? '',
    contactName: row.contact_name ?? '',
    contactUrl: row.contact_url ?? '',
  };
}

export function applicationToFormValue(
  application: ApplicationRecord | null,
): ApplicationFormValue {
  return {
    jobId: application?.jobId ?? '',
    appliedAt: application?.appliedAt ?? '',
    status: application?.status ?? 'saved',
    followUpAt: application?.followUpAt ?? '',
    notes: application?.notes ?? '',
    contactName: application?.contactName ?? '',
    contactUrl: application?.contactUrl ?? '',
  };
}

export function toApplicationPayload(
  value: ApplicationFormValue,
  userId: string,
  id?: string,
): ApplicationRecord {
  return {
    id,
    userId,
    jobId: value.jobId,
    appliedAt: value.appliedAt,
    status: value.status,
    followUpAt: value.followUpAt,
    notes: value.notes.trim(),
    contactName: value.contactName.trim(),
    contactUrl: value.contactUrl.trim(),
  };
}
