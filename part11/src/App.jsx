import React from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'
import axios from 'axios'
import { useApi } from './useApi'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import PokemonPage from './PokemonPage'
import PokemonList from './PokemonList'

const mapResults = async ({ results }) => {
  const pokemonList = await Promise.all(
    results.map(async ({ url, name }) => {
      const { data } = await axios.get(url)
      const { type } = data.types.find(({ slot }) => slot === 1)
      return {
        url,
        name,
        id: parseInt(url.match(/\/(\d+)\//)[1]),
        type: type.name
      }
    })
  )

  return pokemonList
}

const App = () => {
  const match = useMatch('/pokemon/:name')
  const { data: pokemonList, error, isLoading } = useApi('https://pokeapi.co/api/v2/pokemon/?limit=50', mapResults)

  if (isLoading) {
    return <LoadingSpinner />
  }
  if (error) {
    return <ErrorMessage error={error} />
  }

  let next = null
  let previous = null

  if (match && match.params) {
    const pokemonId = pokemonList.find(({ name }) => name === match.params.name).id
    previous = pokemonList.find(({ id }) => id === pokemonId - 1)
    next = pokemonList.find(({ id }) => id === pokemonId + 1)
  }

  return (
    <Routes>
      <Route exact path="/" element={<PokemonList pokemonList={pokemonList} />} />
      <Route exact path="/pokemon/:name" element={
        <PokemonPage pokemonList={pokemonList} previous={previous} next={next} />
      } />
    </Routes>
  )
}

export default App
