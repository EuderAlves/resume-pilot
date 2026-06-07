import { generateCvContent, estimateAtsScore } from './cv-generator';
import { JobOpportunity } from '../../jobs/data/job-opportunity.model';

describe('cv generator', () => {
  const job: JobOpportunity = {
    userId: 'user-1',
    title: 'Angular Developer',
    company: 'Tech Co',
    location: '',
    country: 'Portugal',
    sourceUrl: '',
    source: 'manual',
    description: 'Angular and TypeScript',
    languageRequirements: ['Ingles'],
    requiredSkills: ['Angular', 'TypeScript'],
    desiredSkills: ['Jest'],
    seniority: 'mid-level',
    workModel: 'remote',
    visaSignal: '',
    salary: '',
    fitScore: 80,
    analysis: {
      requiredSkills: ['Angular', 'TypeScript'],
      desiredSkills: ['Jest'],
      languageRequirements: ['Ingles'],
      keywords: ['Angular', 'TypeScript', 'Jest'],
      seniority: 'mid-level',
      workModel: 'remote',
      visaSignal: '',
      fitScore: 80,
      matchedSkills: ['Angular', 'TypeScript'],
      missingSkills: ['Jest'],
    },
  };

  it('generates CV content aligned with a job', () => {
    const content = generateCvContent({
      profile: null,
      job,
      skills: [],
      education: [],
      experiences: [
        {
          userId: 'user-1',
          company: 'CI&T',
          role: 'Developer',
          location: '',
          startDate: '2024-01-01',
          endDate: '',
          isCurrent: true,
          activities: [],
          tools: ['Angular'],
          achievements: [],
          generatedBullets: ['Desenvolvi telas Angular com TypeScript.'],
        },
      ],
    });

    expect(content.targetJob).toBe('Angular Developer | Tech Co');
    expect(content.matchedSkills).toEqual(['Angular', 'TypeScript']);
    expect(content.experienceBullets).toEqual(['Desenvolvi telas Angular com TypeScript.']);
  });

  it('estimates ATS score from fit and keyword coverage', () => {
    const content = generateCvContent({
      profile: null,
      job,
      skills: [],
      education: [],
      experiences: [],
    });

    expect(estimateAtsScore(content, job)).toBeGreaterThan(50);
  });
});
