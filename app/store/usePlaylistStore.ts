import type { Languages, ContentTypes, PresentationStyles, Categories, Classes } from '@/app/types'

import { create } from 'zustand'

export interface FilterState {
  language: Languages | 'all'
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
  language: 'all',
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
