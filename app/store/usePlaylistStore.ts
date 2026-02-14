import type { Languages, Categories, PresentationStyles, Classes } from '@/app/types'

import { create } from 'zustand'
import { categories } from '@/app/static'
import { ContentTypes } from '@/app/types'

interface FilterState {
  language: Languages
  contentType: ContentTypes
  category: Categories
  presentationStyle: PresentationStyles | 'all'
  class: Classes | 'all'
}

interface PlaylistState {
  filters: FilterState
  setLanguage: (language: Languages) => void
  setContentType: (contentType: ContentTypes) => void
  setCategory: (category: Categories) => void
  setPresentationStyle: (presentationStyle: PresentationStyles | 'all') => void
  setClass: (classType: Classes | 'all') => void
  resetFilters: () => void
}

const defaultFilters: FilterState = {
  language: 'ar',
  contentType: ContentTypes.Educational,
  presentationStyle: 'all',
  category: categories[0],
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
