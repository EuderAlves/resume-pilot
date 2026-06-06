create extension if not exists pgcrypto;

create table if not exists public.professional_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  headline text,
  target_role text,
  target_seniority text,
  target_countries text[] not null default '{}',
  location text,
  relocation_goal text,
  languages jsonb not null default '[]'::jsonb,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  role text not null,
  location text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  activities jsonb not null default '[]'::jsonb,
  tools text[] not null default '{}',
  achievements text[] not null default '{}',
  generated_bullets text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course text not null,
  institution text not null,
  start_date date,
  end_date date,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null default 'technical',
  level text,
  evidence text,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  company text,
  location text,
  country text,
  source_url text,
  source text not null default 'manual',
  description text,
  language_requirements text[] not null default '{}',
  required_skills text[] not null default '{}',
  desired_skills text[] not null default '{}',
  seniority text,
  work_model text,
  visa_signal text,
  salary text,
  fit_score numeric(5,2),
  analysis jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  applied_at date,
  status text not null default 'saved',
  follow_up_at date,
  notes text,
  contact_name text,
  contact_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_status_check check (
    status in (
      'saved',
      'cv_tailored',
      'applied',
      'follow_up_sent',
      'interview',
      'technical_test',
      'offer',
      'rejected',
      'archived'
    )
  )
);

create table if not exists public.cv_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  title text not null,
  language text not null default 'pt-BR',
  content jsonb not null default '{}'::jsonb,
  storage_path text,
  ats_score numeric(5,2),
  created_at timestamptz not null default now()
);

create table if not exists public.linkedin_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_url text,
  headline_score numeric(5,2),
  about_score numeric(5,2),
  experience_score numeric(5,2),
  skills_score numeric(5,2),
  total_score numeric(5,2),
  suggestions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_analysis_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  run_type text not null,
  provider text not null default 'mock',
  prompt_version text,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null,
  file_name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create index if not exists experiences_user_id_idx on public.experiences(user_id);
create index if not exists education_user_id_idx on public.education(user_id);
create index if not exists skills_user_id_idx on public.skills(user_id);
create index if not exists jobs_user_id_idx on public.jobs(user_id);
create index if not exists applications_user_id_idx on public.applications(user_id);
create index if not exists applications_job_id_idx on public.applications(job_id);
create index if not exists cv_versions_user_id_idx on public.cv_versions(user_id);
create index if not exists linkedin_audits_user_id_idx on public.linkedin_audits(user_id);
create index if not exists ai_analysis_runs_user_id_idx on public.ai_analysis_runs(user_id);
create index if not exists documents_user_id_idx on public.documents(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists professional_profiles_set_updated_at on public.professional_profiles;
create trigger professional_profiles_set_updated_at
before update on public.professional_profiles
for each row execute function public.set_updated_at();

drop trigger if exists experiences_set_updated_at on public.experiences;
create trigger experiences_set_updated_at
before update on public.experiences
for each row execute function public.set_updated_at();

drop trigger if exists education_set_updated_at on public.education;
create trigger education_set_updated_at
before update on public.education
for each row execute function public.set_updated_at();

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

alter table public.professional_profiles enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.cv_versions enable row level security;
alter table public.linkedin_audits enable row level security;
alter table public.ai_analysis_runs enable row level security;
alter table public.documents enable row level security;

create policy "Users can manage their own professional profile"
on public.professional_profiles
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own experiences"
on public.experiences
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own education"
on public.education
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own skills"
on public.skills
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own jobs"
on public.jobs
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own applications"
on public.applications
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own CV versions"
on public.cv_versions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own LinkedIn audits"
on public.linkedin_audits
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own AI analysis runs"
on public.ai_analysis_runs
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage their own documents"
on public.documents
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
