import { create } from 'zustand'

interface SsrState {
  pageHasBeenInitializedOnServer: boolean
  setPageHasBeenInitializedOnServer: (value: boolean) => void
}

export const useSsrStore = create<SsrState>(set => ({
  pageHasBeenInitializedOnServer: false,
  setPageHasBeenInitializedOnServer: value =>
    set({ pageHasBeenInitializedOnServer: value }),
}))
