create extension if not exists pgcrypto;

do $$
begin
  create type public.farm_member_role as enum ('owner', 'worker');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.pasture_manual_status as enum ('active', 'maintenance');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.pasture_event_type as enum (
    'guadana',
    'mantenimiento_cercas',
    'siembra_pasto',
    'fertilizacion',
    'enmienda',
    'control_malezas',
    'reparacion_agua',
    'limpieza',
    'observacion',
    'otro'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role_global public.farm_member_role not null default 'worker',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.farms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  name text not null,
  department text,
  municipality text,
  vereda text,
  total_area_ha numeric(10,2) check (total_area_ha is null or total_area_ha >= 0),
  productive_area_ha numeric(10,2) check (productive_area_ha is null or productive_area_ha >= 0),
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.farm_members (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.farm_member_role not null default 'worker',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (farm_id, user_id)
);

create table if not exists public.lots (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  name text not null,
  code text,
  entry_date date,
  target_sale_weight_kg numeric(8,2) check (target_sale_weight_kg is null or target_sale_weight_kg > 0),
  status text not null default 'active' check (status in ('active', 'sold', 'closed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pastures (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  name text not null,
  area_ha numeric(10,2) not null check (area_ha > 0),
  grass_type text,
  carrying_capacity_animals integer check (carrying_capacity_animals is null or carrying_capacity_animals >= 0),
  max_grazing_days integer not null default 3 check (max_grazing_days > 0),
  recovery_days_required integer not null default 28 check (recovery_days_required > 0),
  water_available boolean not null default true,
  status public.pasture_manual_status not null default 'active',
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, name)
);

create table if not exists public.pasture_rotations (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  pasture_id uuid not null references public.pastures(id) on delete cascade,
  lot_id uuid not null references public.lots(id) on delete restrict,
  entry_date date not null,
  planned_exit_date date,
  exit_date date,
  animal_count integer not null check (animal_count > 0),
  occupation_days integer check (occupation_days is null or occupation_days >= 0),
  max_grazing_days_snapshot integer not null,
  recovery_days_required_snapshot integer not null,
  pasture_condition_entry text,
  pasture_condition_exit text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (exit_date is null or exit_date >= entry_date)
);

create unique index if not exists pasture_rotations_one_active_per_pasture
  on public.pasture_rotations (pasture_id)
  where exit_date is null;

create table if not exists public.cost_records (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  lot_id uuid references public.lots(id) on delete set null,
  animal_id uuid,
  pasture_id uuid references public.pastures(id) on delete set null,
  cost_date date not null,
  category text not null,
  description text not null,
  amount numeric(14,2) not null check (amount >= 0),
  allocation_method text not null default 'potrero' check (allocation_method in ('animal', 'lote', 'potrero', 'finca')),
  source_type text,
  source_id uuid,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_type, source_id)
);

create table if not exists public.pasture_events (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  pasture_id uuid not null references public.pastures(id) on delete cascade,
  event_date date not null,
  event_type public.pasture_event_type not null,
  title text not null,
  description text,
  cost_amount numeric(14,2) check (cost_amount is null or cost_amount >= 0),
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists farms_set_updated_at on public.farms;
create trigger farms_set_updated_at
before update on public.farms
for each row execute function public.set_updated_at();

drop trigger if exists lots_set_updated_at on public.lots;
create trigger lots_set_updated_at
before update on public.lots
for each row execute function public.set_updated_at();

drop trigger if exists pastures_set_updated_at on public.pastures;
create trigger pastures_set_updated_at
before update on public.pastures
for each row execute function public.set_updated_at();

drop trigger if exists pasture_rotations_set_updated_at on public.pasture_rotations;
create trigger pasture_rotations_set_updated_at
before update on public.pasture_rotations
for each row execute function public.set_updated_at();

drop trigger if exists pasture_events_set_updated_at on public.pasture_events;
create trigger pasture_events_set_updated_at
before update on public.pasture_events
for each row execute function public.set_updated_at();

drop trigger if exists cost_records_set_updated_at on public.cost_records;
create trigger cost_records_set_updated_at
before update on public.cost_records
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role_global)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'worker'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.add_farm_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.farm_members (farm_id, user_id, role, is_active)
  values (new.id, new.owner_id, 'owner', true)
  on conflict (farm_id, user_id)
  do update set
    role = 'owner',
    is_active = true;

  return new;
end;
$$;

drop trigger if exists farms_add_owner_membership on public.farms;
create trigger farms_add_owner_membership
after insert on public.farms
for each row execute function public.add_farm_owner_membership();

create or replace function public.current_farm_role(target_farm_id uuid)
returns public.farm_member_role
language sql
stable
security definer
set search_path = public
as $$
  select fm.role
  from public.farm_members fm
  where fm.farm_id = target_farm_id
    and fm.user_id = auth.uid()
    and fm.is_active
  limit 1;
$$;

create or replace function public.is_farm_member(target_farm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.farm_members fm
    where fm.farm_id = target_farm_id
      and fm.user_id = auth.uid()
      and fm.is_active
  );
$$;

create or replace function public.prepare_pasture_rotation()
returns trigger
language plpgsql
as $$
declare
  pasture_record public.pastures%rowtype;
begin
  select *
  into pasture_record
  from public.pastures
  where id = new.pasture_id;

  if pasture_record.id is null then
    raise exception 'Pasture % does not exist', new.pasture_id;
  end if;

  if new.farm_id <> pasture_record.farm_id then
    raise exception 'Rotation farm_id must match pasture farm_id';
  end if;

  if new.max_grazing_days_snapshot is null then
    new.max_grazing_days_snapshot = pasture_record.max_grazing_days;
  end if;

  if new.recovery_days_required_snapshot is null then
    new.recovery_days_required_snapshot = pasture_record.recovery_days_required;
  end if;

  if new.planned_exit_date is null then
    new.planned_exit_date = new.entry_date + new.max_grazing_days_snapshot;
  end if;

  if new.exit_date is not null then
    new.occupation_days = greatest(new.exit_date - new.entry_date, 1);
  else
    new.occupation_days = null;
  end if;

  return new;
end;
$$;

drop trigger if exists pasture_rotations_prepare on public.pasture_rotations;
create trigger pasture_rotations_prepare
before insert or update on public.pasture_rotations
for each row execute function public.prepare_pasture_rotation();

create or replace function public.sync_pasture_event_cost()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_lot_id uuid;
begin
  if tg_op = 'DELETE' then
    delete from public.cost_records
    where source_type = 'pasture_event'
      and source_id = old.id;
    return old;
  end if;

  if new.cost_amount is not null and new.cost_amount > 0 then
    select pr.lot_id
    into target_lot_id
    from public.pasture_rotations pr
    where pr.pasture_id = new.pasture_id
      and new.event_date >= pr.entry_date
      and (pr.exit_date is null or new.event_date <= pr.exit_date)
    order by pr.entry_date desc
    limit 1;

    insert into public.cost_records (
      farm_id,
      lot_id,
      pasture_id,
      cost_date,
      category,
      description,
      amount,
      allocation_method,
      source_type,
      source_id,
      created_by
    )
    values (
      new.farm_id,
      target_lot_id,
      new.pasture_id,
      new.event_date,
      new.event_type::text,
      new.title,
      new.cost_amount,
      'potrero',
      'pasture_event',
      new.id,
      new.created_by
    )
    on conflict (source_type, source_id)
    do update set
      farm_id = excluded.farm_id,
      lot_id = excluded.lot_id,
      pasture_id = excluded.pasture_id,
      cost_date = excluded.cost_date,
      category = excluded.category,
      description = excluded.description,
      amount = excluded.amount,
      created_by = excluded.created_by,
      updated_at = now();
  else
    delete from public.cost_records
    where source_type = 'pasture_event'
      and source_id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists pasture_events_sync_cost_after_insert_update on public.pasture_events;
create trigger pasture_events_sync_cost_after_insert_update
after insert or update on public.pasture_events
for each row execute function public.sync_pasture_event_cost();

drop trigger if exists pasture_events_sync_cost_after_delete on public.pasture_events;
create trigger pasture_events_sync_cost_after_delete
after delete on public.pasture_events
for each row execute function public.sync_pasture_event_cost();

create or replace view public.v_pasture_status
with (security_invoker = true)
as
with active_rotation as (
  select distinct on (pr.pasture_id)
    pr.*
  from public.pasture_rotations pr
  where pr.exit_date is null
  order by pr.pasture_id, pr.entry_date desc
),
last_closed_rotation as (
  select distinct on (pr.pasture_id)
    pr.*
  from public.pasture_rotations pr
  where pr.exit_date is not null
  order by pr.pasture_id, pr.exit_date desc, pr.entry_date desc
),
last_event as (
  select distinct on (pe.pasture_id)
    pe.pasture_id,
    pe.event_date,
    pe.event_type,
    pe.title
  from public.pasture_events pe
  where pe.event_type <> 'observacion'
  order by pe.pasture_id, pe.event_date desc, pe.created_at desc
),
event_costs as (
  select
    pe.pasture_id,
    coalesce(sum(pe.cost_amount), 0) as pasture_event_cost
  from public.pasture_events pe
  group by pe.pasture_id
)
select
  p.id,
  p.farm_id,
  p.name,
  p.area_ha,
  p.grass_type,
  p.carrying_capacity_animals,
  p.max_grazing_days,
  p.recovery_days_required,
  p.water_available,
  p.status as manual_status,
  ar.id as active_rotation_id,
  ar.lot_id as current_lot_id,
  ar.entry_date as current_entry_date,
  ar.planned_exit_date,
  ar.animal_count as current_animal_count,
  lcr.id as last_rotation_id,
  lcr.exit_date as last_exit_date,
  lcr.recovery_days_required_snapshot,
  greatest(coalesce(current_date - ar.entry_date, 0), 0) as days_occupied,
  greatest(coalesce(current_date - lcr.exit_date, 0), 0) as days_resting,
  case
    when p.status = 'maintenance' then 0
    when ar.id is not null then greatest(coalesce(ar.planned_exit_date - current_date, 0), 0)
    when lcr.id is not null then greatest(lcr.recovery_days_required_snapshot - greatest(current_date - lcr.exit_date, 0), 0)
    else 0
  end as days_until_ready,
  case
    when p.status = 'maintenance' then 'maintenance'
    when ar.id is not null and current_date > ar.planned_exit_date then 'overdue'
    when ar.id is not null then 'occupied'
    when lcr.id is null then 'ready'
    when greatest(current_date - lcr.exit_date, 0) >= lcr.recovery_days_required_snapshot then 'ready'
    else 'resting'
  end as pasture_status,
  case
    when p.status = 'maintenance' then 'orange'
    when ar.id is not null and current_date > ar.planned_exit_date then 'red'
    when ar.id is not null then 'blue'
    when lcr.id is null then 'green'
    when greatest(current_date - lcr.exit_date, 0) >= lcr.recovery_days_required_snapshot then 'green'
    else 'yellow'
  end as status_color,
  le.event_date as last_event_date,
  le.event_type as last_event_type,
  le.title as last_event_title,
  coalesce(ec.pasture_event_cost, 0) as pasture_event_cost
from public.pastures p
left join active_rotation ar on ar.pasture_id = p.id
left join last_closed_rotation lcr on lcr.pasture_id = p.id
left join last_event le on le.pasture_id = p.id
left join event_costs ec on ec.pasture_id = p.id
where p.is_active;

alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.farm_members enable row level security;
alter table public.lots enable row level security;
alter table public.pastures enable row level security;
alter table public.pasture_rotations enable row level security;
alter table public.pasture_events enable row level security;
alter table public.cost_records enable row level security;

create policy "profiles_read_own"
on public.profiles for select
using (id = auth.uid());

create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "farms_read_members"
on public.farms for select
using (owner_id = auth.uid() or public.is_farm_member(id));

create policy "farms_insert_owner"
on public.farms for insert
with check (owner_id = auth.uid());

create policy "farms_update_owner"
on public.farms for update
using (owner_id = auth.uid() or public.current_farm_role(id) = 'owner')
with check (owner_id = auth.uid() or public.current_farm_role(id) = 'owner');

create policy "farm_members_read_members"
on public.farm_members for select
using (public.is_farm_member(farm_id));

create policy "farm_members_manage_owner"
on public.farm_members for all
using (public.current_farm_role(farm_id) = 'owner')
with check (public.current_farm_role(farm_id) = 'owner');

create policy "lots_member_access"
on public.lots for all
using (public.is_farm_member(farm_id))
with check (public.is_farm_member(farm_id));

create policy "pastures_member_access"
on public.pastures for all
using (public.is_farm_member(farm_id))
with check (public.is_farm_member(farm_id));

create policy "pasture_rotations_member_access"
on public.pasture_rotations for all
using (public.is_farm_member(farm_id))
with check (public.is_farm_member(farm_id));

create policy "pasture_events_member_access"
on public.pasture_events for all
using (public.is_farm_member(farm_id))
with check (public.is_farm_member(farm_id));

create policy "cost_records_owner_read"
on public.cost_records for select
using (public.current_farm_role(farm_id) = 'owner');

create policy "cost_records_owner_manage"
on public.cost_records for all
using (public.current_farm_role(farm_id) = 'owner')
with check (public.current_farm_role(farm_id) = 'owner');
