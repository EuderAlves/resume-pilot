import { analyzeLinkedinProfile } from './linkedin-audit-analyzer';

describe('linkedin audit analyzer', () => {
  it('scores a profile and returns rewritten content', () => {
    const audit = analyzeLinkedinProfile(
      {
        profileUrl: 'https://linkedin.com/in/user',
        headline: 'Frontend Angular Developer | TypeScript | JavaScript',
        about:
          'Sou desenvolvedor frontend com foco em Angular, TypeScript, entregas de produto, qualidade e resultado para negocio.',
        experienceCount: 3,
        skillCount: 12,
        targetRole: 'Frontend Angular Developer',
        targetCountries: ['Portugal'],
        topSkills: ['Angular', 'TypeScript', 'JavaScript'],
      },
      'user-1',
    );

    expect(audit.totalScore).toBeGreaterThan(70);
    expect(audit.suggestions.rewrittenHeadline).toContain('Frontend Angular Developer');
  });
});
