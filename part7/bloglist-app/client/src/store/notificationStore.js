import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

let timeoutId = null

const useNotificationStore = create((set) => ({
  message: null,
  type: null,
  notify: (message, type) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    set({ message, type })
    timeoutId = setTimeout(() => {
      set({ message: null, type: null })
      timeoutId = null
    }, 5000)
  },
}))

export const useNotification = () =>
  useNotificationStore(
    useShallow((state) => ({
      message: state.message,
      type: state.type,
    }))
  )

export const useNotify = () => useNotificationStore((state) => state.notify)
