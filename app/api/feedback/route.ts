import {
  FeedbackType,
  feedbackTypes,
  FEEDBACK_MESSAGE_MAX_LENGTH,
  FEEDBACK_CONTACT_MAX_LENGTH,
  type FeedbackPayload,
} from '@/app/types'
import { supabase } from '@/app/lib/supabase'

/**
 * User feedback → Discord webhook.
 *
 * The feedback widget (app/shared/components/FeedbackWidget.tsx) POSTs a
 * `FeedbackPayload` here. We validate it, format a Discord embed, and forward
 * it to the channel webhook in `DISCORD_FEEDBACK_WEBHOOK_URL`.
 *
 * The webhook URL is a server-only secret and is never sent to the browser —
 * the client only ever talks to this route.
 */

// Handlers are dynamic by default; this must run at request time, not build.
export const dynamic = 'force-dynamic'

// --- Rate limiting ----------------------------------------------------------
// Shared, persistent fixed-window limiter backed by Supabase. Because this is a
// public, unauthenticated route on serverless (per-instance memory, cold-start
// resets), the counter can't live in process memory — it lives in Postgres via
// the check_feedback_rate_limit() RPC, which counts atomically across every
// instance. See supabase/migrations/*_add_feedback_rate_limit.sql.
const RATE_LIMIT_MAX = 5 // submissions allowed...
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60 // ...per 10 minutes, per IP

/** Best-effort client IP from proxy headers (Netlify/Vercel set these). */
function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

/**
 * Ask Postgres whether this IP may submit. Returns true when allowed.
 *
 * Fails open: if the limiter query itself errors (DB hiccup), we allow the
 * request rather than block legitimate feedback on infrastructure trouble.
 */
async function isRateLimited(ip: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('check_feedback_rate_limit', {
    client_ip: ip,
    max_requests: RATE_LIMIT_MAX,
    window_seconds: RATE_LIMIT_WINDOW_SECONDS,
  })

  if (error) {
    console.error('feedback: rate-limit check failed, allowing request:', error.message)
    return false
  }
  // RPC returns TRUE when the request is allowed → limited is the negation.
  return data === false
}

// --- Discord formatting -----------------------------------------------------
/** Human-readable label + embed color per feedback type. */
const TYPE_META: Record<FeedbackType, { label: string; color: number }> = {
  [FeedbackType.PlaylistSuggestion]: { label: '🎬 Playlist suggestion', color: 0x2e4b2c },
  [FeedbackType.AppSuggestion]: { label: '💡 App suggestion', color: 0x3b82f6 },
  [FeedbackType.Complaint]: { label: '⚠️ Complaint', color: 0xdc2626 },
  [FeedbackType.General]: { label: '💬 General', color: 0x64748b },
}

function isFeedbackType(v: unknown): v is FeedbackType {
  return typeof v === 'string' && feedbackTypes.includes(v as FeedbackType)
}

export async function POST(request: Request): Promise<Response> {
  const webhookUrl = process.env.DISCORD_FEEDBACK_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('feedback: DISCORD_FEEDBACK_WEBHOOK_URL is not configured')
    return Response.json({ error: 'Feedback is not configured' }, { status: 503 })
  }

  // Throttle before doing any work.
  const ip = getClientIp(request)
  if (await isRateLimited(ip)) {
    return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  // Parse defensively — a malformed body is a client error, not a crash.
  let body: Partial<FeedbackPayload>
  try {
    body = (await request.json()) as Partial<FeedbackPayload>
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!isFeedbackType(body.type)) {
    return Response.json({ error: 'Invalid feedback type' }, { status: 400 })
  }

  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (!message) {
    return Response.json({ error: 'Message is required' }, { status: 400 })
  }
  // Reject over-length input rather than silently truncating, so the sender
  // knows their message wasn't delivered as written.
  if (message.length > FEEDBACK_MESSAGE_MAX_LENGTH) {
    return Response.json(
      { error: `Message must be ${FEEDBACK_MESSAGE_MAX_LENGTH} characters or fewer` },
      { status: 400 },
    )
  }

  const rawContact = typeof body.contact === 'string' ? body.contact.trim() : ''
  if (rawContact.length > FEEDBACK_CONTACT_MAX_LENGTH) {
    return Response.json(
      { error: `Contact must be ${FEEDBACK_CONTACT_MAX_LENGTH} characters or fewer` },
      { status: 400 },
    )
  }
  const contact = rawContact
  const pageUrl = typeof body.pageUrl === 'string' ? body.pageUrl.trim().slice(0, 500) : ''
  const lang = typeof body.lang === 'string' ? body.lang.trim().slice(0, 10) : ''
  const meta = TYPE_META[body.type]

  const fields: { name: string; value: string; inline?: boolean }[] = []
  if (contact) fields.push({ name: 'Contact', value: contact, inline: true })
  if (lang) fields.push({ name: 'Language', value: lang, inline: true })
  if (pageUrl) fields.push({ name: 'Page', value: pageUrl })

  const discordPayload = {
    username: 'Salasel Feedback',
    embeds: [
      {
        title: meta.label,
        description: message,
        color: meta.color,
        fields,
        timestamp: new Date().toISOString(),
      },
    ],
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    })

    if (!res.ok) {
      console.error('feedback: Discord webhook responded', res.status)
      return Response.json({ error: 'Failed to deliver feedback' }, { status: 502 })
    }
  } catch (err) {
    console.error('feedback: Discord webhook request failed', err)
    return Response.json({ error: 'Failed to deliver feedback' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
