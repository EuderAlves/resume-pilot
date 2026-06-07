# resumePilot - Guia do Produto e Engenharia

## Visao do Produto

O resumePilot e um copiloto de carreira internacional. A aplicacao guia pessoas que querem melhorar o LinkedIn, ajustar CVs para vagas especificas e entender o que esta funcionando ou travando suas buscas por oportunidades internacionais.

## Objetivo do MVP

Validar uma experiencia simples, clara e vendavel com:

- Homepage comercial para explicar o produto e converter usuarios.
- Login/cadastro.
- Perfil profissional base.
- Analise de vaga por texto ou link.
- Ajuste de CV para uma vaga.
- Auditoria inicial de LinkedIn.
- Pipeline de candidaturas.
- Dashboard com metricas de progresso e aderencia.

## Stack Inicial

- Frontend: Angular + TypeScript.
- UI: Angular Material/CDK + SCSS/Tailwind quando fizer sentido.
- Estado: Angular Signals e servicos por feature.
- Graficos: Chart.js ou ECharts.
- Backend MVP: Supabase Auth, Postgres, Storage e Edge Functions.
- IA: provider abstrato, iniciando com Gemini Free para testes fechados.
- Hospedagem frontend: Cloudflare Pages.
- Repositorio: GitHub.

## Roadmap Funcional

### Fase 1 - Base Vendavel

- Homepage comercial. `feito`
- Fluxo de login/cadastro. `feito`
- Cadastro real com Supabase Auth. `feito`
- Guards de rota e restauracao de sessao. `feito`
- Logout no dashboard. `feito`
- Estrutura visual do app logado. `feito`
- Dashboard inicial com cards e dados mockados. `feito`
- Documentacao de setup. `feito`

### Fase 2 - Perfil Profissional

- Cadastro do perfil macro. `feito`
- Persistencia do perfil em `professional_profiles`. `feito`
- Seed da planilha para usuario de validacao. `feito`
- Experiencias profissionais estruturadas. `feito parcial`
- Educacao, idiomas, skills e paises-alvo.
- Banco de evidencias profissionais reutilizaveis.

### Fase 3 - Analise de Vagas e CV

- Cadastro/importacao de vaga.
- Extracao de requisitos e palavras-chave.
- Score de aderencia perfil x vaga.
- Sugestoes de melhoria.
- Geracao de versoes de CV por vaga.

### Fase 4 - LinkedIn

- Auditoria de headline, sobre, experiencias e skills.
- Sugestoes em portugues, ingles e espanhol.
- Mensagens para recrutadores.
- Checklist de melhorias.

### Fase 5 - Pipeline e Inteligencia

- Kanban de candidaturas.
- Historico por empresa, pais, status e salario.
- Taxa de resposta.
- Alertas de follow-up.
- Insights sobre paises, cargos e requisitos mais recorrentes.

### Fase 6 - Planejamento Internacional

- Plano A/B/C por pais.
- Custos de mudanca.
- Reserva financeira.
- Checklist de embarque.
- Viabilidade por rota internacional.

## Regras de Arquitetura

- Usar Clean Code como padrao de leitura, nomeacao e organizacao.
- Preferir componentes pequenos, focados e reutilizaveis.
- Separar componentes de tela, componentes de UI e servicos de dominio.
- Manter regras de negocio fora dos templates.
- Seguir principios SOLID sem criar abstracoes prematuras.
- Modularizar por feature, nao por tipo tecnico quando a feature crescer.
- Usar interfaces/types para contratos entre camadas.
- Centralizar acesso a Supabase em servicos/gateways.
- Nunca expor chaves sensiveis no frontend.
- Chamadas de IA devem passar por Edge Functions ou backend seguro.
- Evitar duplicacao de logica entre componentes.
- Componentes inteligentes devem coordenar estado; componentes reutilizaveis devem receber inputs e emitir outputs.
- Preferir formularios reativos para fluxos complexos.
- Manter estados explicitos: loading, empty, success, error.

## Regras de Qualidade

- Criar testes unitarios para regras de negocio, servicos e componentes criticos.
- Testar transformacoes de dados e calculos de score.
- Validar build antes de concluir entregas importantes.
- Manter design limpo, intuitivo e responsivo.
- Nao criar telas meramente decorativas: cada tela deve ajudar o usuario a agir.
- Escrever textos claros, orientados a carreira internacional e sem promessas irreais.
- Tratar dados profissionais e documentos como informacoes sensiveis.

## Convencoes Iniciais

- Nome do app: resumePilot.
- Idioma inicial da interface: portugues do Brasil.
- Tom do produto: direto, confiante e acolhedor.
- MVP deve funcionar com dados mockados quando Supabase ainda nao estiver configurado.
- Todas as integracoes externas devem ser substituiveis por adaptadores.

## Decisoes Pendentes

- Escolher o modelo Gemini inicial.
- Definir politica de confirmacao de e-mail no Supabase Auth.
- Definir schema final do banco.
- Configurar Cloudflare Pages.
- Definir estrategia de monetizacao e limite de uso por plano.

## Estado Supabase

- Projeto criado: `resume-pilot`.
- URL do projeto: `https://antmqmgkvirbiopxkytx.supabase.co`.
- Anon public key configurada nos environments.
- Migration inicial preparada em `supabase/migrations/20260606010000_initial_resume_pilot_schema.sql`.
- Migration inicial aplicada no SQL Editor.
- Cadastro real validado na aplicacao.
