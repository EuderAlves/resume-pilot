import { educationToFormValue, rowToEducation, toEducationPayload } from './education-form.mapper';
import { EducationRow } from './education.model';

describe('education form mapper', () => {
  it('maps database rows to education records', () => {
    const row: EducationRow = {
      id: 'education-1',
      user_id: 'user-1',
      course: 'Angular Avancado',
      institution: 'Escola Tech',
      start_date: '2024-01-01',
      end_date: null,
      description: null,
    };

    expect(rowToEducation(row)).toEqual({
      id: 'education-1',
      userId: 'user-1',
      course: 'Angular Avancado',
      institution: 'Escola Tech',
      startDate: '2024-01-01',
      endDate: '',
      description: '',
    });
  });

  it('trims form values before creating the payload', () => {
    const formValue = educationToFormValue({
      userId: 'user-1',
      course: ' Pos-Graduacao ',
      institution: ' PUC Minas ',
      startDate: '2021-03-01',
      endDate: '2023-09-01',
      description: ' Desenvolvimento web ',
    });

    expect(toEducationPayload(formValue, 'user-1', 'education-1')).toEqual({
      id: 'education-1',
      userId: 'user-1',
      course: 'Pos-Graduacao',
      institution: 'PUC Minas',
      startDate: '2021-03-01',
      endDate: '2023-09-01',
      description: 'Desenvolvimento web',
    });
  });
});
