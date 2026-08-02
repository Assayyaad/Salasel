// CommonJS — used only in Node.js scripts (seed, CLI).
// Never imported by the Next.js app.
const { createClient } = require('@supabase/supabase-js')

// Mirror the app's APP_ENV switch: 'development' targets the local Docker
// stack, anything else targets production.
const isDev = process.env.APP_ENV === 'development'

const supabaseUrl = isDev ? process.env.DEV_SUPABASE_URL : process.env.PROD_SUPABASE_URL
const serviceRoleKey = isDev ? process.env.DEV_SUPABASE_SERVICE_ROLE_KEY : process.env.PROD_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    `Missing Supabase config for APP_ENV="${process.env.APP_ENV || 'production'}". ` +
      'Check DEV_/PROD_ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env',
  )
}

/**
 * Service-role client for server-side scripts.
 * Bypasses RLS — only use in trusted Node.js contexts (seed, CLI).
 * Never expose this key to the browser.
 */
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

module.exports = { supabaseAdmin }
