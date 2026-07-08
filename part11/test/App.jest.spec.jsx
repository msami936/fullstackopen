import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import axiosMock from 'axios'
import '@testing-library/jest-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from '../src/App'

jest.mock('axios')

describe('<App />', () => {
  it('fetches data', async () => {
    axiosMock.get.mockImplementation((url) => {
      if (url === 'https://pokeapi.co/api/v2/pokemon/?limit=50') {
        return Promise.resolve({
          data: {
            results: [{ url: 'https://pokeapi.co/api/v2/pokemon/1/', name: 'bulbasaur' }]
          }
        })
      }

      if (url === 'https://pokeapi.co/api/v2/pokemon/1/') {
        return Promise.resolve({
          data: {
            types: [{ slot: 1, type: { name: 'grass' } }]
          }
        })
      }

      return Promise.reject(new Error(`Unexpected url: ${url}`))
    })
    await act(async () => {
      render(<Router><App/></Router>)
    })
    expect(axiosMock.get).toHaveBeenCalledTimes(2)
    expect(axiosMock.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/?limit=50')
    expect(axiosMock.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1/')
  })

  it('shows error', async () => {
    axiosMock.get.mockRejectedValueOnce(new Error())
    await act(async () => {
      render(<Router><App/></Router>)
    })
    expect(screen.getByTestId('error')).toBeVisible()
  })

})
