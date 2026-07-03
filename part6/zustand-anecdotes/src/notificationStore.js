import { create } from 'zustand'

let timeoutId = null

const useNotificationStore = create((set) => ({
  message: null,
  actions: {
    notify: (message) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      set({ message })
      timeoutId = setTimeout(() => {
        set({ message: null })
        timeoutId = null
      }, 5000)
    },
  },
}))

export const useNotificationMessage = () => useNotificationStore((state) => state.message)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)
export { useNotificationStore }
