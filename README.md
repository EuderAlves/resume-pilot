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
- URL do projeto Supabase configurada.
- Migration inicial de banco/RLS criada.
- Edge Function placeholder criada.

## Proximos Passos

- Copiar a `anon public key` do Supabase para os environments.
- Aplicar a migration inicial no SQL Editor do Supabase.
- Configurar Auth.
- Conectar Gemini via Edge Function.
