import { analyzeJobDescription } from './job-description-analyzer';
import { jobToFormValue, rowToJob, toJobPayload } from './job-form.mapper';
import { JobRow } from './job-opportunity.model';

describe('job form mapper', () => {
  it('maps database rows to job opportunities', () => {
    const row: JobRow = {
      id: 'job-1',
      user_id: 'user-1',
      title: 'Angular Developer',
      company: null,
      location: null,
      country: 'Portugal',
      source_url: null,
      source: 'manual',
      description: 'Angular and TypeScript',
      language_requirements: null,
      required_skills: ['Angular'],
      desired_skills: null,
      seniority: null,
      work_model: null,
      visa_signal: null,
      salary: null,
      fit_score: '80',
      analysis: {
        requiredSkills: ['Angular'],
        fitScore: 80,
      },
    };

    expect(rowToJob(row)).toEqual(
      jasmine.objectContaining({
        id: 'job-1',
        title: 'Angular Developer',
        company: '',
        country: 'Portugal',
        requiredSkills: ['Angular'],
        fitScore: 80,
      }),
    );
  });

  it('creates payload using analysis when manual fields are empty', () => {
    const analysis = analyzeJobDescription('Senior remote Angular role. English required.', [
      'Angular',
    ]);
    const payload = toJobPayload(
      jobToFormValue({
        userId: 'user-1',
        title: ' Angular Developer ',
        company: '',
        country: '',
        location: '',
        sourceUrl: '',
        source: 'manual',
        description: 'Senior remote Angular role. English required.',
        languageRequirements: [],
        requiredSkills: [],
        desiredSkills: [],
        seniority: '',
        workModel: '',
        visaSignal: '',
        salary: '',
        fitScore: 0,
        analysis,
      }),
      'user-1',
      analysis,
      'job-1',
    );

    expect(payload.title).toBe('Angular Developer');
    expect(payload.seniority).toBe('senior');
    expect(payload.workModel).toBe('remote');
    expect(payload.requiredSkills).toEqual(['Angular']);
  });
});
