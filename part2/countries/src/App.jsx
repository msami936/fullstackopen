import { useState, useEffect } from 'react'
import axios from 'axios'
import { AddFilter, ShowFiltered } from './components/Filter'

const App = () => {

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all?fields=name,capital,languages,area,flags')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h1>Data for countries</h1>

      <AddFilter
        filter={filter}
        onChange={handleFilterChange}
      />

      <ShowFiltered
        countries={countries}
        filter={filter}
      />

    </div>
  )
}

export default App