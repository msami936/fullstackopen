import { useState } from "react"

const App = () => {
    const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
    ]

    // Uint8Array initializes all its elements to zero by default
    let arrayVotes = new Uint8Array(anecdotes.length)

    // State variables
    const [selected, setSelected] = useState(0) // Index of the currently displayed anecdote
    const [votes, setVotes] = useState(arrayVotes) // Array to store votes for each anecdote
    const [mostVotedIndex, setMostVotedIndex] = useState(0) // Index of the anecdote with the most votes

    // Function to handle displaying the next anecdote
    const handleNextAnecdote = () => {
    // Generate a random index within the range of the `anecdotes` array
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
  
    // Update the `selected` state with the random index
    setSelected(randomIndex);
  }
  

// Function to handle voting for the current anecdote
const handleVotes = () => {
    let maxVotes = 0;
  // Create a copy of the 'votes' array to avoid mutating the state directly
  const updatedVotes = [...votes];
  // Increment the vote count for the currently displayed anecdote
  updatedVotes[selected] += 1;
 
  // Find the anecdote with the most votes and update the state accordingly
  for (let i = 0; i < updatedVotes.length; i++) {
      if (updatedVotes[i] > maxVotes) {
          maxVotes = updatedVotes[i];
          setMostVotedIndex(i); // Update the state with the index of the most voted anecdote
      }
  }

  // Update the 'votes' state with the updated vote counts
  setVotes(updatedVotes);
}

return (
  <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}
      <div>has {votes[selected]} votes</div>
      <div>
          <button onClick={handleVotes}>vote</button>
          <button onClick={handleNextAnecdote}>next anecdote</button>
      </div>
      <h2>Anecdote with most votes</h2>
      {anecdotes[mostVotedIndex]}
  </div>
)
}

export default App