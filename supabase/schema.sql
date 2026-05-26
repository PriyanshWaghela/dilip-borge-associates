create extension if not exists pgcrypto;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  service text not null,
  date text,
  time text,
  type text,
  files integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.appointments enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists "read appointments for authenticated users" on public.appointments;
create policy "read appointments for authenticated users"
on public.appointments
for select
to authenticated
using (true);

drop policy if exists "read inquiries for authenticated users" on public.inquiries;
create policy "read inquiries for authenticated users"
on public.inquiries
for select
to authenticated
using (true);
