import { create } from "zustand";

interface PlaylistState {
  // State variables
  activeFilter: string;

  // Actions
  setActiveFilter: (filter: string) => void;
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  activeFilter: "الكل",

  setActiveFilter: (filter) => set({ activeFilter: filter }),
}))

