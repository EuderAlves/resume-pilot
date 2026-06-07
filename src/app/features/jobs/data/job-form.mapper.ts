import { normalizeJobAnalysis } from './job-description-analyzer';
import { JobAnalysis, JobFormValue, JobOpportunity, JobRow } from './job-opportunity.model';

export function rowToJob(row: JobRow): JobOpportunity {
  const analysis = normalizeJobAnalysis(row.analysis);
  const fitScore = Number(row.fit_score ?? analysis.fitScore);

  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    company: row.company ?? '',
    location: row.location ?? '',
    country: row.country ?? '',
    sourceUrl: row.source_url ?? '',
    source: row.source,
    description: row.description ?? '',
    languageRequirements: row.language_requirements ?? analysis.languageRequirements,
    requiredSkills: row.required_skills ?? analysis.requiredSkills,
    desiredSkills: row.desired_skills ?? analysis.desiredSkills,
    seniority: row.seniority ?? analysis.seniority,
    workModel: row.work_model ?? analysis.workModel,
    visaSignal: row.visa_signal ?? analysis.visaSignal,
    salary: row.salary ?? '',
    fitScore: Number.isFinite(fitScore) ? fitScore : 0,
    analysis,
  };
}

export function jobToFormValue(job: JobOpportunity | null): JobFormValue {
  return {
    title: job?.title ?? '',
    company: job?.company ?? '',
    country: job?.country ?? '',
    location: job?.location ?? '',
    sourceUrl: job?.sourceUrl ?? '',
    seniority: job?.seniority ?? '',
    workModel: job?.workModel ?? '',
    salary: job?.salary ?? '',
    description: job?.description ?? '',
  };
}

export function toJobPayload(
  value: JobFormValue,
  userId: string,
  analysis: JobAnalysis,
  id?: string,
): JobOpportunity {
  return {
    id,
    userId,
    title: value.title.trim(),
    company: value.company.trim(),
    country: value.country.trim(),
    location: value.location.trim(),
    sourceUrl: value.sourceUrl.trim(),
    source: 'manual',
    description: value.description.trim(),
    languageRequirements: analysis.languageRequirements,
    requiredSkills: analysis.requiredSkills,
    desiredSkills: analysis.desiredSkills,
    seniority: value.seniority.trim() || analysis.seniority,
    workModel: value.workModel.trim() || analysis.workModel,
    visaSignal: analysis.visaSignal,
    salary: value.salary.trim(),
    fitScore: analysis.fitScore,
    analysis,
  };
}
