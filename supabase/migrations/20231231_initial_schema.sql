-- Enable PostGIS extension
create extension if not exists postgis;

-- Create tables
create table public.users (
    id uuid references auth.users not null primary key,
    email text not null unique,
    name text,
    location geometry(Point, 4326),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.clubs (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    location geometry(Point, 4326) not null,
    facilities jsonb default '[]'::jsonb,
    booking_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.courts (
    id uuid default gen_random_uuid() primary key,
    club_id uuid references public.clubs not null,
    name text not null,
    type text not null,
    price_per_hour decimal not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.availability (
    id uuid default gen_random_uuid() primary key,
    court_id uuid references public.courts not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    status text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index users_location_idx on public.users using gist (location);
create index clubs_location_idx on public.clubs using gist (location);
create index availability_start_time_idx on public.availability(start_time);
create index availability_end_time_idx on public.availability(end_time);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.clubs enable row level security;
alter table public.courts enable row level security;
alter table public.availability enable row level security;

-- Create policies
create policy "Users can view all clubs" 
    on public.clubs for select 
    using (true);

create policy "Users can view all courts" 
    on public.courts for select 
    using (true);

create policy "Users can view all availability" 
    on public.availability for select 
    using (true);

create policy "Users can view their own profile" 
    on public.users for select 
    using (auth.uid() = id);

-- Create functions
create or replace function public.nearby_clubs(
    search_location geometry(Point, 4326),
    max_distance_km float default 10
)
returns setof public.clubs
language sql
stable
as $$
    select *
    from public.clubs
    where ST_DWithin(
        location,
        search_location,
        max_distance_km * 1000  -- Convert km to meters
    )
    order by ST_Distance(location, search_location);
$$;
