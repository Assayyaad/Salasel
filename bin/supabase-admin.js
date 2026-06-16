// CommonJS — used only in Node.js scripts (seed, CLI).
// Never imported by the Next.js app.
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
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
