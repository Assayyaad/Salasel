import type { Languages, ContentTypes, PresentationStyles, Categories, Classes } from '@/app/types'

import { create } from 'zustand'

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'longest'
  | 'shortest'
  | 'most-videos'
  | 'least-videos'
  | 'alphabetical'
  | 'counter-alphabetical'

export interface FilterState {
  language: Languages
  contentType: ContentTypes
  category: Categories
  presentationStyle: PresentationStyles | 'all'
  class: Classes | 'all'
}

export interface PlaylistState {
  filters: FilterState
  setLanguage: (language: Languages) => void
  setContentType: (contentType: ContentTypes) => void
  setCategory: (category: Categories) => void
  setPresentationStyle: (presentationStyle: PresentationStyles | 'all') => void
  setClass: (classType: Classes | 'all') => void
  resetFilters: () => void
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
}

const defaultFilters: FilterState = {
  language: 'ar',
  contentType: 0,
  presentationStyle: 'all',
  category: 0,
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
  sortBy: 'newest' as SortOption,
  setSortBy: (sort) => set({ sortBy: sort }),
}))
