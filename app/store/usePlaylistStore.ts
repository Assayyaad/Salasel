import type { Languages, ContentTypes, PresentationStyles, Categories, Classes } from '@/app/types'

import { create } from 'zustand'

export interface FilterState {
  /**
   * `null` means the user has not touched the language filter yet, so consumers
   * fall back to the language in the URL. `'all'` is an explicit user choice to
   * see every language and must not be re-derived from the URL.
   */
  language: Languages | 'all' | null
  contentType: ContentTypes | 'all'
  category: Categories | 'all'
  presentationStyle: PresentationStyles | 'all'
  class: Classes | 'all'
  bookmarkedOnly: boolean
}

export interface PlaylistState {
  filters: FilterState
  setLanguage: (language: Languages | 'all') => void
  setContentType: (contentType: ContentTypes | 'all') => void
  setCategory: (category: Categories | 'all') => void
  setPresentationStyle: (presentationStyle: PresentationStyles | 'all') => void
  setClass: (classType: Classes | 'all') => void
  setBookmarkedOnly: (bookmarkedOnly: boolean) => void
  resetFilters: () => void
}

const defaultFilters: FilterState = {
  language: null,
  contentType: 'all',
  presentationStyle: 'all',
  category: 'all',
  class: 'all',
  bookmarkedOnly: false,
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  filters: defaultFilters,
  setLanguage: (l) => set((state) => ({ filters: { ...state.filters, language: l } })),
  setContentType: (t) => set((state) => ({ filters: { ...state.filters, contentType: t } })),
  setPresentationStyle: (s) => set((state) => ({ filters: { ...state.filters, presentationStyle: s } })),
  setCategory: (c) => set((state) => ({ filters: { ...state.filters, category: c } })),
  setClass: (c) => set((state) => ({ filters: { ...state.filters, class: c } })),
  setBookmarkedOnly: (b) => set((state) => ({ filters: { ...state.filters, bookmarkedOnly: b } })),
  resetFilters: () => set({ filters: defaultFilters }),
}))

/**
 * The language filter to actually apply. Until the user picks one explicitly,
 * this is the language from the URL, so `/ar/` lists Arabic playlists first.
 */
export const effectiveLanguage = (filter: FilterState['language'], lang: Languages): Languages | 'all' => filter ?? lang
