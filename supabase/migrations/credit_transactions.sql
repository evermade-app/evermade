-- Run this in your Supabase SQL editor
create table if not exists credit_transactions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  amount       integer not null,          -- negative = deduction, positive = addition
  balance_after integer not null default 0,
  action       text not null,             -- 'generate', 'edit_element', 'purchase', 'reset'
  description  text not null default '',
  created_at   timestamptz not null default now()
);

create index if not exists credit_transactions_user_id_idx on credit_transactions(user_id);
create index if not exists credit_transactions_created_at_idx on credit_transactions(created_at desc);

-- RLS: enable so users can only read their own rows via anon/user key
alter table credit_transactions enable row level security;

-- Allow authenticated users to read their own transactions
create policy "Users can read own transactions"
  on credit_transactions for select
  to authenticated
  using (user_id = auth.uid());

-- Explicitly allow service_role to INSERT/UPDATE/DELETE (bypasses RLS by default, but be explicit)
create policy "Service role full access"
  on credit_transactions
  to service_role
  using (true)
  with check (true);
