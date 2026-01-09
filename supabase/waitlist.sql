-- Create Waitlist Table
create table if not exists public.waitlist (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    full_name text not null,
    clinic_name text,
    mobile text not null,
    email text not null,
    status text default 'PENDING'::text
);

-- Enable RLS
alter table public.waitlist enable row level security;

-- Policy: Allow public insert (for landing page)
create policy "Allow public insert to waitlist"
on public.waitlist for insert
to anon
with check (true);

-- Policy: Allow admin read
create policy "Allow admin read waitlist"
on public.waitlist for select
to authenticated
using (auth.role() = 'authenticated');
