import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { NoteRecord, NotesHandoffPayload } from '@/app/types'

/** localStorage key the extension writes the full notes snapshot to */
export const NOTES_INBOX_KEY = 'salasel-notes-inbox'

/** DOM event the extension dispatches after writing the inbox key */
export const NOTES_UPDATED_EVENT = 'salasel:notes-updated'

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
      upsertNote: (note) =>
        set((state) => {
          if (!isValidRecord(note)) return state
          const incoming = normalizeRecord(note)
          const existing = state.notes[incoming.videoId]
          // Last-write-wins: keep whichever has the larger updatedAt.
          if (existing && existing.updatedAt >= incoming.updatedAt) return state
          return { notes: { ...state.notes, [incoming.videoId]: incoming } }
        }),
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
