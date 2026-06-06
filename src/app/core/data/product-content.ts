import type { Type } from '@angular/core';
import {
  LucideChartColumnIncreasing,
  LucideClipboardCheck,
  LucideFileText,
  LucideGlobe,
  LucideLayoutDashboard,
  LucideMapPinned,
  LucideShieldCheck,
  LucideSparkles,
  LucideTarget,
  LucideUserRoundSearch,
} from '@lucide/angular';

export interface LandingMetric {
  readonly value: string;
  readonly label: string;
}

export interface ProductFeature {
  readonly icon: Type<unknown>;
  readonly title: string;
  readonly description: string;
}

export interface WorkflowStep {
  readonly title: string;
  readonly description: string;
}

export interface DashboardMetric {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}

export interface PipelineColumn {
  readonly label: string;
  readonly count: number;
  readonly tone: 'neutral' | 'warning' | 'success' | 'danger';
}

export const landingMetrics: readonly LandingMetric[] = [
  { value: '1', label: 'perfil profissional centralizado' },
  { value: '3', label: 'idiomas pensados desde o inicio' },
  { value: '360', label: 'visao de LinkedIn, CV e candidaturas' },
];

export const productFeatures: readonly ProductFeature[] = [
  {
    icon: LucideUserRoundSearch,
    title: 'Auditoria de LinkedIn',
    description: 'Ajuste headline, sobre, experiencias e skills para ser encontrado por recrutadores.',
  },
  {
    icon: LucideFileText,
    title: 'CV por vaga',
    description: 'Compare seu perfil com a vaga e gere uma versao alinhada sem inventar experiencia.',
  },
  {
    icon: LucideTarget,
    title: 'Score de aderencia',
    description: 'Veja requisitos atendidos, lacunas e prioridades antes de se candidatar.',
  },
  {
    icon: LucideClipboardCheck,
    title: 'Pipeline de aplicacoes',
    description: 'Organize vagas, status, follow-ups, observacoes e versoes de CV em um so lugar.',
  },
  {
    icon: LucideChartColumnIncreasing,
    title: 'Radar de mercado',
    description: 'Entenda paises, cargos, empresas e tecnologias com maior sinal para sua busca.',
  },
  {
    icon: LucideMapPinned,
    title: 'Plano internacional',
    description: 'Conecte carreira, rota de mudanca, custos e proximas acoes com clareza.',
  },
];

export const workflowSteps: readonly WorkflowStep[] = [
  {
    title: 'Mapeie seu perfil',
    description: 'Transforme experiencias, resultados, idiomas e objetivos em dados reutilizaveis.',
  },
  {
    title: 'Analise a vaga',
    description: 'Cole a descricao da oportunidade e veja palavras-chave, requisitos e aderencia.',
  },
  {
    title: 'Aplique com estrategia',
    description: 'Ajuste CV, LinkedIn e follow-up enquanto acompanha o que melhora sua conversao.',
  },
];

export const trustFeatures: readonly ProductFeature[] = [
  {
    icon: LucideShieldCheck,
    title: 'Dados tratados com cuidado',
    description: 'Documentos, experiencias e analises ficam associados ao usuario autenticado.',
  },
  {
    icon: LucideSparkles,
    title: 'IA como copiloto',
    description: 'A IA sugere melhorias, mas o sistema preserva fatos reais da trajetoria.',
  },
  {
    icon: LucideGlobe,
    title: 'Pensado para carreira global',
    description: 'Fluxos preparados para portugues, ingles, espanhol e candidaturas internacionais.',
  },
  {
    icon: LucideLayoutDashboard,
    title: 'Produto orientado por metricas',
    description: 'O dashboard mostra progresso, gargalos e sinais de mercado para decidir melhor.',
  },
];

export const dashboardMetrics: readonly DashboardMetric[] = [
  { label: 'Aderencia media', value: '68%', detail: 'Mock inicial para validar o layout' },
  { label: 'CVs ajustados', value: '4', detail: 'Versoes por vaga ficarao salvas' },
  { label: 'Aplicacoes ativas', value: '12', detail: 'Com status e follow-up' },
  { label: 'LinkedIn', value: '72/100', detail: 'Score sera calculado pela auditoria' },
];

export const pipelineColumns: readonly PipelineColumn[] = [
  { label: 'Salvas', count: 8, tone: 'neutral' },
  { label: 'CV ajustado', count: 4, tone: 'warning' },
  { label: 'Aplicado', count: 12, tone: 'success' },
  { label: 'Negado', count: 3, tone: 'danger' },
];

export const nextActions: readonly string[] = [
  'Completar perfil macro com idiomas, paises-alvo e senioridade.',
  'Importar a primeira vaga de referencia para testar o score.',
  'Configurar Supabase Auth antes de abrir testes externos.',
];

export const navFeatures: readonly string[] = [
  'Perfil',
  'Vagas',
  'CVs',
  'LinkedIn',
  'Pipeline',
  'Mercado',
];
