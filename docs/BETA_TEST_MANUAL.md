# Manual de Teste Beta - resumePilot

Obrigado por testar o resumePilot. A ideia deste beta e validar se o produto ajuda uma pessoa a organizar sua busca internacional, melhorar LinkedIn, adaptar CV e acompanhar candidaturas.

## Antes de comecar

- Use dados profissionais reais, mas nao coloque informacoes sensiveis.
- Nao envie documentos pessoais, passaporte, contratos, dados bancarios ou informacoes confidenciais de empresas.
- O teste deve levar entre 30 e 45 minutos.
- Anote tudo que parecer confuso, quebrado, lento ou pouco util.

## Acesso

URL:

```txt
COLE_AQUI_A_URL_DO_CLOUDFLARE
```

Crie sua conta em `Login / Cadastro` usando e-mail e senha.

## O que testar

### 1. Homepage

Verifique:

- A proposta do produto ficou clara?
- Voce entendeu que o app ajuda com LinkedIn, CV, vagas e candidaturas?
- O botao para entrar/cadastrar esta facil de encontrar?

Feedback esperado:

```txt
A homepage me convenceu a testar? Sim/Nao. Por que?
```

### 2. Cadastro e Login

Teste:

1. Criar uma conta.
2. Sair.
3. Entrar novamente.
4. Atualizar a pagina dentro do app.

Verifique:

- Cadastro funcionou?
- Login funcionou?
- A sessao continuou ativa ao atualizar a pagina?
- Alguma mensagem ficou confusa?

### 3. Perfil

Abra `Perfil`.

Preencha:

- nome;
- headline;
- cargo alvo;
- senioridade;
- paises alvo;
- localizacao;
- objetivo de relocacao;
- idiomas;
- resumo profissional.

Verifique:

- Os campos fazem sentido?
- Faltou algum campo importante?
- O salvamento funcionou?
- Ao sair e voltar, os dados continuam la?

### 4. Experiencias

Abra `Experiencias`.

Cadastre pelo menos 1 experiencia profissional.

Inclua:

- empresa;
- cargo;
- periodo;
- ferramentas;
- atividades;
- resultados;
- bullets para CV.

Verifique:

- O formato das atividades ficou facil de entender?
- O app ajuda a transformar experiencia em evidencias?
- Editar/remover funcionou?

### 5. Formacoes

Abra `Formacoes`.

Cadastre:

- curso;
- instituicao;
- periodo;
- descricao.

Verifique:

- O fluxo esta simples?
- As informacoes sao suficientes para um CV internacional?

### 6. Skills

Abra `Skills`.

Cadastre pelo menos 5 skills.

Exemplos:

- Angular;
- TypeScript;
- JavaScript;
- Testes unitarios;
- Ingles;
- Scrum;
- Azure.

Verifique:

- Categorias fazem sentido?
- Niveis fazem sentido?
- Campo de evidencia ajuda ou atrapalha?

### 7. Vagas

Abra `Vagas`.

Copie uma descricao real de vaga do LinkedIn ou outro site e cole no campo `Descricao da vaga`.

Preencha tambem:

- cargo;
- empresa;
- pais;
- modelo;
- senioridade;
- salario, se houver;
- link opcional.

Clique em `Analisar texto`.

Verifique:

- O app identificou skills obrigatorias?
- O app identificou skills desejaveis?
- O score pareceu coerente?
- As lacunas fazem sentido?
- Salvar a vaga funcionou?

### 8. Pipeline

Abra `Pipeline`.

Crie uma candidatura vinculada a uma vaga.

Teste mudar status:

- Salva;
- CV ajustado;
- Aplicada;
- Entrevista;
- Negada.

Verifique:

- O pipeline ajuda a acompanhar sua busca?
- Faltou algum status?
- Follow-up e notas sao uteis?

### 9. CV por Vaga

Abra `CVs`.

Selecione uma vaga e gere uma versao de CV.

Verifique:

- O resumo gerado aproveitou seus dados reais?
- As skills alinhadas fazem sentido?
- As experiencias priorizadas sao boas?
- O score ATS parece util?
- O que faltou para voce confiar nesse CV?

### 10. LinkedIn

Abra `LinkedIn`.

Cole ou ajuste:

- URL do perfil, opcional;
- headline atual;
- texto do Sobre.

Clique em auditar.

Verifique:

- O score parece coerente?
- A headline sugerida e melhor que a atual?
- O Sobre sugerido parece utilizavel?
- As melhorias sao praticas?

### 11. Dashboard

Volte ao Dashboard.

Verifique:

- As metricas refletiram o que voce cadastrou?
- O pipeline mostrou os status?
- As proximas acoes ajudam?

## Perguntas finais

Responda com sinceridade:

```txt
1. O produto resolveu algum problema real para voce?
2. Qual foi a tela mais util?
3. Qual foi a tela mais confusa?
4. Voce pagaria por algo assim no futuro? Por que?
5. O que faltou para o produto ficar realmente util?
6. Encontrou algum erro? Em qual tela?
7. De 0 a 10, qual nota voce daria para o MVP?
```

## Modelo para reportar erro

```txt
Tela:
O que eu estava tentando fazer:
O que aconteceu:
O que eu esperava que acontecesse:
Consegui repetir o erro? Sim/Nao
Print ou observacao:
```

## Observacao importante

Este beta ainda nao usa IA real conectada ao Gemini. Algumas analises sao feitas por regras internas simples para validar o fluxo do produto.

