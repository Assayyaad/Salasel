import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { LanguageCode } from '@/app/types'

/** Which side of the watch page the notes panel sits on. */
export type NotesSide = 'start' | 'end'

export interface PreferencesState {
  /** Notes panel placement on the watch page ('start' = leading side, 'end' = trailing). */
  notesSide: NotesSide
  setNotesSide: (side: NotesSide) => void
  toggleNotesSide: () => void
  /** User's chosen UI language; null until they pick one on first visit. */
  preferredLanguage: LanguageCode | null
  setPreferredLanguage: (lang: LanguageCode) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      notesSide: 'end',
      setNotesSide: (side) => set({ notesSide: side }),
      toggleNotesSide: () => set((state) => ({ notesSide: state.notesSide === 'end' ? 'start' : 'end' })),
      preferredLanguage: null,
      setPreferredLanguage: (lang) => set({ preferredLanguage: lang }),
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
