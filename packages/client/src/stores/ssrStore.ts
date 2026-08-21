import { create } from 'zustand'

interface SsrState {
  /** Pathname страницы, для которой на SSR уже вызвали fetchData. null — не инициализировали. */
  initializedPath: string | null
  setInitializedPath: (path: string | null) => void
}

export const useSsrStore = create<SsrState>(set => ({
  initializedPath: null,
  setInitializedPath: path => set({ initializedPath: path }),
}))
