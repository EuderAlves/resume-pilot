export type ApplicationStatus =
  | 'saved'
  | 'cv_tailored'
  | 'applied'
  | 'follow_up_sent'
  | 'interview'
  | 'technical_test'
  | 'offer'
  | 'rejected'
  | 'archived';

export interface ApplicationRecord {
  readonly id?: string;
  readonly userId: string;
  readonly jobId: string;
  readonly appliedAt: string;
  readonly status: ApplicationStatus;
  readonly followUpAt: string;
  readonly notes: string;
  readonly contactName: string;
  readonly contactUrl: string;
}

export interface ApplicationFormValue {
  readonly jobId: string;
  readonly appliedAt: string;
  readonly status: ApplicationStatus;
  readonly followUpAt: string;
  readonly notes: string;
  readonly contactName: string;
  readonly contactUrl: string;
}

export interface ApplicationRow {
  readonly id: string;
  readonly user_id: string;
  readonly job_id: string | null;
  readonly applied_at: string | null;
  readonly status: ApplicationStatus;
  readonly follow_up_at: string | null;
  readonly notes: string | null;
  readonly contact_name: string | null;
  readonly contact_url: string | null;
}

export interface ApplicationStatusOption {
  readonly value: ApplicationStatus;
  readonly label: string;
  readonly tone: 'neutral' | 'warning' | 'success' | 'danger';
}
