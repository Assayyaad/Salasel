# TODO

## 1. Fix slow navigation performance

- [x] Profile why home → playlist/:id navigation is slow (likely Supabase round-trip on every navigation)
- [x] Cache `getPlaylists()` result — consider Next.js `unstable_cache` or route-level caching
- [x] Cache `getVideos(playlistId)` per playlist — same approach
- [x] Verify `export const revalidate` is set appropriately on playlist page
- [x] Consider prefetching playlist data on hover (PlaylistCard link)

## 5. Admin page

- [ ] Create `/admin` route (protect with Supabase auth — separate non-anonymous sign-in)
- [ ] Add playlist form: name, thumbnail ID, description, participants, language, type, style, categories, classes
- [ ] On submit: insert into Supabase `playlists` table
- [ ] Add video management: add/remove videos from a playlist
- [ ] On submit: insert/delete from Supabase `videos` table
- [ ] Trigger `npm run build:app` or a Netlify deploy hook after data changes (webhook button)

## 6. Dev environment for Supabase

- [x] Set up Supabase CLI (pinned as a devDependency, run via `npx supabase`)
- [x] Slimmed local stack to DB + REST + Studio only (`supabase/config.toml`)
- [x] Define schema as migrations in `supabase/migrations/` (baseline + drop-unused-tables, with grants)
- [x] Single `APP_ENV` switch in `.env` selects local vs prod for dev/build/start
- [x] `npm run seed:local` / `npm run seed` for local vs prod seeding
- [x] `.env.example` template committed; real `.env` gitignored
- [x] Document local setup, schema migrations, and prod push in README
- [ ] Reconcile remote: mark baseline as applied, then push the drop migration:
      `npx supabase migration repair --status applied 20260623000000 && npx supabase db push`

## 7. Browser extension — "continue watching" prompt (local only)

- [ ] On a salasel.app tab: read the user's single most recent watched playlist (most recent entry + its progress / last-stopped video) from the site's local storage
- [ ] Persist that single "most recent" record locally in the extension via `chrome.storage` (no server, no Supabase)
- [ ] On YouTube home page: the distraction block/hide is already implemented — keep it as-is
- [ ] Add a "continue watching" div on the YouTube home page that surfaces the stored most-recent playlist and prompts the user whether they want to continue watching
- [ ] If the user chooses to continue: the div links out to the exact stop point — `youtube.com/watch?v={videoId}&list={playlistId}` derived from the locally stored most-recent playlist + progress
- [ ] If there is no stored record (user never visited salasel.app / no progress yet): show nothing extra, just the existing block behavior

## 8. Extension popup — "Hide" keyword

- [ ] Add "Hide" to the list of distraction keywords the extension blocks/hides on YouTube
- [ ] Update extension popup UI to show "Hide" in the keywords list or toggle
- [ ] Test that elements matching "Hide" label are correctly suppressed on YouTube pages
