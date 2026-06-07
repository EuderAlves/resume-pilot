import { EducationRecord } from '../../education/data/education.model';
import { ProfessionalExperience } from '../../experiences/data/professional-experience.model';
import { JobOpportunity } from '../../jobs/data/job-opportunity.model';
import { ProfessionalProfile } from '../../profile/data/professional-profile.model';
import { ProfessionalSkill } from '../../skills/data/professional-skill.model';
import { CvContent } from './cv-version.model';

export interface CvGenerationContext {
  readonly profile: ProfessionalProfile | null;
  readonly experiences: readonly ProfessionalExperience[];
  readonly education: readonly EducationRecord[];
  readonly skills: readonly ProfessionalSkill[];
  readonly job: JobOpportunity;
}

export function generateCvContent(context: CvGenerationContext): CvContent {
  const matchedSkills = context.job.analysis.matchedSkills.length
    ? context.job.analysis.matchedSkills
    : context.skills.map((skill) => skill.name).filter((skill) => context.job.requiredSkills.includes(skill));
  const relevantBullets = collectRelevantBullets(context.experiences, [
    ...context.job.requiredSkills,
    ...context.job.desiredSkills,
  ]);

  return {
    headline: buildHeadline(context.profile, context.job),
    summary: buildSummary(context.profile, context.job, matchedSkills),
    targetJob: `${context.job.title}${context.job.company ? ` | ${context.job.company}` : ''}`,
    matchedSkills,
    missingSkills: context.job.analysis.missingSkills,
    experienceBullets: relevantBullets,
    education: context.education.map((item) => `${item.course} | ${item.institution}`),
    languages:
      context.profile?.languages.map((language) => `${language.name} - ${language.level}`) ??
      context.job.languageRequirements,
    keywords: context.job.analysis.keywords,
  };
}

export function estimateAtsScore(content: CvContent, job: JobOpportunity): number {
  const keywordMatches = job.analysis.keywords.filter((keyword) =>
    contentText(content).toLowerCase().includes(keyword.toLowerCase()),
  ).length;
  const keywordScore = job.analysis.keywords.length
    ? Math.round((keywordMatches / job.analysis.keywords.length) * 35)
    : 0;

  return Math.min(100, Math.round(job.fitScore * 0.65 + keywordScore));
}

function buildHeadline(profile: ProfessionalProfile | null, job: JobOpportunity): string {
  if (profile?.headline) {
    return `${profile.headline} | Alvo: ${job.title}`;
  }

  return `${job.title} | ${job.requiredSkills.slice(0, 4).join(', ')}`;
}

function buildSummary(
  profile: ProfessionalProfile | null,
  job: JobOpportunity,
  matchedSkills: readonly string[],
): string {
  const baseSummary =
    profile?.summary ||
    'Profissional de tecnologia com experiencia em desenvolvimento, colaboracao com times de produto e melhoria continua.';
  const skillsText = matchedSkills.length
    ? ` Principais aderencias para a vaga: ${matchedSkills.slice(0, 8).join(', ')}.`
    : '';

  return `${baseSummary} Interesse direcionado para ${job.title}.${skillsText}`;
}

function collectRelevantBullets(
  experiences: readonly ProfessionalExperience[],
  keywords: readonly string[],
): string[] {
  const normalizedKeywords = keywords.map((keyword) => keyword.toLowerCase());
  const generatedBullets = experiences.flatMap((experience) => experience.generatedBullets);
  const matchedBullets = generatedBullets.filter((bullet) =>
    normalizedKeywords.some((keyword) => bullet.toLowerCase().includes(keyword)),
  );

  return (matchedBullets.length ? matchedBullets : generatedBullets).slice(0, 8);
}

function contentText(content: CvContent): string {
  return [
    content.headline,
    content.summary,
    content.targetJob,
    ...content.matchedSkills,
    ...content.experienceBullets,
    ...content.education,
    ...content.languages,
    ...content.keywords,
  ].join(' ');
}
