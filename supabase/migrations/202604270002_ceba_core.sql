do $$
begin
  create type public.animal_status as enum ('active', 'ready_for_sale', 'underperforming', 'sick', 'sold', 'dead');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.animal_sex as enum ('macho', 'hembra');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.health_event_type as enum (
    'aftosa',
    'carbon',
    'rabia',
    'desparasitacion',
    'bano_garrapaticida',
    'vitaminas',
    'tratamiento',
    'enfermedad',
    'mortalidad',
    'retiro_sanitario'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.feed_type as enum (
    'sal_mineralizada',
    'melaza',
    'silo',
    'heno',
    'concentrado',
    'subproducto',
    'otro'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.sale_type as enum ('individual', 'lot');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.animals (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  lot_id uuid not null references public.lots(id) on delete restrict,
  internal_code text not null,
  ear_tag text not null,
  source_text text not null,
  supplier_text text,
  breed_type text not null,
  sex public.animal_sex not null default 'macho',
  approx_age_months integer check (approx_age_months is null or approx_age_months > 0),
  entry_weight_kg numeric(8,2) not null check (entry_weight_kg > 0),
  current_weight_kg numeric(8,2) not null check (current_weight_kg > 0),
  purchase_date date not null,
  purchase_price numeric(14,2) not null check (purchase_price >= 0),
  purchase_price_per_kg numeric(12,2) generated always as (purchase_price / nullif(entry_weight_kg, 0)) stored,
  body_condition_score numeric(3,1) check (body_condition_score is null or body_condition_score between 1 and 5),
  health_observations text,
  photo_url text,
  status public.animal_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, internal_code),
  unique (farm_id, ear_tag)
);

create table if not exists public.weight_records (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  lot_id uuid not null references public.lots(id) on delete restrict,
  animal_id uuid not null references public.animals(id) on delete cascade,
  weighed_at date not null,
  weight_kg numeric(8,2) not null check (weight_kg > 0),
  previous_weight_kg numeric(8,2),
  daily_gain_kg numeric(8,3),
  days_since_last_weight integer check (days_since_last_weight is null or days_since_last_weight >= 0),
  days_in_ceba integer not null default 0 check (days_in_ceba >= 0),
  notes text,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  unique (animal_id, weighed_at)
);

create table if not exists public.health_events (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  lot_id uuid references public.lots(id) on delete set null,
  animal_id uuid references public.animals(id) on delete cascade,
  event_type public.health_event_type not null,
  event_date date not null,
  product_name text,
  dose text,
  unit text,
  diagnosis text,
  withdrawal_until date,
  cost numeric(14,2) check (cost is null or cost >= 0),
  notes text,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (lot_id is not null or animal_id is not null)
);

create table if not exists public.feed_items (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  name text not null,
  feed_type public.feed_type not null,
  unit text not null default 'kg',
  default_cost_per_unit numeric(14,2) not null default 0 check (default_cost_per_unit >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, name)
);

create table if not exists public.supplementation_records (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  lot_id uuid not null references public.lots(id) on delete restrict,
  feed_item_id uuid not null references public.feed_items(id) on delete restrict,
  start_date date not null,
  end_date date not null,
  quantity numeric(12,2) not null check (quantity > 0),
  unit text not null default 'kg',
  total_cost numeric(14,2) not null check (total_cost >= 0),
  animal_count integer not null check (animal_count > 0),
  cost_per_animal numeric(14,2) generated always as (total_cost / nullif(animal_count, 0)) stored,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  sale_date date not null,
  buyer_text text not null,
  sale_type public.sale_type not null,
  total_weight_kg numeric(10,2) not null check (total_weight_kg > 0),
  price_per_kg numeric(12,2) not null check (price_per_kg > 0),
  gross_amount numeric(14,2) not null check (gross_amount >= 0),
  extra_costs numeric(14,2) not null default 0 check (extra_costs >= 0),
  net_amount numeric(14,2) not null check (net_amount >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  sale_id uuid not null references public.sales(id) on delete cascade,
  animal_id uuid not null references public.animals(id) on delete restrict,
  lot_id uuid not null references public.lots(id) on delete restrict,
  exit_weight_kg numeric(8,2) not null check (exit_weight_kg > 0),
  price_per_kg numeric(12,2) not null check (price_per_kg > 0),
  gross_amount numeric(14,2) not null check (gross_amount >= 0),
  purchase_cost numeric(14,2) not null default 0 check (purchase_cost >= 0),
  allocated_cost numeric(14,2) not null default 0 check (allocated_cost >= 0),
  gross_profit numeric(14,2) not null default 0,
  net_profit numeric(14,2) not null default 0,
  roi numeric(10,4) not null default 0,
  days_in_ceba integer not null default 0 check (days_in_ceba >= 0),
  created_at timestamptz not null default now(),
  unique (animal_id)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'cost_records_animal_id_fkey'
      and conrelid = 'public.cost_records'::regclass
  ) then
    alter table public.cost_records
      add constraint cost_records_animal_id_fkey
      foreign key (animal_id) references public.animals(id) on delete set null;
  end if;
end $$;

drop trigger if exists animals_set_updated_at on public.animals;
create trigger animals_set_updated_at
before update on public.animals
for each row execute function public.set_updated_at();

drop trigger if exists health_events_set_updated_at on public.health_events;
create trigger health_events_set_updated_at
before update on public.health_events
for each row execute function public.set_updated_at();

drop trigger if exists feed_items_set_updated_at on public.feed_items;
create trigger feed_items_set_updated_at
before update on public.feed_items
for each row execute function public.set_updated_at();

drop trigger if exists supplementation_records_set_updated_at on public.supplementation_records;
create trigger supplementation_records_set_updated_at
before update on public.supplementation_records
for each row execute function public.set_updated_at();

drop trigger if exists sales_set_updated_at on public.sales;
create trigger sales_set_updated_at
before update on public.sales
for each row execute function public.set_updated_at();

create or replace function public.prepare_weight_record()
returns trigger
language plpgsql
as $$
declare
  animal_record public.animals%rowtype;
  previous_record public.weight_records%rowtype;
begin
  select *
  into animal_record
  from public.animals
  where id = new.animal_id;

  if animal_record.id is null then
    raise exception 'Animal % does not exist', new.animal_id;
  end if;

  if new.farm_id <> animal_record.farm_id or new.lot_id <> animal_record.lot_id then
    raise exception 'Weight farm_id and lot_id must match animal';
  end if;

  if new.weighed_at < animal_record.purchase_date then
    raise exception 'Weight date cannot be before purchase date';
  end if;

  select *
  into previous_record
  from public.weight_records
  where animal_id = new.animal_id
    and weighed_at < new.weighed_at
  order by weighed_at desc
  limit 1;

  new.previous_weight_kg = coalesce(previous_record.weight_kg, animal_record.entry_weight_kg);
  new.days_since_last_weight = greatest(new.weighed_at - coalesce(previous_record.weighed_at, animal_record.purchase_date), 1);
  new.days_in_ceba = greatest(new.weighed_at - animal_record.purchase_date, 0);
  new.daily_gain_kg = (new.weight_kg - new.previous_weight_kg) / nullif(new.days_since_last_weight, 0);

  return new;
end;
$$;

drop trigger if exists weight_records_prepare on public.weight_records;
create trigger weight_records_prepare
before insert or update on public.weight_records
for each row execute function public.prepare_weight_record();

create or replace function public.apply_weight_record_to_animal()
returns trigger
language plpgsql
as $$
begin
  update public.animals a
  set
    current_weight_kg = new.weight_kg,
    status = case
      when new.weight_kg >= coalesce(l.target_sale_weight_kg, 450) then 'ready_for_sale'::public.animal_status
      when new.daily_gain_kg is not null and new.daily_gain_kg < 0.55 then 'underperforming'::public.animal_status
      when a.status in ('sick', 'dead', 'sold') then a.status
      else 'active'::public.animal_status
    end,
    updated_at = now()
  from public.lots l
  where a.id = new.animal_id
    and l.id = a.lot_id
    and (a.status not in ('dead', 'sold'));

  return new;
end;
$$;

drop trigger if exists weight_records_apply_to_animal on public.weight_records;
create trigger weight_records_apply_to_animal
after insert or update on public.weight_records
for each row execute function public.apply_weight_record_to_animal();

create or replace function public.apply_health_event_to_animal()
returns trigger
language plpgsql
as $$
begin
  if new.event_type = 'mortalidad' and new.animal_id is not null then
    update public.animals
    set status = 'dead', updated_at = now()
    where id = new.animal_id;
  elsif new.event_type = 'enfermedad' and new.animal_id is not null then
    update public.animals
    set status = 'sick', updated_at = now()
    where id = new.animal_id
      and status not in ('dead', 'sold');
  end if;

  return new;
end;
$$;

drop trigger if exists health_events_apply_to_animal on public.health_events;
create trigger health_events_apply_to_animal
after insert or update on public.health_events
for each row execute function public.apply_health_event_to_animal();

create or replace function public.sync_health_event_cost()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    delete from public.cost_records
    where source_type = 'health_event'
      and source_id = old.id;
    return old;
  end if;

  if new.cost is not null and new.cost > 0 then
    insert into public.cost_records (
      farm_id,
      lot_id,
      animal_id,
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
      new.lot_id,
      new.animal_id,
      new.event_date,
      case
        when new.event_type in ('aftosa', 'carbon', 'rabia') then 'vacunacion'
        else 'medicamentos'
      end,
      coalesce(new.product_name, new.event_type::text),
      new.cost,
      case
        when new.animal_id is not null then 'animal'
        when new.lot_id is not null then 'lote'
        else 'finca'
      end,
      'health_event',
      new.id,
      new.created_by
    )
    on conflict (source_type, source_id)
    do update set
      farm_id = excluded.farm_id,
      lot_id = excluded.lot_id,
      animal_id = excluded.animal_id,
      cost_date = excluded.cost_date,
      category = excluded.category,
      description = excluded.description,
      amount = excluded.amount,
      allocation_method = excluded.allocation_method,
      created_by = excluded.created_by,
      updated_at = now();
  else
    delete from public.cost_records
    where source_type = 'health_event'
      and source_id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists health_events_sync_cost_after_insert_update on public.health_events;
create trigger health_events_sync_cost_after_insert_update
after insert or update on public.health_events
for each row execute function public.sync_health_event_cost();

drop trigger if exists health_events_sync_cost_after_delete on public.health_events;
create trigger health_events_sync_cost_after_delete
after delete on public.health_events
for each row execute function public.sync_health_event_cost();

create or replace function public.sync_supplementation_cost()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  feed_record public.feed_items%rowtype;
begin
  if tg_op = 'DELETE' then
    delete from public.cost_records
    where source_type = 'supplementation_record'
      and source_id = old.id;
    return old;
  end if;

  select *
  into feed_record
  from public.feed_items
  where id = new.feed_item_id;

  insert into public.cost_records (
    farm_id,
    lot_id,
    cost_date,
    category,
    description,
    amount,
    allocation_method,
    source_type,
    source_id
  )
  values (
    new.farm_id,
    new.lot_id,
    new.end_date,
    case
      when feed_record.feed_type = 'sal_mineralizada' then 'sal_mineralizada'
      else 'suplementos'
    end,
    coalesce(feed_record.name, 'Suplementacion'),
    new.total_cost,
    'lote',
    'supplementation_record',
    new.id
  )
  on conflict (source_type, source_id)
  do update set
    farm_id = excluded.farm_id,
    lot_id = excluded.lot_id,
    cost_date = excluded.cost_date,
    category = excluded.category,
    description = excluded.description,
    amount = excluded.amount,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists supplementation_records_sync_cost_after_insert_update on public.supplementation_records;
create trigger supplementation_records_sync_cost_after_insert_update
after insert or update on public.supplementation_records
for each row execute function public.sync_supplementation_cost();

drop trigger if exists supplementation_records_sync_cost_after_delete on public.supplementation_records;
create trigger supplementation_records_sync_cost_after_delete
after delete on public.supplementation_records
for each row execute function public.sync_supplementation_cost();

create or replace function public.prevent_sale_during_withdrawal()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from public.health_events he
    where he.animal_id = new.animal_id
      and he.withdrawal_until is not null
      and he.withdrawal_until >= (select s.sale_date from public.sales s where s.id = new.sale_id)
  ) then
    raise exception 'Animal % has an active sanitary withdrawal', new.animal_id;
  end if;

  return new;
end;
$$;

drop trigger if exists sale_items_prevent_withdrawal on public.sale_items;
create trigger sale_items_prevent_withdrawal
before insert or update on public.sale_items
for each row execute function public.prevent_sale_during_withdrawal();

create or replace function public.apply_sale_item_to_animal()
returns trigger
language plpgsql
as $$
begin
  update public.animals
  set status = 'sold', current_weight_kg = new.exit_weight_kg, updated_at = now()
  where id = new.animal_id;

  return new;
end;
$$;

drop trigger if exists sale_items_apply_to_animal on public.sale_items;
create trigger sale_items_apply_to_animal
after insert on public.sale_items
for each row execute function public.apply_sale_item_to_animal();

create or replace view public.v_animal_performance
with (security_invoker = true)
as
with latest_weight as (
  select distinct on (wr.animal_id)
    wr.animal_id,
    wr.weighed_at,
    wr.weight_kg,
    wr.daily_gain_kg
  from public.weight_records wr
  order by wr.animal_id, wr.weighed_at desc
),
animal_costs as (
  select
    a.id as animal_id,
    coalesce(sum(case
      when cr.allocation_method = 'animal' and cr.animal_id = a.id then cr.amount
      when cr.allocation_method = 'lote' and cr.lot_id = a.lot_id then cr.amount / nullif((select count(*) from public.animals ax where ax.lot_id = a.lot_id and ax.status <> 'sold'), 0)
      when cr.allocation_method = 'finca' and cr.farm_id = a.farm_id then cr.amount / nullif((select count(*) from public.animals ax where ax.farm_id = a.farm_id and ax.status <> 'sold'), 0)
      else 0
    end), 0) as allocated_cost
  from public.animals a
  left join public.cost_records cr on cr.farm_id = a.farm_id
  group by a.id
)
select
  a.id,
  a.farm_id,
  a.lot_id,
  a.internal_code,
  a.ear_tag,
  a.entry_weight_kg,
  a.current_weight_kg,
  greatest(a.current_weight_kg - a.entry_weight_kg, 0) as kg_gained,
  greatest(current_date - a.purchase_date, 1) as days_in_ceba,
  (greatest(a.current_weight_kg - a.entry_weight_kg, 0) / nullif(greatest(current_date - a.purchase_date, 1), 0)) as accumulated_daily_gain_kg,
  lw.weighed_at as latest_weight_date,
  lw.daily_gain_kg as recent_daily_gain_kg,
  ac.allocated_cost,
  ac.allocated_cost / nullif(greatest(a.current_weight_kg - a.entry_weight_kg, 0), 0) as cost_per_kg_gained,
  a.status
from public.animals a
left join latest_weight lw on lw.animal_id = a.id
left join animal_costs ac on ac.animal_id = a.id;

create or replace view public.v_lot_performance
with (security_invoker = true)
as
select
  l.id,
  l.farm_id,
  l.name,
  l.code,
  count(a.id) filter (where a.status not in ('sold', 'dead')) as active_animals,
  avg(a.entry_weight_kg) filter (where a.status not in ('sold', 'dead')) as avg_entry_weight_kg,
  avg(a.current_weight_kg) filter (where a.status not in ('sold', 'dead')) as avg_current_weight_kg,
  avg(vap.accumulated_daily_gain_kg) filter (where a.status not in ('sold', 'dead')) as avg_daily_gain_kg,
  sum(vap.kg_gained) filter (where a.status not in ('sold', 'dead')) as total_kg_gained,
  sum(vap.allocated_cost) filter (where a.status not in ('sold', 'dead')) as total_cost,
  sum(vap.allocated_cost) filter (where a.status not in ('sold', 'dead')) / nullif(sum(vap.kg_gained) filter (where a.status not in ('sold', 'dead')), 0) as cost_per_kg_produced,
  sum((a.current_weight_kg * 9800) - a.purchase_price - vap.allocated_cost) filter (where a.status not in ('sold', 'dead')) as estimated_margin
from public.lots l
left join public.animals a on a.lot_id = l.id
left join public.v_animal_performance vap on vap.id = a.id
group by l.id;

create or replace view public.v_farm_dashboard
with (security_invoker = true)
as
with animal_summary as (
  select
    a.farm_id,
    avg(vap.accumulated_daily_gain_kg) filter (where a.status not in ('sold', 'dead')) as avg_daily_gain_kg,
    sum(vap.allocated_cost) / nullif(sum(vap.kg_gained), 0) as cost_per_kg_produced,
    count(a.id) filter (where a.status = 'ready_for_sale') as ready_for_sale_animals,
    count(a.id) filter (where a.status = 'underperforming') as underperforming_animals,
    count(a.id) filter (where a.status = 'dead') as mortality_count,
    sum((a.current_weight_kg * 9800) - a.purchase_price - vap.allocated_cost) filter (where a.status not in ('sold', 'dead')) as estimated_margin
  from public.animals a
  left join public.v_animal_performance vap on vap.id = a.id
  group by a.farm_id
),
pasture_summary as (
  select
    ps.farm_id,
    count(ps.id) filter (where ps.pasture_status in ('occupied', 'overdue')) as occupied_pastures
  from public.v_pasture_status ps
  group by ps.farm_id
),
health_summary as (
  select
    he.farm_id,
    count(he.id) filter (where he.withdrawal_until >= current_date) as sanitary_alerts
  from public.health_events he
  group by he.farm_id
)
select
  f.id as farm_id,
  f.name as farm_name,
  coalesce(animal_summary.avg_daily_gain_kg, 0) as avg_daily_gain_kg,
  coalesce(animal_summary.cost_per_kg_produced, 0) as cost_per_kg_produced,
  coalesce(animal_summary.ready_for_sale_animals, 0) as ready_for_sale_animals,
  coalesce(animal_summary.underperforming_animals, 0) as underperforming_animals,
  coalesce(animal_summary.mortality_count, 0) as mortality_count,
  coalesce(pasture_summary.occupied_pastures, 0) as occupied_pastures,
  coalesce(health_summary.sanitary_alerts, 0) as sanitary_alerts,
  coalesce(animal_summary.estimated_margin, 0) as estimated_margin
from public.farms f
left join animal_summary on animal_summary.farm_id = f.id
left join pasture_summary on pasture_summary.farm_id = f.id
left join health_summary on health_summary.farm_id = f.id;

alter table public.animals enable row level security;
alter table public.weight_records enable row level security;
alter table public.health_events enable row level security;
alter table public.feed_items enable row level security;
alter table public.supplementation_records enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;

create policy "animals_member_access"
on public.animals for all
using (public.is_farm_member(farm_id))
with check (public.is_farm_member(farm_id));

create policy "weight_records_member_access"
on public.weight_records for all
using (public.is_farm_member(farm_id))
with check (public.is_farm_member(farm_id));

create policy "health_events_member_access"
on public.health_events for all
using (public.is_farm_member(farm_id))
with check (public.is_farm_member(farm_id));

create policy "feed_items_member_access"
on public.feed_items for all
using (public.is_farm_member(farm_id))
with check (public.is_farm_member(farm_id));

create policy "supplementation_records_member_access"
on public.supplementation_records for all
using (public.is_farm_member(farm_id))
with check (public.is_farm_member(farm_id));

create policy "sales_owner_access"
on public.sales for all
using (public.current_farm_role(farm_id) = 'owner')
with check (public.current_farm_role(farm_id) = 'owner');

create policy "sale_items_owner_access"
on public.sale_items for all
using (public.current_farm_role(farm_id) = 'owner')
with check (public.current_farm_role(farm_id) = 'owner');
