-- ============================================================
-- Drop unused user-state tables and helper function.
--
-- These were created on the remote but are not referenced by the
-- app — progress, bookmarks, and recent playlists are stored in the
-- browser (localStorage + Zustand). Removing them to keep the schema
-- minimal. Re-introduce in a fresh migration if user state ever
-- moves server-side.
--
-- DESTRUCTIVE: dropping these tables deletes any rows they hold on
-- the remote. They are currently unused, so there is no app data to
-- lose, but this cannot be undone via migration rollback.
-- ============================================================

drop function if exists public.record_playlist_visit(text);

drop table if exists public.user_progress;
drop table if exists public.user_recent_playlists;
drop table if exists public.user_bookmarks;
