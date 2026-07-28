-- ============================================================
-- Add explicit ordering to videos
--
-- Videos previously had no ordering column; order was implicit
-- (insertion order / uploaded_at). The admin app needs to let editors
-- drag-reorder videos within a playlist, and the public site must
-- respect that order when displaying playlist contents.
--
-- Backfill: existing rows get a position based on their current
-- uploaded_at ordering (earliest = 0), per playlist, so this migration
-- is purely additive and doesn't change how existing playlists render.
-- ============================================================

alter table videos add column position integer not null default 0;

with ordered as (
  select
    id,
    row_number() over (
      partition by playlist_id
      order by uploaded_at, id
    ) - 1 as new_position
  from videos
)
update videos
set position = ordered.new_position
from ordered
where videos.id = ordered.id;

-- Videos within a playlist are now listed/paged in explicit order
-- rather than by upload date.
create index on videos (playlist_id, position);
