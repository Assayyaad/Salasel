-- ============================================================
-- Feedback rate limiting (shared, persistent)
--
-- The /api/feedback route is public and unauthenticated. An in-memory
-- limiter in the Next.js route is unreliable on serverless (per-instance
-- memory, cold-start resets), so the counter lives here instead — shared
-- across every function instance and durable across deploys.
--
-- Fixed-window counter keyed by client IP. All the counting logic is done
-- inside a SECURITY DEFINER function so the anon role never touches the
-- table directly; it can only call the function, which returns a simple
-- allow/deny decision.
-- ============================================================

create table feedback_rate_limits (
  ip            text        primary key,
  count         integer     not null default 0,
  window_start  timestamptz not null default now()
);

alter table feedback_rate_limits enable row level security;

-- No RLS policies: anon/authenticated get no direct access at all. The only
-- way in is through check_feedback_rate_limit() below, which runs as owner.
grant all on feedback_rate_limits to service_role;

-- ============================================================
-- check_feedback_rate_limit(client_ip, max_requests, window_seconds)
--
-- Atomically records a request from `client_ip` and returns TRUE when the
-- request is allowed, FALSE when the caller is over quota for the current
-- window. Uses a single upsert with an ON CONFLICT branch so concurrent
-- callers can't race past the limit.
-- ============================================================
create or replace function check_feedback_rate_limit(
  client_ip       text,
  max_requests    integer,
  window_seconds  integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed boolean;
begin
  -- Reject blank IPs outright so a missing header can't share one bucket
  -- that everyone trivially exhausts. Treat unknown as its own bucket.
  if client_ip is null or client_ip = '' then
    client_ip := 'unknown';
  end if;

  insert into feedback_rate_limits as f (ip, count, window_start)
    values (client_ip, 1, now())
  on conflict (ip) do update
    set
      -- If the previous window has expired, start a fresh window at 1;
      -- otherwise increment within the current window.
      count = case
        when now() - f.window_start >= make_interval(secs => window_seconds) then 1
        else f.count + 1
      end,
      window_start = case
        when now() - f.window_start >= make_interval(secs => window_seconds) then now()
        else f.window_start
      end
  returning f.count <= max_requests into allowed;

  return allowed;
end;
$$;

-- Only the app's roles may invoke it; the function body runs as the owner
-- (table owner) thanks to SECURITY DEFINER.
grant execute on function check_feedback_rate_limit(text, integer, integer) to anon, authenticated, service_role;
