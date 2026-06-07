import { rowToSkill, skillToFormValue, toSkillPayload } from './skill-form.mapper';
import { SkillRow } from './professional-skill.model';

describe('skill form mapper', () => {
  it('maps database rows to professional skills', () => {
    const row: SkillRow = {
      id: 'skill-1',
      user_id: 'user-1',
      name: 'Angular',
      category: 'technical',
      level: null,
      evidence: null,
    };

    expect(rowToSkill(row)).toEqual({
      id: 'skill-1',
      userId: 'user-1',
      name: 'Angular',
      category: 'technical',
      level: '',
      evidence: '',
    });
  });

  it('keeps default category and level when creating a new form', () => {
    expect(skillToFormValue(null)).toEqual({
      name: '',
      category: 'technical',
      level: 'intermediate',
      evidence: '',
    });
  });

  it('trims skill payload values', () => {
    expect(
      toSkillPayload(
        {
          name: ' Angular ',
          category: ' technical ',
          level: ' intermediate ',
          evidence: ' Projetos em CI&T ',
        },
        'user-1',
        'skill-1',
      ),
    ).toEqual({
      id: 'skill-1',
      userId: 'user-1',
      name: 'Angular',
      category: 'technical',
      level: 'intermediate',
      evidence: 'Projetos em CI&T',
    });
  });
});
