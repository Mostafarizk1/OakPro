-- OAK PRO blog — run once in Supabase: SQL Editor → New query → paste → Run.
-- Then: Authentication → Providers → Email: turn OFF "Allow new users to sign up"
-- (admins are created manually under Authentication → Users → Add user).

create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null default gen_random_uuid(),      -- links the AR and EN versions of one article
  locale text not null check (locale in ('ar','en')),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null default '',
  content text not null default '',                       -- sanitized HTML
  cover_url text, cover_w int, cover_h int, cover_alt text, og_url text,
  meta_title text, meta_description text,
  status text not null default 'draft' check (status in ('draft','published')),
  reading_minutes int not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (locale, slug)
);
create index if not exists posts_listing on public.posts (locale, status, published_at desc);

alter table public.posts enable row level security;

drop policy if exists "public reads published" on public.posts;
create policy "public reads published" on public.posts for select using (status = 'published');
drop policy if exists "admins read all" on public.posts;
create policy "admins read all" on public.posts for select to authenticated using (true);
drop policy if exists "admins insert" on public.posts;
create policy "admins insert" on public.posts for insert to authenticated with check (true);
drop policy if exists "admins update" on public.posts;
create policy "admins update" on public.posts for update to authenticated using (true) with check (true);
drop policy if exists "admins delete" on public.posts;
create policy "admins delete" on public.posts for delete to authenticated using (true);

-- Image bucket (public read, only signed-in admins can write). The app converts every upload to WebP/JPEG first.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog', 'blog', true, 5242880, array['image/webp','image/jpeg'])
on conflict (id) do nothing;

drop policy if exists "public reads blog images" on storage.objects;
create policy "public reads blog images" on storage.objects for select using (bucket_id = 'blog');
drop policy if exists "admins upload blog images" on storage.objects;
create policy "admins upload blog images" on storage.objects for insert to authenticated with check (bucket_id = 'blog');
drop policy if exists "admins update blog images" on storage.objects;
create policy "admins update blog images" on storage.objects for update to authenticated using (bucket_id = 'blog');
drop policy if exists "admins delete blog images" on storage.objects;
create policy "admins delete blog images" on storage.objects for delete to authenticated using (bucket_id = 'blog');
