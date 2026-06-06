# resumePilot

Copiloto de carreira internacional para ajustar LinkedIn, adaptar CVs por vaga e acompanhar candidaturas com dados.

## Stack

- Angular 20 + TypeScript
- Supabase Auth/Postgres/Storage/Edge Functions
- Gemini API via Edge Function
- Cloudflare Pages para hospedagem do frontend

## Rodar localmente

```bash
npm start
```

Abra `http://localhost:4200/`.

## Build

```bash
npm run build
```

## Testes

```bash
npm test -- --watch=false
```

## Documentacao do Produto

- Roadmap e regras: `docs/RESUME_PILOT_GUIDE.md`
- Setup Supabase/Gemini: `docs/SETUP_SUPABASE_GEMINI.md`

## Estado Atual

- Homepage comercial criada.
- Login/cadastro em modo mock enquanto Supabase nao esta configurado.
- Dashboard inicial com dados mockados.
- Supabase SDK instalado.
- Edge Function placeholder criada.

## Proximos Passos

- Criar projeto no Supabase.
- Configurar Auth e RLS.
- Criar schema inicial.
- Conectar Gemini via Edge Function.
- Criar repositorio remoto no GitHub.
