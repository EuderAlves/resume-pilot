do $$
declare
  target_user_id uuid;
begin
  select id
  into target_user_id
  from auth.users
  where lower(email) = lower('euder.alv@gmail.com')
  limit 1;

  if target_user_id is null then
    raise exception 'User euder.alv@gmail.com was not found in auth.users. Create the account before running this seed.';
  end if;

  insert into public.professional_profiles (
    user_id,
    full_name,
    headline,
    target_role,
    target_seniority,
    target_countries,
    location,
    relocation_goal,
    languages,
    summary
  )
  values (
    target_user_id,
    'Euder Alves',
    'Frontend Angular Developer | TypeScript | JavaScript | APIs | Agile',
    'Frontend Developer Angular',
    'mid-level',
    array['Portugal', 'Espanha', 'Alemanha', 'Hungria', 'Franca'],
    'Brasil',
    'Buscar oportunidade internacional na Europa para crescer profissionalmente, melhorar qualidade de vida da familia e evoluir financeiramente.',
    '[{"name":"Portugues","level":"nativo"},{"name":"Espanhol","level":"avancado"},{"name":"Ingles","level":"intermediario"}]'::jsonb,
    'Desenvolvedor Frontend com experiencia em Angular, TypeScript, JavaScript, testes unitarios, refinamento tecnico, metodologias ageis e colaboracao com times de produto. Atua na criacao, manutencao e evolucao de sistemas web com foco em codigo limpo, qualidade de entrega e alinhamento com requisitos de negocio.'
  )
  on conflict (user_id)
  do update set
    full_name = excluded.full_name,
    headline = excluded.headline,
    target_role = excluded.target_role,
    target_seniority = excluded.target_seniority,
    target_countries = excluded.target_countries,
    location = excluded.location,
    relocation_goal = excluded.relocation_goal,
    languages = excluded.languages,
    summary = excluded.summary,
    updated_at = now();

  delete from public.education
  where user_id = target_user_id
    and course in (
      'Pos-Graduacao em Desenvolvimento Web Full Stack',
      'Tecnologo em Automacao Industrial'
    );

  insert into public.education (user_id, course, institution, start_date, end_date, description)
  values
    (
      target_user_id,
      'Pos-Graduacao em Desenvolvimento Web Full Stack',
      'PUC Minas',
      '2021-03-01',
      '2023-09-01',
      'Formacao voltada a desenvolvimento web full stack.'
    ),
    (
      target_user_id,
      'Tecnologo em Automacao Industrial',
      'CEUNSP',
      '2017-01-01',
      '2020-06-01',
      'Formacao superior em automacao industrial.'
    );

  insert into public.skills (user_id, name, category, level, evidence)
  values
    (target_user_id, 'Angular', 'technical', 'intermediate', 'Usado diariamente em CI&T, NTT-Data e EPTV.'),
    (target_user_id, 'TypeScript', 'technical', 'intermediate', 'Stack principal em desenvolvimento frontend Angular.'),
    (target_user_id, 'JavaScript', 'technical', 'intermediate', 'Base de desenvolvimento web e frontend.'),
    (target_user_id, 'Node.js', 'technical', 'intermediate', 'Usado em desenvolvimento diario na CI&T.'),
    (target_user_id, 'Java Spring Boot', 'technical', 'intermediate', 'Usado em projetos na NTT-Data.'),
    (target_user_id, 'ASP.NET', 'technical', 'intermediate', 'Usado em projetos na EPTV.'),
    (target_user_id, 'Testes unitarios', 'quality', 'intermediate', 'Criacao diaria de testes para mitigar erros de regras de negocio.'),
    (target_user_id, 'SOLID', 'engineering', 'intermediate', 'Aplicado para manter codigo limpo e facil de manter.'),
    (target_user_id, 'Figma', 'product', 'intermediate', 'Usado para analisar handoffs e alinhar implementacao com produto.'),
    (target_user_id, 'Jira', 'product', 'intermediate', 'Usado em refinamentos e acompanhamento de atividades.'),
    (target_user_id, 'Azure', 'cloud-devops', 'intermediate', 'Usado para Pull Requests, pipelines e ambientes.'),
    (target_user_id, 'GCP', 'cloud-devops', 'intermediate', 'Usado para Pull Requests, pipelines e ambientes.'),
    (target_user_id, 'Jenkins', 'cloud-devops', 'basic', 'Analise e solucao de erros em pipelines.'),
    (target_user_id, 'Metodologias ageis', 'process', 'intermediate', 'Participacao em dailies, plannings, refinamentos e feedbacks.')
  on conflict (user_id, name)
  do update set
    category = excluded.category,
    level = excluded.level,
    evidence = excluded.evidence;

  delete from public.experiences
  where user_id = target_user_id
    and company in ('CI&T', 'NTT-Data', 'EPTV');

  insert into public.experiences (
    user_id,
    company,
    role,
    location,
    start_date,
    end_date,
    is_current,
    activities,
    tools,
    achievements,
    generated_bullets
  )
  values
    (
      target_user_id,
      'CI&T',
      'Analista de Sistemas Pl, Desenvolvedor',
      'Brasil',
      '2024-06-01',
      null,
      true,
      '[
        {"activity":"Desenvolver em Angular","frequency":"Todos os dias","result":"Entregar codigo limpo, sem erros e de facil manutencao."},
        {"activity":"Desenvolver em Node.js","frequency":"Todos os dias","result":"Apoiar entregas backend e integracoes com manutencao simplificada."},
        {"activity":"Criar testes unitarios","frequency":"Todos os dias","result":"Evitar erros funcionais de regras de negocio."},
        {"activity":"Testar fluxos do sistema","frequency":"Todos os dias","result":"Garantir funcionalidades sem bugs que prejudiquem a operacao."},
        {"activity":"Refinar historias e handoffs","frequency":"Semanal","result":"Preparar tarefas para refinamento tecnico e execucao."},
        {"activity":"Avaliar Pull Requests","frequency":"Todos os dias","result":"Evitar erros de codigo e melhorar qualidade das entregas."}
      ]'::jsonb,
      array['Angular', 'Node.js', 'TypeScript', 'VSCode', 'Figma', 'Jira', 'Azure', 'GCP'],
      array[
        'Entregas com foco em codigo limpo e manutencao',
        'Participacao diaria em qualidade, refinamento e colaboracao de equipe',
        'Apoio na prevencao de bugs por testes e revisoes'
      ],
      array[
        'Desenvolvo diariamente em Angular utilizando VSCode e principios SOLID para entregar codigo limpo, escalavel e de facil manutencao.',
        'Realizo testes unitarios para mitigar erros de regras de negocio, aumentando a seguranca das entregas.',
        'Analiso handoffs no Figma e historias no Jira para alinhar implementacao com requisitos de produto.',
        'Avalio Pull Requests em Azure e GCP para identificar melhorias e prevenir falhas antes da entrega.'
      ]
    ),
    (
      target_user_id,
      'NTT-Data',
      'Analista de Sistemas Pl, Desenvolvedor',
      'Brasil',
      '2022-01-01',
      '2024-06-01',
      false,
      '[
        {"activity":"Desenvolver em Angular","frequency":"Todos os dias","result":"Entregar codigo frontend limpo e de facil manutencao."},
        {"activity":"Desenvolver em Java Spring Boot","frequency":"Todos os dias","result":"Criar e manter funcionalidades backend com foco em qualidade."},
        {"activity":"Criar testes unitarios","frequency":"Todos os dias","result":"Aumentar seguranca do codigo e reduzir falhas funcionais."},
        {"activity":"Criar documentacao do sistema","frequency":"Mensal","result":"Facilitar entendimento de arquitetura, frameworks e manutencao."},
        {"activity":"Gerenciar desenvolvimento de projeto","frequency":"Todos os dias","result":"Direcionar tarefas e apoiar entregas eficientes."},
        {"activity":"Solucionar erros em pipeline Jenkins","frequency":"Todos os dias","result":"Evitar bloqueios de deploy e manter ambientes operacionais."},
        {"activity":"Participar de homologacoes com cliente","frequency":"Semanal","result":"Alinhar expectativas e garantir aderencia ao solicitado."}
      ]'::jsonb,
      array['Angular', 'Java Spring Boot', 'VSCode', 'IntelliJ', 'Figma', 'Jira', 'Azure', 'GCP', 'Jenkins'],
      array[
        'Atuacao full stack com Angular e Java Spring Boot',
        'Apoio em pipelines, deploys, documentacao e homologacao',
        'Participacao em processos ageis, feedbacks e relacionamento com cliente'
      ],
      array[
        'Desenvolvi funcionalidades em Angular e Java Spring Boot, aplicando principios SOLID para manter codigo limpo e de facil manutencao.',
        'Identifiquei e solucionei erros em pipelines Jenkins para evitar bloqueios de deploy em ambientes.',
        'Criei documentacao tecnica e relatorios de evolucao para facilitar manutencao e visibilidade do projeto.',
        'Participei de homologacoes com clientes para entender necessidades, corrigir erros e alinhar expectativas.'
      ]
    ),
    (
      target_user_id,
      'EPTV',
      'Analista de Sistemas Pl, Desenvolvedor',
      'Brasil',
      '2021-01-01',
      '2022-01-01',
      false,
      '[
        {"activity":"Desenvolver em Angular","frequency":"Todos os dias","result":"Criar e manter funcionalidades frontend."},
        {"activity":"Desenvolver em ASP.NET","frequency":"Todos os dias","result":"Apoiar evolucao de sistemas com codigo de facil manutencao."},
        {"activity":"Criar testes unitarios","frequency":"Todos os dias","result":"Reduzir falhas em regras de negocio."},
        {"activity":"Testar fluxos do sistema","frequency":"Todos os dias","result":"Garantir operacao fluida e sem travas."},
        {"activity":"Analisar handoffs e historias","frequency":"Semanal","result":"Padronizar entendimento tecnico antes da implementacao."}
      ]'::jsonb,
      array['Angular', 'ASP.NET', 'VSCode', 'IntelliJ', 'Figma', 'Jira', 'Teams'],
      array[
        'Base solida em desenvolvimento frontend Angular',
        'Atuacao em manutencao, testes e refinamento tecnico',
        'Participacao em ritos ageis e colaboracao com equipe'
      ],
      array[
        'Desenvolvi diariamente em Angular utilizando VSCode e principios SOLID para entregar codigo escalavel e de facil manutencao.',
        'Atuei em ASP.NET para manter sistemas com foco em qualidade e evolucao continua.',
        'Realizei testes de fluxo via web para garantir funcionalidades corretas e evitar bugs em operacao.',
        'Participei de dailies e plannings para acompanhar progresso, remover impedimentos e priorizar entregas.'
      ]
    );

  delete from public.jobs
  where user_id = target_user_id
    and source_url = 'seed:euder-angular-portugal';

  insert into public.jobs (
    user_id,
    title,
    company,
    location,
    country,
    source_url,
    source,
    description,
    language_requirements,
    required_skills,
    desired_skills,
    seniority,
    work_model,
    visa_signal,
    salary,
    fit_score,
    analysis
  )
  values (
    target_user_id,
    'Frontend Angular Developer',
    'Empresa de tecnologia europeia',
    'Lisboa / Remoto',
    'Portugal',
    'seed:euder-angular-portugal',
    'manual',
    'We are looking for a mid-level Frontend Angular Developer to join an international product team. Requirements: Angular, TypeScript, JavaScript, REST APIs, Git, unit testing and Agile/Scrum experience. Nice to have: Node.js, Azure, GCP, Jenkins and Figma. Advanced English is required. Remote work is possible, and relocation support can be discussed.',
    array['Ingles'],
    array['Angular', 'TypeScript', 'JavaScript', 'REST APIs', 'Git', 'Testes unitarios', 'Metodologias ageis'],
    array['Node.js', 'Azure', 'GCP', 'Jenkins', 'Figma'],
    'mid-level',
    'remote',
    'sinal positivo',
    null,
    75,
    '{
      "requiredSkills":["Angular","TypeScript","JavaScript","REST APIs","Git","Testes unitarios","Metodologias ageis"],
      "desiredSkills":["Node.js","Azure","GCP","Jenkins","Figma"],
      "languageRequirements":["Ingles"],
      "keywords":["Angular","TypeScript","JavaScript","REST APIs","Git","Testes unitarios","Metodologias ageis","Node.js","Azure","GCP","Jenkins","Figma","Ingles","mid-level"],
      "seniority":"mid-level",
      "workModel":"remote",
      "visaSignal":"sinal positivo",
      "fitScore":75,
      "matchedSkills":["Angular","TypeScript","JavaScript","Testes unitarios","Metodologias ageis","Node.js","Azure","GCP","Jenkins","Figma"],
      "missingSkills":["REST APIs","Git"]
    }'::jsonb
  );
end $$;
