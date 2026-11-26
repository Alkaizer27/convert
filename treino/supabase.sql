-- Cole este texto no Supabase: menu "SQL Editor" > "New query" > Run.
-- Cria a tabela dos treinos e duas funções. O app só acessa por essas funções,
-- e só quem tem o código da família (longo e aleatório) lê ou grava os dados.

create table if not exists public.familias (
  code text primary key check (char_length(code) >= 16),
  dados jsonb not null default '{}'::jsonb,
  atualizado timestamptz not null default now()
);
alter table public.familias enable row level security;
revoke all on table public.familias from anon, authenticated;

create or replace function public.treino_get(p_code text)
returns jsonb language sql security definer set search_path = public as $$
  select dados from public.familias where code = p_code and char_length(p_code) >= 16;
$$;

create or replace function public.treino_set(p_code text, p_who text, p_data jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if char_length(p_code) < 16 or p_who not in ('charles', 'joelma') or pg_column_size(p_data) > 500000 then
    raise exception 'dados inválidos';
  end if;
  insert into public.familias (code, dados) values (p_code, jsonb_build_object(p_who, p_data))
  on conflict (code) do update
    set dados = public.familias.dados || jsonb_build_object(p_who, p_data), atualizado = now();
end;
$$;

revoke all on function public.treino_get(text) from public;
revoke all on function public.treino_set(text, text, jsonb) from public;
grant execute on function public.treino_get(text) to anon;
grant execute on function public.treino_set(text, text, jsonb) to anon;
