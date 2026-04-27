create or replace function public.ensure_current_profile()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.profiles (id, full_name, role_global)
  values (
    auth.uid(),
    coalesce(auth.jwt() -> 'user_metadata' ->> 'full_name', ''),
    'owner'
  )
  on conflict (id) do nothing;
end;
$$;
