import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotesQuery, useVoteAnecdote } from './hooks/useAnecdotes'

const App = () => {
  const anecdotesQuery = useAnecdotesQuery()
  const voteAnecdote = useVoteAnecdote()

  if (anecdotesQuery.isError) {
    return (
      <div>anecdote service not available due to problems in server</div>
    )
  }

  const anecdotes = anecdotesQuery.data ?? []

  const handleVote = (anecdote) => {
    voteAnecdote.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
