import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import PokemonList from '../src/PokemonList'


const pokemonList = [{
  url: 'https://pokeapi.co/api/v2/pokemon/1/',
  name: 'bulbasaur',
  id: 1,
  type: 'grass'
}, {
  url: 'https://pokeapi.co/api/v2/pokemon/133/',
  name: 'eevee',
  id: 133,
  type: 'normal'
}]

describe('<PokemonList />', () => {
  it('should render items', () => {
    render(
      <BrowserRouter>
        <PokemonList pokemonList={pokemonList} />
      </BrowserRouter>
    )
    expect(screen.getByText('bulbasaur')).toBeVisible()
    expect(screen.getByText('eevee')).toBeVisible()
    expect(screen.getByText('bulbasaur').closest('a')).toHaveClass('pokemon-type-grass')
    expect(screen.getByText('eevee').closest('a')).toHaveClass('pokemon-type-normal')
  })
})
