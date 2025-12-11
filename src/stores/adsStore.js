import { create } from 'zustand'

export const useAdsStore = create((set) => ({
    editJob: null,
    copyJob: null,

    // Setters
    setEditJob: (job) => set({ editJob: job }),
    clearEditJob: () => set({ editJob: null }),

    setCopyJob: (job) => set({ copyJob: job }),
    clearCopyJob: () => set({ copyJob: null }),
}))