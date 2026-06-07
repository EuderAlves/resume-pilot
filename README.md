# resumePilot

Copiloto de carreira internacional para ajudar pessoas a melhorar o LinkedIn, adaptar CVs para vagas especificas e acompanhar candidaturas com dados, clareza e estrategia.

## Menu

- [Visao do Produto](#visao-do-produto)
- [Stack](#stack)
- [Roadmap](#roadmap)
- [Estado Atual](#estado-atual)
- [Arquitetura](#arquitetura)
- [Mapa de Pastas](#mapa-de-pastas)
- [Fluxos Principais](#fluxos-principais)
- [Supabase](#supabase)
- [Como Rodar](#como-rodar)
- [Deploy Beta](#deploy-beta)
- [Testes e Build](#testes-e-build)
- [Documentacao Complementar](#documentacao-complementar)

## Visao do Produto

O resumePilot e um SaaS/MVP para guiar profissionais em busca de oportunidades internacionais.

O produto deve responder tres perguntas principais:

- Meu perfil esta claro para recrutadores?
- Meu CV esta alinhado com a vaga que quero aplicar?
- Minha estrategia de candidaturas esta funcionando?

## Stack

- Frontend: Angular 20 + TypeScript.
- UI: SCSS, Angular Material/CDK e icones Lucide.
- Estado: Angular Signals e servicos por feature.
- Backend MVP: Supabase Auth, Postgres, Storage e Edge Functions.
- IA: Gemini API via Edge Function.
- Hospedagem planejada: Cloudflare Pages.
- Banco: Supabase Postgres com RLS.

## Roadmap

### Ja Foi Feito

- Projeto Angular criado.
- Homepage comercial criada para vender o produto.
- Login/cadastro criado.
- Login mockado mantido como fallback quando Supabase nao esta configurado.
- Supabase conectado com URL e anon public key.
- Projeto Supabase criado: `resume-pilot`.
- Migration inicial criada com tabelas e RLS.
- Schema inicial aplicado no Supabase via SQL Editor.
- Cadastro real testado pela tela `/login`.
- Guards de rota criados para proteger a area logada.
- Sessao do Supabase restaurada ao atualizar a pagina.
- Logout criado no dashboard.
- Dashboard inicial criado com metricas reais quando ha dados no Supabase.
- Tela de onboarding do perfil profissional criada.
- Perfil profissional salvo na tabela `professional_profiles`.
- Serviço de perfil criado com mappers testados.
- Seed SQL criado a partir da planilha para o usuario `euder.alv@gmail.com`.
- CRUD inicial de experiencias profissionais criado.
- CRUD inicial de formacoes criado.
- CRUD inicial de skills criado.
- CRUD inicial de vagas criado com descricao colada pelo usuario.
- Analise local inicial criada para extrair requisitos, idiomas, senioridade, modelo e score.
- Pipeline real de candidaturas criado.
- Gerador local de versoes de CV por vaga criado.
- Auditoria local de LinkedIn criada.
- Edge Function placeholder criada para analise de carreira/vaga.
- Asset visual da homepage criado e salvo em `public/images`.
- Testes unitarios iniciais criados.
- Build e testes validados.
- Repositorio GitHub criado e conectado.

### Falta Fazer

- Confirmar configuracao final do Supabase Auth para e-mail/senha.
- Evoluir score de aderencia perfil x vaga com IA.
- Conectar Gemini na Edge Function.
- Criar storage para documentos e CVs.
- Criar deploy na Cloudflare Pages.

## Estado Atual

O MVP tem uma homepage comercial, fluxo de login/cadastro real com Supabase, dashboard com metricas reais, onboarding do perfil profissional, CRUD inicial de experiencias, formacoes, skills, vagas por descricao colada, pipeline de candidaturas, gerador de CV e auditoria de LinkedIn.

O login usa Supabase quando `url` e `anonKey` estao preenchidos nos environments. Caso a configuracao esteja vazia, o `AuthService` entra em modo mock para desenvolvimento local.

## Arquitetura

A arquitetura atual segue uma separacao simples para o MVP, com espaco para crescer sem reescrever a base.

```txt
Angular App
  -> Routes
    -> Features
      -> Marketing
      -> Auth
      -> Dashboard
      -> Profile
      -> Experiences
      -> Education
      -> Skills
      -> Jobs
      -> Applications
      -> CV
      -> LinkedIn
  -> Core
    -> Auth Service
    -> Supabase Service
    -> Product Content
  -> Supabase
    -> Auth
    -> Postgres + RLS
    -> Edge Functions
    -> Storage
```

### Principios

- Componentes de tela ficam em `features`.
- Servicos compartilhados ficam em `core`.
- Acesso ao Supabase fica centralizado em `SupabaseService`.
- Regras de autenticacao ficam em `AuthService`.
- Textos e dados mockados do produto ficam em `product-content.ts`.
- Chaves secretas de IA nunca devem ir para o Angular.
- Chamadas de IA devem passar por Edge Functions.
- RLS protege dados por usuario no banco.

## Mapa de Pastas

| Caminho | Responsabilidade |
|---|---|
| `src/app/app.routes.ts` | Define as rotas principais: homepage, login e app logado. |
| `src/app/app.config.ts` | Configuracao global da aplicacao Angular. |
| `src/app/core/auth/auth.service.ts` | Login, cadastro, usuario atual e fallback mock. |
| `src/app/core/auth/auth.guard.ts` | Protege rotas privadas e redireciona usuarios autenticados. |
| `src/app/core/auth/auth.service.spec.ts` | Testes unitarios do servico de autenticacao. |
| `src/app/core/supabase/supabase.service.ts` | Cria e centraliza o client Supabase. |
| `src/app/core/data/product-content.ts` | Conteudo mockado da homepage e dashboard. |
| `src/app/features/marketing/landing-page` | Homepage comercial do produto. |
| `src/app/features/auth/login-page` | Tela de login/cadastro. |
| `src/app/features/dashboard/dashboard-page` | Dashboard inicial do usuario logado. |
| `src/app/features/profile/profile-onboarding-page` | Tela de onboarding/edicao do perfil profissional base. |
| `src/app/features/profile/data` | Modelos, mappers e servico de persistencia do perfil profissional. |
| `src/app/features/experiences/experiences-page` | CRUD inicial de experiencias profissionais. |
| `src/app/features/experiences/data` | Modelos, mappers e servico de persistencia de experiencias. |
| `src/app/features/education/education-page` | CRUD inicial de formacoes. |
| `src/app/features/education/data` | Modelos, mappers e servico de persistencia de formacoes. |
| `src/app/features/skills/skills-page` | CRUD inicial de skills. |
| `src/app/features/skills/data` | Modelos, mappers e servico de persistencia de skills. |
| `src/app/features/jobs/jobs-page` | CRUD inicial de vagas com descricao colada pelo usuario. |
| `src/app/features/jobs/data` | Modelos, mappers, analisador local e servico de persistencia de vagas. |
| `src/app/features/applications/applications-page` | Pipeline real de candidaturas. |
| `src/app/features/applications/data` | Modelos, mappers e servico de persistencia de candidaturas. |
| `src/app/features/cv/cv-page` | Geracao e historico de CVs por vaga. |
| `src/app/features/cv/data` | Gerador local, mappers e servico de persistencia de CVs. |
| `src/app/features/linkedin/linkedin-page` | Auditoria de LinkedIn com score e sugestoes. |
| `src/app/features/linkedin/data` | Analisador local, mappers e servico de auditoria LinkedIn. |
| `src/environments/environment.ts` | Configuracao local/desenvolvimento. |
| `src/environments/environment.prod.ts` | Configuracao de producao. |
| `public/images/career-copilot-hero.png` | Imagem principal da homepage/login. |
| `supabase/migrations` | SQL de schema, tabelas, indices e RLS. |
| `supabase/seeds` | Seeds opcionais para popular dados de teste. |
| `supabase/functions/analyze-career-fit` | Edge Function para futura analise com Gemini. |
| `docs/RESUME_PILOT_GUIDE.md` | Guia de produto, roadmap e regras de engenharia. |
| `docs/SETUP_SUPABASE_GEMINI.md` | Passos de configuracao do Supabase e Gemini. |

## Fluxos Principais

### Roteamento

```txt
/       -> LandingPage
/login  -> LoginPage com guestGuard
/app    -> DashboardPage com authGuard
/app/profile -> ProfileOnboardingPage com authGuard
/app/experiences -> ExperiencesPage com authGuard
/app/education -> EducationPage com authGuard
/app/skills -> SkillsPage com authGuard
/app/jobs -> JobsPage com authGuard
/app/applications -> ApplicationsPage com authGuard
/app/cv -> CvPage com authGuard
/app/linkedin -> LinkedinPage com authGuard
```

Arquivo responsavel:

```txt
src/app/app.routes.ts
```

### Autenticacao

```txt
LoginPage
  -> AuthService
    -> SupabaseService
      -> Supabase Auth
```

Ao abrir ou atualizar a aplicacao:

```txt
AuthService
  -> Supabase Auth getSession()
    -> restaura usuario atual
```

Ao sair:

```txt
DashboardPage
  -> AuthService.signOut()
    -> Supabase Auth signOut()
      -> redireciona para /login
```

Se o Supabase nao estiver configurado:

```txt
LoginPage
  -> AuthService
    -> cria sessao mock local
```

Arquivos responsaveis:

```txt
src/app/features/auth/login-page
src/app/core/auth/auth.service.ts
src/app/core/auth/auth.guard.ts
src/app/core/supabase/supabase.service.ts
```

### Dashboard

```txt
DashboardPage
  -> DashboardDataService
    -> jobs, applications, cv_versions, linkedin_audits
    -> metricas reais
  -> product-content.ts
    -> fallback e proximas acoes
    -> proximas acoes
```

Arquivos responsaveis:

```txt
src/app/features/dashboard/dashboard-page
src/app/core/data/product-content.ts
src/app/features/dashboard/data/dashboard-data.service.ts
```

### Perfil Profissional

```txt
ProfileOnboardingPage
  -> profile-form.mapper.ts
    -> converte campos do formulario
  -> ProfessionalProfileService
    -> SupabaseService
      -> professional_profiles
```

Arquivos responsaveis:

```txt
src/app/features/profile/profile-onboarding-page
src/app/features/profile/data/professional-profile.service.ts
src/app/features/profile/data/profile-form.mapper.ts
```

### Experiencias Profissionais

```txt
ExperiencesPage
  -> experience-form.mapper.ts
    -> converte ferramentas, atividades, resultados e bullets
  -> ProfessionalExperienceService
    -> SupabaseService
      -> experiences
```

Arquivos responsaveis:

```txt
src/app/features/experiences/experiences-page
src/app/features/experiences/data/professional-experience.service.ts
src/app/features/experiences/data/experience-form.mapper.ts
```

### Formacoes

```txt
EducationPage
  -> education-form.mapper.ts
    -> converte campos do formulario
  -> EducationService
    -> SupabaseService
      -> education
```

Arquivos responsaveis:

```txt
src/app/features/education/education-page
src/app/features/education/data/education.service.ts
src/app/features/education/data/education-form.mapper.ts
```

### Skills

```txt
SkillsPage
  -> skill-form.mapper.ts
    -> converte categoria, nivel e evidencia
  -> ProfessionalSkillService
    -> SupabaseService
      -> skills
```

Arquivos responsaveis:

```txt
src/app/features/skills/skills-page
src/app/features/skills/data/professional-skill.service.ts
src/app/features/skills/data/skill-form.mapper.ts
```

### Vagas

```txt
JobsPage
  -> usuario cola a descricao da vaga
  -> job-description-analyzer.ts
    -> extrai requisitos, diferenciais, idiomas e score inicial
  -> JobOpportunityService
    -> SupabaseService
      -> jobs
```

Arquivos responsaveis:

```txt
src/app/features/jobs/jobs-page
src/app/features/jobs/data/job-opportunity.service.ts
src/app/features/jobs/data/job-description-analyzer.ts
src/app/features/jobs/data/job-form.mapper.ts
```

### Pipeline

```txt
ApplicationsPage
  -> ApplicationService
    -> SupabaseService
      -> applications
```

Arquivos responsaveis:

```txt
src/app/features/applications/applications-page
src/app/features/applications/data/application.service.ts
src/app/features/applications/data/application-form.mapper.ts
```

### CV por Vaga

```txt
CvPage
  -> cv-generator.ts
    -> usa perfil, experiencias, formacoes, skills e vaga
  -> CvVersionService
    -> SupabaseService
      -> cv_versions
```

Arquivos responsaveis:

```txt
src/app/features/cv/cv-page
src/app/features/cv/data/cv-generator.ts
src/app/features/cv/data/cv-version.service.ts
```

### LinkedIn

```txt
LinkedinPage
  -> linkedin-audit-analyzer.ts
    -> calcula score e sugestoes locais
  -> LinkedinAuditService
    -> SupabaseService
      -> linkedin_audits
```

Arquivos responsaveis:

```txt
src/app/features/linkedin/linkedin-page
src/app/features/linkedin/data/linkedin-audit-analyzer.ts
src/app/features/linkedin/data/linkedin-audit.service.ts
```

### Analise com IA

Fluxo planejado:

```txt
Angular
  -> Supabase Edge Function
    -> Gemini API
      -> resposta estruturada
        -> score, gaps, pontos fortes e proximas acoes
```

Arquivo responsavel:

```txt
supabase/functions/analyze-career-fit/index.ts
```

## Supabase

Projeto:

```txt
resume-pilot
https://antmqmgkvirbiopxkytx.supabase.co
```

### Tabelas Iniciais

- `professional_profiles`
- `experiences`
- `education`
- `skills`
- `jobs`
- `applications`
- `cv_versions`
- `linkedin_audits`
- `ai_analysis_runs`
- `documents`

### Seed da Planilha

Foi criado um seed opcional com dados extraidos da planilha inicial:

```txt
supabase/seeds/20260606103000_seed_euder_resume_data.sql
```

Esse seed procura o usuario `euder.alv@gmail.com` em `auth.users` e popula:

- perfil profissional;
- formacao;
- skills;
- experiencias em CI&T, NTT-Data e EPTV.
- uma vaga de referencia para testar a tela de vagas.
- uma candidatura vinculada a vaga de referencia.
- uma versao de CV gerada para a vaga de referencia.
- uma auditoria de LinkedIn de exemplo.

Para aplicar:

1. Confirme que o usuario `euder.alv@gmail.com` ja existe no Supabase Auth.
2. Abra o SQL Editor do Supabase.
3. Cole o conteudo do seed.
4. Clique em `Run`.

### Seguranca

Todas as tabelas iniciais usam RLS.

Regra geral:

```sql
auth.uid() = user_id
```

Isso garante que cada usuario autenticado acesse apenas os proprios dados.

## Como Rodar

Instale as dependencias:

```bash
npm install
```

Rode o projeto:

```bash
npm start
```

Abra:

```txt
http://localhost:4200/
```

## Deploy Beta

Guia para publicar o MVP no Cloudflare Pages:

```txt
docs/DEPLOY_CLOUDFLARE_BETA.md
```

Manual para enviar aos usuarios beta:

```txt
docs/BETA_TEST_MANUAL.md
```

## Testes e Build

Rodar build:

```bash
npm run build
```

Rodar testes:

```bash
npm test -- --watch=false
```

## Documentacao Complementar

- Roadmap e regras: `docs/RESUME_PILOT_GUIDE.md`
- Setup Supabase/Gemini: `docs/SETUP_SUPABASE_GEMINI.md`
- Deploy beta: `docs/DEPLOY_CLOUDFLARE_BETA.md`
- Manual de teste beta: `docs/BETA_TEST_MANUAL.md`
