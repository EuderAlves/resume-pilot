import {
  LinkedinAudit,
  LinkedinAuditInput,
  LinkedinAuditSuggestions,
} from './linkedin-audit.model';

export function analyzeLinkedinProfile(input: LinkedinAuditInput, userId: string): LinkedinAudit {
  const headlineScore = scoreHeadline(input.headline, input.targetRole, input.topSkills);
  const aboutScore = scoreAbout(input.about, input.targetRole, input.topSkills);
  const experienceScore = scoreExperience(input.experienceCount);
  const skillsScore = scoreSkills(input.skillCount);
  const totalScore = Math.round(
    headlineScore * 0.25 + aboutScore * 0.3 + experienceScore * 0.25 + skillsScore * 0.2,
  );

  return {
    userId,
    profileUrl: input.profileUrl.trim(),
    headlineScore,
    aboutScore,
    experienceScore,
    skillsScore,
    totalScore,
    suggestions: buildSuggestions(input, {
      headlineScore,
      aboutScore,
      experienceScore,
      skillsScore,
    }),
  };
}

export function emptySuggestions(): LinkedinAuditSuggestions {
  return {
    strengths: [],
    improvements: [],
    rewrittenHeadline: '',
    rewrittenAbout: '',
  };
}

function scoreHeadline(
  headline: string,
  targetRole: string,
  topSkills: readonly string[],
): number {
  const normalizedHeadline = headline.toLowerCase();
  let score = headline.trim().length >= 45 ? 35 : 15;

  if (targetRole && normalizedHeadline.includes(targetRole.toLowerCase().split(' ')[0])) {
    score += 25;
  }

  score += Math.min(30, topSkills.filter((skill) => normalizedHeadline.includes(skill.toLowerCase())).length * 10);

  if (headline.includes('|')) {
    score += 10;
  }

  return Math.min(100, score);
}

function scoreAbout(about: string, targetRole: string, topSkills: readonly string[]): number {
  const normalizedAbout = about.toLowerCase();
  let score = about.trim().length >= 450 ? 35 : about.trim().length >= 180 ? 25 : 10;

  if (targetRole && normalizedAbout.includes(targetRole.toLowerCase().split(' ')[0])) {
    score += 20;
  }

  score += Math.min(25, topSkills.filter((skill) => normalizedAbout.includes(skill.toLowerCase())).length * 5);

  if (normalizedAbout.includes('resultado') || normalizedAbout.includes('impact') || normalizedAbout.includes('entrega')) {
    score += 20;
  }

  return Math.min(100, score);
}

function scoreExperience(experienceCount: number): number {
  if (experienceCount >= 3) {
    return 90;
  }

  if (experienceCount === 2) {
    return 75;
  }

  if (experienceCount === 1) {
    return 55;
  }

  return 20;
}

function scoreSkills(skillCount: number): number {
  if (skillCount >= 12) {
    return 90;
  }

  if (skillCount >= 8) {
    return 75;
  }

  if (skillCount >= 4) {
    return 55;
  }

  return 25;
}

function buildSuggestions(
  input: LinkedinAuditInput,
  scores: Pick<LinkedinAudit, 'headlineScore' | 'aboutScore' | 'experienceScore' | 'skillsScore'>,
): LinkedinAuditSuggestions {
  const improvements = [
    ...(scores.headlineScore < 80
      ? [
          {
            area: 'Headline',
            title: 'Deixe cargo-alvo e stack visiveis',
            description: 'Use cargo, tecnologias principais e contexto internacional em uma frase curta.',
          },
        ]
      : []),
    ...(scores.aboutScore < 80
      ? [
          {
            area: 'Sobre',
            title: 'Mostre impacto e foco',
            description: 'Inclua resultados, tipo de produto, stack e paises/cargos que voce busca.',
          },
        ]
      : []),
    ...(scores.experienceScore < 80
      ? [
          {
            area: 'Experiencias',
            title: 'Estruture evidencias',
            description: 'Cada experiencia deve mostrar atividades, ferramentas e resultado entregue.',
          },
        ]
      : []),
    ...(scores.skillsScore < 80
      ? [
          {
            area: 'Skills',
            title: 'Priorize skills buscaveis',
            description: 'Adicione tecnologias e processos que aparecem nas vagas alvo.',
          },
        ]
      : []),
  ];

  return {
    strengths: [
      scores.headlineScore >= 80 ? 'Headline ja esta direcionada.' : '',
      scores.aboutScore >= 80 ? 'Resumo tem boa densidade profissional.' : '',
      scores.experienceScore >= 80 ? 'Experiencias suficientes para sustentar o perfil.' : '',
      scores.skillsScore >= 80 ? 'Inventario de skills esta forte.' : '',
    ].filter(Boolean),
    improvements,
    rewrittenHeadline: buildHeadline(input),
    rewrittenAbout: buildAbout(input),
  };
}

function buildHeadline(input: LinkedinAuditInput): string {
  const skills = input.topSkills.slice(0, 4).join(' | ');
  const countries = input.targetCountries.slice(0, 2).join('/');

  return `${input.targetRole || 'Software Developer'} | ${skills}${countries ? ` | Europa: ${countries}` : ''}`;
}

function buildAbout(input: LinkedinAuditInput): string {
  const skills = input.topSkills.slice(0, 8).join(', ');
  const countries = input.targetCountries.join(', ');

  return [
    `Sou ${input.targetRole || 'profissional de tecnologia'} com foco em entregas web, qualidade de codigo e colaboracao com times de produto.`,
    skills ? `Minha stack principal inclui ${skills}.` : '',
    countries ? `Busco oportunidades internacionais com foco em ${countries}.` : '',
    'Meu objetivo e transformar experiencia real em entregas claras, mensuraveis e relevantes para o negocio.',
  ]
    .filter(Boolean)
    .join(' ');
}
