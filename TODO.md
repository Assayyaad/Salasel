# TODO

## 1. Fix slow navigation performance

- [ ] Profile why home → playlist/:id navigation is slow (likely Supabase round-trip on every navigation)
- [ ] Cache `getPlaylists()` result — consider Next.js `unstable_cache` or route-level caching
- [ ] Cache `getVideos(playlistId)` per playlist — same approach
- [ ] Verify `export const revalidate` is set appropriately on playlist page
- [ ] Consider prefetching playlist data on hover (PlaylistCard link)

## 2. User progress → Supabase

- [ ] Set up anonymous auth: call `supabase.auth.signInAnonymously()` on first app load, persist session
- [ ] Create `api/progress.ts` — `getCompletedVideos(playlistId)`, `toggleVideoCompleted(playlistId, videoId)`
- [ ] Update `SelectedPlaylistContent.tsx` to fetch/mutate via Supabase instead of `useProgressStore`
- [ ] Update `useProgressStore` — keep `recentPlaylists` only, remove `completedVideos` and `toggleVideoCompleted`
- [ ] Create `api/recent.ts` — `recordPlaylistVisit(playlistId)` calling the `record_playlist_visit` RPC
- [ ] Update `RecordVisit.tsx` to call the Supabase RPC instead of the store
- [ ] Update `RecentlyWatched.tsx` to fetch recent playlists from Supabase instead of the store
- [ ] Remove `useProgressStore` entirely once all consumers are migrated

## 3. Bookmarks → Supabase

- [ ] Create `api/bookmarks.ts` — `getBookmarks()`, `toggleBookmark(playlistId)`
- [ ] Update `BookmarkButton.tsx` to read/write via Supabase instead of `useBookmarkStore`
- [ ] Update home page bookmark filter to fetch from Supabase
- [ ] Remove `useBookmarkStore` once all consumers are migrated

## 4. i18n performance

- [ ] Investigate why i18n feels slow — likely `require()` in `translationsMap` re-running or layout rehydration
- [ ] Move translations loading to a cached utility so it doesn't re-fetch on every render
- [ ] Verify `getTranslations()` is not called inside client components (should always be server-side)

## 5. Admin page

- [ ] Create `/admin` route (protect with Supabase auth — separate non-anonymous sign-in)
- [ ] Add playlist form: name, thumbnail ID, description, participants, language, type, style, categories, classes
- [ ] On submit: insert into Supabase `playlists` table
- [ ] Add video management: add/remove videos from a playlist
- [ ] On submit: insert/delete from Supabase `videos` table
- [ ] Trigger `npm run build:app` or a Netlify deploy hook after data changes (webhook button)

## 6. Dev environment for Supabase

- [ ] Set up Supabase CLI (`npm install -g supabase`)
- [ ] `supabase init` and `supabase link --project-ref <ref>`
- [ ] Pull current schema: `supabase db pull` → generates `supabase/migrations/`
- [ ] Add `supabase/seed.sql` or keep using `npm run seed` for local seeding
- [ ] Create `.env.local` for dev pointing to local Supabase instance (`supabase start`)
- [ ] Document local dev setup in README

## 7. Browser extension → Supabase progress tracking

- [ ] Share anon session token between the web app and the extension (via `chrome.storage`)
- [ ] In extension: import Supabase JS client (bundle it or use CDN)
- [ ] Detect video completion on YouTube (ended event or progress ≥ 95%)
- [ ] On completion: call `supabase.from('user_progress').upsert(...)` with the video + playlist ID
- [ ] Handle playlist ID — extract `list=` param from YouTube URL
- [ ] Sync session on extension install: prompt user to visit salasel.app first to establish anon identity

## 8. Extension popup — "Hide" keyword

- [ ] Add "Hide" to the list of distraction keywords the extension blocks/hides on YouTube
- [ ] Update extension popup UI to show "Hide" in the keywords list or toggle
- [ ] Test that elements matching "Hide" label are correctly suppressed on YouTube pages
