import { applicationToFormValue, rowToApplication, toApplicationPayload } from './application-form.mapper';
import { ApplicationRow } from './application.model';

describe('application form mapper', () => {
  it('maps nullable database rows to application records', () => {
    const row: ApplicationRow = {
      id: 'application-1',
      user_id: 'user-1',
      job_id: null,
      applied_at: null,
      status: 'saved',
      follow_up_at: null,
      notes: null,
      contact_name: null,
      contact_url: null,
    };

    expect(rowToApplication(row)).toEqual({
      id: 'application-1',
      userId: 'user-1',
      jobId: '',
      appliedAt: '',
      status: 'saved',
      followUpAt: '',
      notes: '',
      contactName: '',
      contactUrl: '',
    });
  });

  it('creates trimmed payload from form values', () => {
    const formValue = applicationToFormValue({
      userId: 'user-1',
      jobId: 'job-1',
      appliedAt: '2026-06-07',
      status: 'applied',
      followUpAt: '2026-06-14',
      notes: ' Revisar retorno ',
      contactName: ' Recruiter ',
      contactUrl: ' https://linkedin.com/in/recruiter ',
    });

    expect(toApplicationPayload(formValue, 'user-1', 'application-1')).toEqual({
      id: 'application-1',
      userId: 'user-1',
      jobId: 'job-1',
      appliedAt: '2026-06-07',
      status: 'applied',
      followUpAt: '2026-06-14',
      notes: 'Revisar retorno',
      contactName: 'Recruiter',
      contactUrl: 'https://linkedin.com/in/recruiter',
    });
  });
});
