# Deploy Beta - resumePilot

Este guia sobe o MVP do resumePilot para uma URL publica gratuita usando Cloudflare conectado ao GitHub.

## Objetivo

Publicar uma versao beta para 3 usuarios reais testarem o fluxo principal:

- cadastro/login;
- perfil;
- experiencias, formacoes e skills;
- vagas;
- pipeline;
- CV por vaga;
- auditoria de LinkedIn.

## Pre-requisitos

- Repositorio GitHub atualizado: `https://github.com/EuderAlves/resume-pilot`
- Projeto Supabase ativo: `resume-pilot`
- Build local passando:

```bash
npm run build
npm test -- --watch=false
```

## 1. Criar o projeto no Cloudflare

Existem dois caminhos validos no Cloudflare:

- `Pages`, que gera uma URL parecida com `https://resume-pilot.pages.dev`.
- `Workers Static Assets`, que gera uma URL parecida com `https://resume-pilot.euder-alv.workers.dev`.

Se a URL gerada terminou com `.workers.dev`, use a configuracao de Workers abaixo. Este e o caminho que esta ativo agora no beta.

### Opcao A: Workers Static Assets

1. Acesse `https://dash.cloudflare.com`.
2. Entre na conta.
3. Va em `Workers & Pages`.
4. Clique em `Create application`.
5. Selecione o fluxo de `Workers` conectado ao GitHub.
6. Clique em `Connect to Git`.
7. Conecte sua conta GitHub.
8. Escolha o repositorio `resume-pilot`.
9. Configure:

```txt
Worker name: resume-pilot
Production branch: main
Framework preset: Angular ou None
Build command: npm run build
Deploy command: npm run cloudflare:deploy
Root directory: /
```

10. Em `Environment variables`, adicione:

```txt
NODE_VERSION=22.16.0
```

11. Clique em `Save and Deploy`.

O arquivo `wrangler.jsonc` do projeto ja aponta o Cloudflare para a pasta correta:

```txt
./dist/resume-pilot/browser
```

Tambem esta configurado como SPA, entao rotas como `/login`, `/app/jobs` e `/app/cv` devem abrir mesmo ao atualizar a pagina.

### Opcao B: Cloudflare Pages

Se voce preferir criar um projeto Pages, use:

```txt
Project name: resume-pilot
Production branch: main
Framework preset: Angular ou None
Build command: npm run build
Build output directory: dist/resume-pilot/browser
Root directory: /
NODE_VERSION=22.16.0
```

## 2. Confirmar URL publicada

Ao final do deploy, o Cloudflare deve gerar uma URL parecida com:

```txt
https://resume-pilot.pages.dev
https://resume-pilot.euder-alv.workers.dev
```

Abra essa URL e valide:

- homepage carrega;
- botao de login abre `/login`;
- atualizar a pagina em `/login` nao gera 404;
- depois do login, atualizar `/app`, `/app/jobs` e `/app/cv` nao gera 404.

Para Workers Static Assets, o fallback de SPA esta em `wrangler.jsonc`.

## 3. Configurar Supabase Auth para producao

No Supabase:

1. Abra o projeto `resume-pilot`.
2. Va em `Authentication`.
3. Abra `URL Configuration`.
4. Em `Site URL`, coloque a URL do Cloudflare:

```txt
https://resume-pilot.pages.dev
https://resume-pilot.euder-alv.workers.dev
```

5. Em `Redirect URLs`, adicione:

```txt
https://resume-pilot.pages.dev/**
https://resume-pilot.euder-alv.workers.dev/**
http://localhost:4200/**
```

6. Salve.

Se a confirmacao de e-mail estiver ativa, os usuarios podem precisar confirmar o cadastro pelo e-mail antes de entrar.

## 4. Preparar os 3 usuarios de teste

Opcao A: cada tester cria a propria conta pela tela `/login`.

Opcao B: voce cria os usuarios no Supabase:

1. `Authentication > Users`
2. `Add user`
3. Informe e-mail e senha temporaria
4. Marque e-mail como confirmado, se essa opcao estiver disponivel
5. Envie a senha temporaria para o tester

Para teste real, prefira que cada usuario use os proprios dados profissionais, mas oriente a nao inserir documentos sensiveis ainda.

## 5. Dados de validacao do usuario Euder

Para validar com seu usuario:

1. Confirme que `euder.alv@gmail.com` existe em `Authentication > Users`.
2. Abra `SQL Editor`.
3. Execute:

```txt
supabase/seeds/20260606103000_seed_euder_resume_data.sql
```

Esse seed popula perfil, experiencias, formacoes, skills, vaga, candidatura, CV e auditoria LinkedIn.

## 6. Checklist antes de enviar aos testers

- `npm run build` passou localmente.
- `npm test -- --watch=false` passou localmente.
- Deploy Cloudflare finalizou sem erro.
- URL do Cloudflare abre a homepage.
- Supabase Auth tem `Site URL` e `Redirect URLs` configuradas.
- Cadastro real foi testado em producao.
- Login real foi testado em producao.
- Rotas internas funcionam ao atualizar a pagina.

## Correcao: erro do Wrangler com Node 20

Se o deploy mostrar:

```txt
Wrangler requires at least Node.js v22.0.0. You are using v20.20.0.
```

Corrija no Cloudflare:

1. Abra `Workers & Pages`.
2. Abra o projeto `resume-pilot`.
3. Va em `Settings`.
4. Abra `Build & deployments`.
5. Em `Environment variables`, troque:

```txt
NODE_VERSION=20.20.0
```

por:

```txt
NODE_VERSION=22.16.0
```

6. Salve.
7. Rode `Retry deployment`.

O projeto tambem tem `.node-version` com `22.16.0`, entao novos deploys devem usar Node 22 mesmo se a variavel nao estiver configurada.

## Correcao: deploy com sucesso, mas URL abre 404

Se o deploy finalizar com sucesso, mas a URL `workers.dev` abrir 404, o Cloudflare provavelmente publicou um Worker sem saber qual pasta deve servir como assets estaticos.

Confirme no Cloudflare:

1. Abra `Workers & Pages`.
2. Abra o projeto `resume-pilot`.
3. Va em `Settings`.
4. Abra `Build`.
5. Confira:

```txt
Build command: npm run build
Deploy command: npm run cloudflare:deploy
Root directory: /
```

6. Salve.
7. Faca novo deploy do commit mais recente.

No repositorio, o arquivo `wrangler.jsonc` deve existir com:

```txt
assets.directory = ./dist/resume-pilot/browser
assets.not_found_handling = single-page-application
```

Isso e necessario porque o Angular gera o `index.html` dentro de `dist/resume-pilot/browser`, nao diretamente em `dist/resume-pilot`.

## Correcao: erro `Invalid _redirects configuration`

Se o deploy em Workers falhar com:

```txt
Invalid _redirects configuration:
Line 1: Infinite loop detected in this rule.
```

O motivo e que o arquivo `public/_redirects` e interpretado como uma configuracao especial pelo Workers Static Assets. Esse arquivo era comum no Cloudflare Pages, mas no Workers ele conflita com o fallback de SPA.

Para resolver, o projeto nao deve ter `public/_redirects` enquanto estiver usando Workers Static Assets.

```txt
public/_redirects removido
```

O fallback correto fica em `wrangler.jsonc`:

```txt
assets.not_found_handling = single-page-application
```

Se no futuro voce criar um projeto Cloudflare Pages separado, ai sim pode recriar `_redirects` apenas para o deploy Pages.

## 7. O que ainda nao esta no beta

- Gemini real ainda nao esta conectado.
- Upload/download de PDF/DOCX ainda nao esta ativo.
- Importacao automatica por link de vaga nao faz parte do MVP.
- O CV gerado ainda fica estruturado dentro do app, nao exportado em PDF.
