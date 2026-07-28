-- ============================================================
-- Salasel baseline schema
--
-- Content tables only. User state (progress, bookmarks, recent
-- playlists) currently lives in the browser via localStorage +
-- Zustand, so no user tables exist here yet. If/when that moves
-- server-side, add it in a later migration.
--
-- Mirrors app/models/playlist.ts and app/models/video.ts and the
-- columns written by bin/seed.js.
-- ============================================================

-- ============================================================
-- playlists  (public read-only content)
-- ============================================================
create table playlists (
  id            text        primary key,
  name          text        not null,
  thumbnail_id  text        not null,
  description   text        not null default '',
  participants  text[]      not null default '{}',
  language      text        not null,            -- 'ar' | 'en' | 'ja'
  type          smallint    not null,            -- ContentTypes  0|1|2
  style         smallint    not null,            -- PresentationStyles  0|1|2|3
  categories    smallint[]  not null default '{}', -- Categories[]  0|1|2
  classes       smallint[]  not null default '{}', -- Classes[]  0|1|2|3
  video_count   integer     not null default 0,
  duration      integer     not null default 0,    -- seconds
  start_date    bigint      not null default 0,    -- unix epoch
  end_date      bigint      not null default 0     -- unix epoch
);

alter table playlists enable row level security;

-- Anyone (including anonymous) can read playlists.
create policy "playlists: public read"
  on playlists for select
  using (true);

-- Table-level privileges. Under the current Supabase default, new tables
-- in `public` are NOT auto-exposed to the Data API roles, so grants are
-- explicit. RLS policies above still gate row visibility for anon.
grant select on playlists to anon, authenticated;
grant all    on playlists to service_role;

-- No insert/update/delete policy for anon/authenticated: writes are
-- blocked for them. The seed script / CLI use the service-role key,
-- which bypasses RLS and has full privileges via the grant above.

-- ============================================================
-- videos  (public read-only content)
-- ============================================================
create table videos (
  id           text     primary key,
  playlist_id  text     not null references playlists(id) on delete cascade,
  title        text     not null,
  duration     integer  not null default 0,   -- seconds
  uploaded_at  bigint   not null default 0    -- unix epoch
);

create index on videos (playlist_id);

alter table videos enable row level security;

-- Anyone (including anonymous) can read videos.
create policy "videos: public read"
  on videos for select
  using (true);

-- Table-level privileges (see playlists above for rationale).
grant select on videos to anon, authenticated;
grant all    on videos to service_role;
