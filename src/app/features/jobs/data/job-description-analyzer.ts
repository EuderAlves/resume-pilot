import { JobAnalysis } from './job-opportunity.model';

interface SkillPattern {
  readonly canonical: string;
  readonly aliases: readonly string[];
}

const skillPatterns: readonly SkillPattern[] = [
  { canonical: 'Angular', aliases: ['angular', 'angular 2'] },
  { canonical: 'TypeScript', aliases: ['typescript', 'type script', 'ts'] },
  { canonical: 'JavaScript', aliases: ['javascript', 'java script'] },
  { canonical: 'RxJS', aliases: ['rxjs', 'reactive extensions'] },
  { canonical: 'NgRx', aliases: ['ngrx'] },
  { canonical: 'HTML', aliases: ['html', 'html5'] },
  { canonical: 'CSS', aliases: ['css', 'css3'] },
  { canonical: 'SCSS', aliases: ['scss', 'sass'] },
  { canonical: 'Node.js', aliases: ['node.js', 'node js', 'node'] },
  { canonical: 'Java Spring Boot', aliases: ['spring boot', 'java spring boot'] },
  { canonical: 'ASP.NET', aliases: ['asp.net', 'asp net', '.net'] },
  { canonical: 'REST APIs', aliases: ['rest api', 'rest apis', 'api rest', 'apis rest'] },
  { canonical: 'GraphQL', aliases: ['graphql'] },
  { canonical: 'SQL', aliases: ['sql'] },
  { canonical: 'PostgreSQL', aliases: ['postgresql', 'postgres'] },
  { canonical: 'MongoDB', aliases: ['mongodb', 'mongo db'] },
  { canonical: 'Docker', aliases: ['docker'] },
  { canonical: 'Kubernetes', aliases: ['kubernetes', 'k8s'] },
  { canonical: 'AWS', aliases: ['aws', 'amazon web services'] },
  { canonical: 'Azure', aliases: ['azure'] },
  { canonical: 'GCP', aliases: ['gcp', 'google cloud'] },
  { canonical: 'Jenkins', aliases: ['jenkins'] },
  { canonical: 'CI/CD', aliases: ['ci cd', 'ci/cd', 'pipeline'] },
  { canonical: 'Git', aliases: ['git', 'github', 'gitlab'] },
  { canonical: 'Jira', aliases: ['jira'] },
  { canonical: 'Figma', aliases: ['figma'] },
  { canonical: 'Testes unitarios', aliases: ['unit tests', 'unit testing', 'testes unitarios'] },
  { canonical: 'Jasmine', aliases: ['jasmine'] },
  { canonical: 'Karma', aliases: ['karma'] },
  { canonical: 'Jest', aliases: ['jest'] },
  { canonical: 'Cypress', aliases: ['cypress'] },
  { canonical: 'Playwright', aliases: ['playwright'] },
  { canonical: 'SOLID', aliases: ['solid'] },
  { canonical: 'Metodologias ageis', aliases: ['agile', 'scrum', 'kanban', 'metodologias ageis'] },
];

const requiredMarkers = [
  'required',
  'requirements',
  'must have',
  'essential',
  'obrigatorio',
  'obrigatoria',
  'requisitos',
  'necessario',
  'necessaria',
  'precisa ter',
  'experiencia com',
];

const desiredMarkers = [
  'nice to have',
  'plus',
  'preferred',
  'desirable',
  'desejavel',
  'diferencial',
  'seria bom',
  'bonus',
];

const languagePatterns: readonly SkillPattern[] = [
  { canonical: 'Ingles', aliases: ['english', 'ingles', 'ingles fluente', 'advanced english'] },
  { canonical: 'Espanhol', aliases: ['spanish', 'espanhol'] },
  { canonical: 'Portugues', aliases: ['portuguese', 'portugues'] },
  { canonical: 'Alemao', aliases: ['german', 'alemao'] },
  { canonical: 'Frances', aliases: ['french', 'frances'] },
  { canonical: 'Italiano', aliases: ['italian', 'italiano'] },
];

export function analyzeJobDescription(
  description: string,
  userSkillNames: readonly string[] = [],
): JobAnalysis {
  const normalizedDescription = normalizeForMatch(description);
  const detectedByLine = extractSkillsByLine(description);
  const detectedSkills = uniqueSkills(detectedByLine.flatMap((line) => line.skills));
  const requiredSkills = uniqueSkills(
    detectedByLine
      .filter((line) => line.intent === 'required')
      .flatMap((line) => line.skills),
  );
  const desiredSkills = uniqueSkills(
    detectedByLine.filter((line) => line.intent === 'desired').flatMap((line) => line.skills),
  ).filter((skill) => !requiredSkills.includes(skill));
  const effectiveRequiredSkills = requiredSkills.length > 0 ? requiredSkills : detectedSkills;
  const languageRequirements = extractMatches(normalizedDescription, languagePatterns);
  const seniority = detectSeniority(normalizedDescription);
  const workModel = detectWorkModel(normalizedDescription);
  const visaSignal = detectVisaSignal(normalizedDescription);
  const allJobSkills = uniqueSkills([...effectiveRequiredSkills, ...desiredSkills]);
  const matchedSkills = allJobSkills.filter((skill) => hasUserSkill(skill, userSkillNames));
  const missingSkills = allJobSkills.filter((skill) => !matchedSkills.includes(skill));
  const fitScore = calculateFitScore(effectiveRequiredSkills, desiredSkills, matchedSkills);
  const keywords = uniqueSkills([
    ...effectiveRequiredSkills,
    ...desiredSkills,
    ...languageRequirements,
    seniority,
    workModel,
  ])
    .filter(Boolean)
    .slice(0, 14);

  return {
    requiredSkills: effectiveRequiredSkills,
    desiredSkills,
    languageRequirements,
    keywords,
    seniority,
    workModel,
    visaSignal,
    fitScore,
    matchedSkills,
    missingSkills,
  };
}

export function normalizeJobAnalysis(value: Partial<JobAnalysis> | null | undefined): JobAnalysis {
  return {
    requiredSkills: value?.requiredSkills ?? [],
    desiredSkills: value?.desiredSkills ?? [],
    languageRequirements: value?.languageRequirements ?? [],
    keywords: value?.keywords ?? [],
    seniority: value?.seniority ?? '',
    workModel: value?.workModel ?? '',
    visaSignal: value?.visaSignal ?? '',
    fitScore: Number(value?.fitScore ?? 0),
    matchedSkills: value?.matchedSkills ?? [],
    missingSkills: value?.missingSkills ?? [],
  };
}

function extractSkillsByLine(description: string): Array<{ intent: 'required' | 'desired'; skills: string[] }> {
  const lines = description
    .split(/\r?\n|[.;]/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .map((line) => {
      const normalizedLine = normalizeForMatch(line);
      const skills = extractMatches(normalizedLine, skillPatterns);

      if (skills.length === 0) {
        return null;
      }

      return {
        intent: hasAnyMarker(normalizedLine, desiredMarkers) ? 'desired' : 'required',
        skills,
      };
    })
    .filter((line): line is { intent: 'required' | 'desired'; skills: string[] } => line !== null);
}

function extractMatches(normalizedText: string, patterns: readonly SkillPattern[]): string[] {
  return uniqueSkills(
    patterns
      .filter((pattern) => pattern.aliases.some((alias) => hasPhrase(normalizedText, alias)))
      .map((pattern) => pattern.canonical),
  );
}

function detectSeniority(normalizedText: string): string {
  if (hasPhrase(normalizedText, 'principal') || hasPhrase(normalizedText, 'staff')) {
    return 'staff';
  }

  if (hasPhrase(normalizedText, 'lead') || hasPhrase(normalizedText, 'tech lead')) {
    return 'lead';
  }

  if (hasPhrase(normalizedText, 'senior') || hasPhrase(normalizedText, 'sr')) {
    return 'senior';
  }

  if (hasPhrase(normalizedText, 'pleno') || hasPhrase(normalizedText, 'mid level')) {
    return 'mid-level';
  }

  if (hasPhrase(normalizedText, 'junior') || hasPhrase(normalizedText, 'jr')) {
    return 'junior';
  }

  return '';
}

function detectWorkModel(normalizedText: string): string {
  if (hasPhrase(normalizedText, 'remote') || hasPhrase(normalizedText, 'remoto')) {
    return 'remote';
  }

  if (hasPhrase(normalizedText, 'hybrid') || hasPhrase(normalizedText, 'hibrido')) {
    return 'hybrid';
  }

  if (hasPhrase(normalizedText, 'onsite') || hasPhrase(normalizedText, 'presencial')) {
    return 'onsite';
  }

  return '';
}

function detectVisaSignal(normalizedText: string): string {
  if (
    hasPhrase(normalizedText, 'no sponsorship') ||
    hasPhrase(normalizedText, 'must have work permit') ||
    hasPhrase(normalizedText, 'right to work')
  ) {
    return 'restritivo';
  }

  if (
    hasPhrase(normalizedText, 'visa sponsorship') ||
    hasPhrase(normalizedText, 'relocation package') ||
    hasPhrase(normalizedText, 'relocation support') ||
    hasPhrase(normalizedText, 'visto') ||
    hasPhrase(normalizedText, 'relocacao')
  ) {
    return 'sinal positivo';
  }

  return '';
}

function calculateFitScore(
  requiredSkills: readonly string[],
  desiredSkills: readonly string[],
  matchedSkills: readonly string[],
): number {
  const matchedRequired = requiredSkills.filter((skill) => matchedSkills.includes(skill)).length;
  const matchedDesired = desiredSkills.filter((skill) => matchedSkills.includes(skill)).length;

  if (requiredSkills.length === 0 && desiredSkills.length === 0) {
    return 0;
  }

  if (requiredSkills.length === 0) {
    return Math.round((matchedDesired / desiredSkills.length) * 100);
  }

  if (desiredSkills.length === 0) {
    return Math.round((matchedRequired / requiredSkills.length) * 100);
  }

  return Math.round(
    (matchedRequired / requiredSkills.length) * 75 + (matchedDesired / desiredSkills.length) * 25,
  );
}

function hasUserSkill(jobSkill: string, userSkillNames: readonly string[]): boolean {
  const normalizedJobSkill = normalizeForMatch(jobSkill);

  return userSkillNames.some((skillName) => normalizeForMatch(skillName) === normalizedJobSkill);
}

function hasAnyMarker(normalizedText: string, markers: readonly string[]): boolean {
  return markers.some((marker) => hasPhrase(normalizedText, marker));
}

function hasPhrase(normalizedText: string, phrase: string): boolean {
  return ` ${normalizedText} `.includes(` ${normalizeForMatch(phrase)} `);
}

function uniqueSkills(values: readonly string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeForMatch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9+#]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
