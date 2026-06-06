# Setup Supabase e Gemini

Este documento sera atualizado conforme o MVP evoluir. Por enquanto, a aplicacao roda com login simulado quando Supabase ainda nao esta configurado.

## Supabase

### 1. Criar o projeto

1. Acesse https://supabase.com.
2. Crie uma conta ou entre com GitHub.
3. Clique em `New project`.
4. Nome sugerido: `resume-pilot`.
5. Escolha uma senha forte para o banco.
6. Selecione a regiao mais proxima dos usuarios iniciais.
7. Aguarde o projeto ficar ativo.

### 2. Copiar as chaves publicas

No painel do projeto:

1. Va em `Project Settings`.
2. Abra `API`.
3. Copie `Project URL`.
4. Copie `anon public key`.

Depois atualize:

```ts
// src/environments/environment.ts
export const environment = {
  production: false,
  supabase: {
    url: 'SUA_PROJECT_URL',
    anonKey: 'SUA_ANON_PUBLIC_KEY',
  },
};
```

Repita em `src/environments/environment.prod.ts` quando formos publicar.

Importante: a anon key pode ficar no frontend quando as regras RLS estiverem corretas. Chaves secretas nunca devem ir para o Angular.

### 3. Auth

No Supabase:

1. Va em `Authentication`.
2. Ative login por e-mail/senha.
3. Configure a URL local: `http://localhost:4200`.
4. Depois adicionaremos a URL do Cloudflare Pages.

### 4. Banco

As primeiras tabelas previstas:

- `professional_profiles`
- `experiences`
- `education`
- `skills`
- `jobs`
- `job_requirements`
- `applications`
- `cv_versions`
- `linkedin_audits`
- `ai_analysis_runs`
- `documents`

Antes de abrir testes externos, precisamos criar RLS para garantir que cada usuario veja apenas os proprios dados.

## Gemini Free

### 1. Criar chave

1. Acesse https://aistudio.google.com.
2. Entre com sua conta Google.
3. Crie uma API key.
4. Guarde a chave localmente.

Nunca coloque a chave Gemini no Angular. Ela deve ficar como segredo em Supabase Edge Functions.

### 2. Variavel na Edge Function

Quando o Supabase CLI estiver configurado, a chave deve ser cadastrada como secret:

```bash
supabase secrets set GEMINI_API_KEY=sua_chave
```

### 3. Fluxo previsto

```txt
Angular
  -> Supabase Edge Function
    -> Gemini API
      -> resposta estruturada para o usuario
```

Assim protegemos a chave e conseguimos limitar uso por usuario no futuro.

## Estado Atual

- Frontend Angular criado.
- Supabase SDK instalado.
- Login funciona em modo mock quando Supabase nao esta configurado.
- Edge Function placeholder criada em `supabase/functions/analyze-career-fit`.
- Ainda falta criar o projeto Supabase real e aplicar schema/RLS.
