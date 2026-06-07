import { analyzeJobDescription } from './job-description-analyzer';

describe('job description analyzer', () => {
  it('extracts required skills and calculates score from user skills', () => {
    const analysis = analyzeJobDescription(
      'Requirements: Angular, TypeScript, RxJS and REST APIs. Nice to have: Cypress and AWS. Advanced English. Remote role.',
      ['Angular', 'TypeScript', 'REST APIs'],
    );

    expect(analysis.requiredSkills).toEqual(['Angular', 'TypeScript', 'RxJS', 'REST APIs']);
    expect(analysis.desiredSkills).toEqual(jasmine.arrayContaining(['Cypress', 'AWS']));
    expect(analysis.desiredSkills.length).toBe(2);
    expect(analysis.languageRequirements).toEqual(['Ingles']);
    expect(analysis.workModel).toBe('remote');
    expect(analysis.matchedSkills).toEqual(['Angular', 'TypeScript', 'REST APIs']);
    expect(analysis.missingSkills).toEqual(jasmine.arrayContaining(['RxJS', 'Cypress', 'AWS']));
    expect(analysis.missingSkills.length).toBe(3);
    expect(analysis.fitScore).toBe(56);
  });

  it('uses all detected skills as required when there is no section marker', () => {
    const analysis = analyzeJobDescription('Angular developer with Node.js and Jira experience.', [
      'Angular',
      'Jira',
    ]);

    expect(analysis.requiredSkills).toEqual(['Angular', 'Node.js', 'Jira']);
    expect(analysis.desiredSkills).toEqual([]);
    expect(analysis.fitScore).toBe(67);
  });

  it('detects restrictive visa signals', () => {
    const analysis = analyzeJobDescription(
      'Candidates must have work permit. No sponsorship available.',
      [],
    );

    expect(analysis.visaSignal).toBe('restritivo');
  });
});
