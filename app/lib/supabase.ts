import { createClient } from '@supabase/supabase-js'

/**
 * Pick the Supabase target from APP_ENV: 'development' uses the local Docker
 * stack, anything else (default) uses production. One switch in .env controls
 * dev, build, and start alike.
 *
 * This module is imported only by server-side data code (app/api/*), so the
 * vars are read at build/render time and never shipped to the browser.
 */
const isDev = process.env.APP_ENV === 'development'

const supabaseUrl = isDev ? process.env.DEV_SUPABASE_URL : process.env.PROD_SUPABASE_URL
const supabaseAnonKey = isDev ? process.env.DEV_SUPABASE_ANON_KEY : process.env.PROD_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase config for APP_ENV="${process.env.APP_ENV ?? 'production'}". ` +
      'Check DEV_/PROD_ SUPABASE_URL and SUPABASE_ANON_KEY in .env',
  )
}

// One-line breadcrumb so it's obvious which database the app is talking to.
console.log(`[supabase] ${isDev ? 'DEVELOPMENT (local)' : 'PRODUCTION (cloud)'} → ${supabaseUrl}`)

/**
 * Read-only client for public content (playlists, videos).
 * Uses the anon/publishable key; access is gated by RLS public-read policies.
 * No user authentication is involved.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
