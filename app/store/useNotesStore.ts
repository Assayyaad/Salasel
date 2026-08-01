import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { NoteRecord, NotesHandoffPayload } from '@/app/types'

/** localStorage key the extension writes the full notes snapshot to */
export const NOTES_INBOX_KEY = 'salasel-notes-inbox'

/** DOM event the extension dispatches after writing the inbox key */
export const NOTES_UPDATED_EVENT = 'salasel:notes-updated'

/** localStorage key the app writes its full notes snapshot to, for the extension to read */
export const NOTES_OUTBOX_KEY = 'salasel-notes-outbox'

/** DOM event the app dispatches after writing the outbox key */
export const NOTES_APP_UPDATED_EVENT = 'salasel:app-notes-updated'

export interface NotesState {
  /** Canonical app notes, keyed by videoId */
  notes: Record<string, NoteRecord>
  /** Upsert a single note using last-write-wins on updatedAt */
  upsertNote: (note: NoteRecord) => void
  /** Import a full snapshot from the extension (last-write-wins per video) */
  importSnapshot: (incoming: Record<string, NoteRecord>) => void
  /** Get the note for a single video, if any */
  getNote: (videoId: string) => NoteRecord | undefined
  /** Get all notes whose playlistId matches the given playlist */
  getNotesForPlaylist: (playlistId: string) => NoteRecord[]
}

/** Validate a single record loosely — extension data is untrusted */
function isValidRecord(rec: unknown): rec is NoteRecord {
  if (!rec || typeof rec !== 'object') return false
  const r = rec as Record<string, unknown>
  return typeof r.videoId === 'string' && typeof r.text === 'string'
}

/** Normalize a loosely-validated record into a well-formed NoteRecord */
function normalizeRecord(rec: NoteRecord): NoteRecord {
  return {
    videoId: rec.videoId,
    playlistId: typeof rec.playlistId === 'string' ? rec.playlistId : null,
    text: rec.text,
    updatedAt: typeof rec.updatedAt === 'number' && Number.isFinite(rec.updatedAt) ? rec.updatedAt : 0,
  }
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: {},
      upsertNote: (note) => {
        set((state) => {
          if (!isValidRecord(note)) return state
          const incoming = normalizeRecord(note)
          const existing = state.notes[incoming.videoId]
          // Last-write-wins: keep whichever has the larger updatedAt.
          if (existing && existing.updatedAt >= incoming.updatedAt) return state
          return { notes: { ...state.notes, [incoming.videoId]: incoming } }
        })
        // Publish to the extension after a local edit (app -> extension direction).
        exportNotesToExtension(get().notes)
      },
      importSnapshot: (incoming) =>
        set((state) => {
          if (!incoming || typeof incoming !== 'object') return state
          const next = { ...state.notes }
          let changed = false
          for (const [videoId, rec] of Object.entries(incoming)) {
            if (!isValidRecord(rec)) continue
            const normalized = normalizeRecord(rec)
            const existing = next[videoId]
            // Never delete notes absent from the snapshot; only upsert newer ones.
            if (existing && existing.updatedAt >= normalized.updatedAt) continue
            next[videoId] = normalized
            changed = true
          }
          return changed ? { notes: next } : state
        }),
      getNote: (videoId) => get().notes[videoId],
      getNotesForPlaylist: (playlistId) =>
        Object.values(get().notes)
          .filter((n) => n.playlistId === playlistId)
          .sort((a, b) => b.updatedAt - a.updatedAt),
    }),
    {
      name: 'notes-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

/**
 * Read the extension inbox from localStorage, validate it, and import the notes.
 * Safe to call on load and on every `salasel:notes-updated` event. Never throws.
 */
export function importNotesFromExtension(): void {
  if (typeof window === 'undefined') return

  let raw: string | null
  try {
    raw = window.localStorage.getItem(NOTES_INBOX_KEY)
  } catch {
    return
  }
  if (!raw) return

  let payload: Partial<NotesHandoffPayload>
  try {
    payload = JSON.parse(raw)
  } catch {
    return
  }

  if (!payload || payload.source !== 'salasel-extension' || payload.version !== 1) return

  const incoming = payload.notes && typeof payload.notes === 'object' ? payload.notes : {}
  useNotesStore.getState().importSnapshot(incoming)
}

/**
 * Write the app's full notes snapshot to localStorage["salasel-notes-outbox"]
 * and notify the extension via a `salasel:app-notes-updated` event. This is the
 * app -> extension direction; the extension reads this key and merges with
 * last-write-wins on `updatedAt` (same rule the app uses for the inbox). The
 * payload shape mirrors NotesHandoffPayload so both sides share one schema.
 * Never throws.
 */
export function exportNotesToExtension(notes: Record<string, NoteRecord>): void {
  if (typeof window === 'undefined') return

  const payload: NotesHandoffPayload = {
    source: 'salasel-extension',
    version: 1,
    exportedAt: Date.now(),
    notes,
  }

  try {
    window.localStorage.setItem(NOTES_OUTBOX_KEY, JSON.stringify(payload))
  } catch {
    return
  }

  try {
    window.dispatchEvent(new CustomEvent(NOTES_APP_UPDATED_EVENT))
  } catch {
    // Ignore environments without CustomEvent support.
  }
}
