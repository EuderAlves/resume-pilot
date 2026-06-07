import { emptySuggestions } from './linkedin-audit-analyzer';
import { LinkedinAudit, LinkedinAuditRow } from './linkedin-audit.model';

export function rowToLinkedinAudit(row: LinkedinAuditRow): LinkedinAudit {
  return {
    id: row.id,
    userId: row.user_id,
    profileUrl: row.profile_url ?? '',
    headlineScore: Number(row.headline_score ?? 0),
    aboutScore: Number(row.about_score ?? 0),
    experienceScore: Number(row.experience_score ?? 0),
    skillsScore: Number(row.skills_score ?? 0),
    totalScore: Number(row.total_score ?? 0),
    suggestions: row.suggestions ?? emptySuggestions(),
    createdAt: row.created_at,
  };
}
