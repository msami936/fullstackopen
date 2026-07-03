import { create } from 'zustand'
import { useNotificationStore } from './notificationStore'

const baseUrl = 'http://localhost:3001/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initializeAnecdotes: async () => {
      const response = await fetch(baseUrl)
      const anecdotes = await response.json()
      set({ anecdotes })
    },
    vote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      if (!anecdote) {
        return
      }

      const changed = { ...anecdote, votes: anecdote.votes + 1 }
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changed),
      })
      const updated = await response.json()

      set(state => ({
        anecdotes: state.anecdotes.map(a => a.id === id ? updated : a),
      }))

      useNotificationStore.getState().actions.notify(`You voted '${anecdote.content}'`)
    },
    createAnecdote: async (content) => {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, votes: 0 }),
      })
      const newAnecdote = await response.json()

      set(state => ({
        anecdotes: state.anecdotes.concat(newAnecdote),
      }))

      useNotificationStore.getState().actions.notify(`a new anecdote '${content}' added`)
    },
    removeAnecdote: async (id) => {
      await fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
      set(state => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id),
      }))
    },
    setFilter: (filter) => set({ filter }),
  },
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export { useAnecdoteStore }
