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

Projeto atual:

```txt
Project URL: https://antmqmgkvirbiopxkytx.supabase.co
Anon public key: configurada em src/environments/environment.ts e environment.prod.ts
```

Depois atualize:

```ts
// src/environments/environment.ts
export const environment = {
  production: false,
  supabase: {
    url: 'https://antmqmgkvirbiopxkytx.supabase.co',
    anonKey: 'SUA_ANON_PUBLIC_KEY',
  },
};
```

Repita em `src/environments/environment.prod.ts` quando formos publicar.

Importante: a anon key pode ficar no frontend quando as regras RLS estiverem corretas. Chaves secretas nunca devem ir para o Angular.

Nunca use a `service_role key` no frontend, no GitHub ou em mensagens de chat.

### 3. Auth

No Supabase:

1. Va em `Authentication`.
2. Ative login por e-mail/senha.
3. Configure a URL local: `http://localhost:4200`.
4. Depois adicionaremos a URL do Cloudflare Pages.

### 4. Aplicar o schema inicial

Opcao mais simples pelo painel:

1. Abra o projeto `resume-pilot` no Supabase.
2. Va em `SQL Editor`.
3. Clique em `New query`.
4. Copie o conteudo de `supabase/migrations/20260606010000_initial_resume_pilot_schema.sql`.
5. Cole no editor.
6. Clique em `Run`.

Depois disso, o Supabase deve criar as tabelas:

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

Todas ja ficam com RLS ligado, permitindo que cada usuario acesse apenas os proprios dados.

### 5. Banco

As primeiras tabelas previstas:

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
- Login funciona com Supabase quando URL e anon key estao configuradas.
- Login ainda pode funcionar em modo mock se a configuracao do Supabase estiver vazia.
- Edge Function placeholder criada em `supabase/functions/analyze-career-fit`.
- Schema/RLS inicial aplicado.
- Seed opcional da planilha criado em `supabase/seeds/20260606103000_seed_euder_resume_data.sql`.

## Seed da Planilha

Para popular dados reais de validacao do usuario `euder.alv@gmail.com`:

1. Confirme que o cadastro desse e-mail ja existe em `Authentication > Users`.
2. Abra `SQL Editor`.
3. Crie uma nova query.
4. Cole o conteudo de `supabase/seeds/20260606103000_seed_euder_resume_data.sql`.
5. Clique em `Run`.

O seed atualiza o perfil e insere dados de formacao, skills, experiencias, vaga de referencia, candidatura, versao de CV e auditoria LinkedIn extraidos ou derivados da planilha inicial.
