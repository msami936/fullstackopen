import { useAnecdoteStore } from './store'

describe('anecdote store', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.restoreAllMocks()
  })

  test('is initialized with anecdotes from the backend', async () => {
    const anecdotes = [
      { content: 'If it hurts, do it more often', id: '47145', votes: 0 },
      { content: 'Adding manpower to a late software project makes it later!', id: '21149', votes: 0 },
    ]

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve(anecdotes),
    }))

    await useAnecdoteStore.getState().actions.initializeAnecdotes()

    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/anecdotes')
    expect(useAnecdoteStore.getState().anecdotes).toEqual(anecdotes)
  })
})
