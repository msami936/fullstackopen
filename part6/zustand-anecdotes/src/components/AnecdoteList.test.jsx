import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AnecdoteList from './AnecdoteList'
import Filter from './Filter'
import { useAnecdoteStore } from '../store'

describe('<AnecdoteList />', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.restoreAllMocks()
  })

  test('displays anecdotes sorted by votes', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: '1', content: 'low votes', votes: 1 },
        { id: '2', content: 'high votes', votes: 5 },
        { id: '3', content: 'mid votes', votes: 3 },
      ],
    })

    render(<AnecdoteList />)

    const orderedContents = ['high votes', 'mid votes', 'low votes']
    const contentElements = orderedContents.map(content => screen.getByText(content))

    for (let i = 0; i < contentElements.length - 1; i++) {
      expect(
        contentElements[i].compareDocumentPosition(contentElements[i + 1])
        & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy()
    }
  })

  test('displays only anecdotes matching the filter', async () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: '1', content: 'React is great', votes: 0 },
        { id: '2', content: 'Zustand is simple', votes: 0 },
      ],
    })

    const user = userEvent.setup()

    render(
      <>
        <Filter />
        <AnecdoteList />
      </>
    )

    await user.type(screen.getByRole('textbox'), 'React')

    expect(screen.getByText('React is great')).toBeInTheDocument()
    expect(screen.queryByText('Zustand is simple')).not.toBeInTheDocument()
  })

  test('voting increases the vote count for an anecdote', async () => {
    const anecdote = { id: '1', content: 'test anecdote', votes: 2 }

    useAnecdoteStore.setState({ anecdotes: [anecdote] })

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ ...anecdote, votes: 3 }),
    }))

    const user = userEvent.setup()

    render(<AnecdoteList />)

    await user.click(screen.getByRole('button', { name: 'vote' }))

    await waitFor(() => {
      expect(screen.getByText('has 3')).toBeInTheDocument()
    })

    expect(useAnecdoteStore.getState().anecdotes[0].votes).toBe(3)
  })
})
