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
- Dashboard inicial criado com dados mockados.
- Edge Function placeholder criada para analise de carreira/vaga.
- Asset visual da homepage criado e salvo em `public/images`.
- Testes unitarios iniciais criados.
- Build e testes validados.
- Repositorio GitHub criado e conectado.

### Falta Fazer

- Confirmar configuracao final do Supabase Auth para e-mail/senha.
- Criar tela de onboarding do perfil profissional.
- Criar CRUD de experiencias, educacao, idiomas e skills.
- Criar cadastro/importacao de vagas.
- Criar score de aderencia perfil x vaga.
- Criar gerador de versoes de CV por vaga.
- Criar auditoria de LinkedIn.
- Conectar Gemini na Edge Function.
- Criar storage para documentos e CVs.
- Criar pipeline real de candidaturas.
- Criar deploy na Cloudflare Pages.

## Estado Atual

O MVP tem uma homepage comercial, fluxo de login/cadastro real com Supabase, dashboard inicial e base de banco preparada.

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
| `src/environments/environment.ts` | Configuracao local/desenvolvimento. |
| `src/environments/environment.prod.ts` | Configuracao de producao. |
| `public/images/career-copilot-hero.png` | Imagem principal da homepage/login. |
| `supabase/migrations` | SQL de schema, tabelas, indices e RLS. |
| `supabase/functions/analyze-career-fit` | Edge Function para futura analise com Gemini. |
| `docs/RESUME_PILOT_GUIDE.md` | Guia de produto, roadmap e regras de engenharia. |
| `docs/SETUP_SUPABASE_GEMINI.md` | Passos de configuracao do Supabase e Gemini. |

## Fluxos Principais

### Roteamento

```txt
/       -> LandingPage
/login  -> LoginPage com guestGuard
/app    -> DashboardPage com authGuard
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
  -> product-content.ts
    -> metricas mockadas
    -> pipeline mockado
    -> proximas acoes
```

Arquivos responsaveis:

```txt
src/app/features/dashboard/dashboard-page
src/app/core/data/product-content.ts
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
