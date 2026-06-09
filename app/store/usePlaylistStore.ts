import type { Languages, ContentTypes, PresentationStyles, Categories, Classes } from '@/app/types'

import { create } from 'zustand'

export interface FilterState {
  language: Languages
  contentType: ContentTypes | 'all'
  category: Categories | 'all'
  presentationStyle: PresentationStyles | 'all'
  class: Classes | 'all'
}

export interface PlaylistState {
  filters: FilterState
  setLanguage: (language: Languages) => void
  setContentType: (contentType: ContentTypes | 'all') => void
  setCategory: (category: Categories | 'all') => void
  setPresentationStyle: (presentationStyle: PresentationStyles | 'all') => void
  setClass: (classType: Classes | 'all') => void
  resetFilters: () => void
}

const defaultFilters: FilterState = {
  language: 'ar',
  contentType: 'all',
  presentationStyle: 'all',
  category: 'all',
  class: 'all',
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  filters: defaultFilters,
  setLanguage: (l) => set((state) => ({ filters: { ...state.filters, language: l } })),
  setContentType: (t) => set((state) => ({ filters: { ...state.filters, contentType: t } })),
  setPresentationStyle: (s) => set((state) => ({ filters: { ...state.filters, presentationStyle: s } })),
  setCategory: (c) => set((state) => ({ filters: { ...state.filters, category: c } })),
  setClass: (c) => set((state) => ({ filters: { ...state.filters, class: c } })),
  resetFilters: () => set({ filters: defaultFilters }),
}))
