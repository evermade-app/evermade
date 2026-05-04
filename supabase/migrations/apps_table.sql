-- Run this in your Supabase SQL editor
create table if not exists apps (
  id          text primary key,
  user_id     uuid not null references profiles(id) on delete cascade,
  name        text not null default 'My App',
  gradient    text not null default 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)',
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists apps_user_id_idx on apps(user_id);
create index if not exists apps_updated_at_idx on apps(updated_at desc);

-- RLS: each user only sees and touches their own rows
alter table apps enable row level security;

create policy "Users select own apps"
  on apps for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users insert own apps"
  on apps for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users update own apps"
  on apps for update
  to authenticated
  using (user_id = auth.uid());

create policy "Users delete own apps"
  on apps for delete
  to authenticated
  using (user_id = auth.uid());

-- Service role (used by API routes) bypasses RLS automatically — no extra policy needed
