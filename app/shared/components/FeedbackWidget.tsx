'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { FeedbackType, FEEDBACK_MESSAGE_MAX_LENGTH, FEEDBACK_CONTACT_MAX_LENGTH } from '@/app/types'
import type { Translations } from '@/app/types'

export interface FeedbackWidgetProps {
  t: Translations
  lang: string
}

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'rateLimited'

/**
 * Floating feedback button + modal. Lets users send a playlist suggestion,
 * an app suggestion, a complaint, or general feedback. Submissions POST to
 * `/api/feedback`, which forwards them to a Discord webhook server-side.
 *
 * Client component: receives translations and the active language as props
 * (per the app's server → client props convention).
 */
const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ t, lang }) => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<FeedbackType>(FeedbackType.PlaylistSuggestion)
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const containerRef = useRef<HTMLDivElement>(null)
  const dir = t.__language.dir

  const typeOptions: { value: FeedbackType; label: string }[] = [
    { value: FeedbackType.PlaylistSuggestion, label: t.feedback.typePlaylist },
    { value: FeedbackType.AppSuggestion, label: t.feedback.typeApp },
    { value: FeedbackType.Complaint, label: t.feedback.typeComplaint },
    { value: FeedbackType.General, label: t.feedback.typeGeneral },
  ]

  const resetForm = () => {
    setType(FeedbackType.PlaylistSuggestion)
    setMessage('')
    setContact('')
    setStatus('idle')
  }

  const close = () => {
    setOpen(false)
    // Clear a completed submission so reopening starts fresh.
    if (status === 'success') resetForm()
  }

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || status === 'submitting') return

    setStatus('submitting')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message: message.trim(),
          contact: contact.trim() || undefined,
          pageUrl: typeof window !== 'undefined' ? window.location.href : pathname,
          lang,
        }),
      })
      if (res.status === 429) {
        setStatus('rateLimited')
        return
      }
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      setStatus('success')
      setMessage('')
      setContact('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div ref={containerRef}>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.feedback.buttonLabel}
        title={t.feedback.buttonLabel}
        className={`fixed bottom-4 z-40 flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white shadow-lg hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer ${
          dir === 'rtl' ? 'left-4' : 'right-4'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t.feedback.title}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div className="w-full max-w-md rounded-xl bg-slate-800 border border-slate-700 shadow-xl p-5 text-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-100">{t.feedback.title}</h2>
              <button
                type="button"
                onClick={close}
                aria-label={t.feedback.closeLabel}
                className="text-slate-400 hover:text-slate-100 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {status === 'success' ? (
              <p className="py-6 text-center text-sm text-green-400">{t.feedback.successMessage}</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type */}
                <div>
                  <label htmlFor="feedback-type" className="block text-sm font-medium text-slate-300 mb-1">
                    {t.feedback.typeLabel}
                  </label>
                  <select
                    id="feedback-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as FeedbackType)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    {typeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="feedback-message" className="block text-sm font-medium text-slate-300 mb-1">
                    {t.feedback.messageLabel}
                  </label>
                  <textarea
                    id="feedback-message"
                    required
                    rows={4}
                    maxLength={FEEDBACK_MESSAGE_MAX_LENGTH}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.feedback.messagePlaceholder}
                    aria-describedby="feedback-message-count"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  />
                  <p
                    id="feedback-message-count"
                    className={`mt-1 text-xs text-end ${
                      message.length >= FEEDBACK_MESSAGE_MAX_LENGTH ? 'text-amber-400' : 'text-slate-500'
                    }`}
                  >
                    {message.length} / {FEEDBACK_MESSAGE_MAX_LENGTH}
                  </p>
                </div>

                {/* Contact (optional) */}
                <div>
                  <label htmlFor="feedback-contact" className="block text-sm font-medium text-slate-300 mb-1">
                    {t.feedback.contactLabel}
                  </label>
                  <input
                    id="feedback-contact"
                    type="text"
                    maxLength={FEEDBACK_CONTACT_MAX_LENGTH}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={t.feedback.contactPlaceholder}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {status === 'error' && (
                  <p role="alert" className="text-sm text-red-400">
                    {t.feedback.errorMessage}
                  </p>
                )}
                {status === 'rateLimited' && (
                  <p role="alert" className="text-sm text-amber-400">
                    {t.feedback.rateLimitMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting' || !message.trim()}
                  className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === 'submitting' ? t.feedback.submittingLabel : t.feedback.submitLabel}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackWidget
