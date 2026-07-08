import { useEffect, useState } from 'react'
import axios from 'axios'

const useApi = (url, mapResults = (result) => result) => {
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState()
  useEffect(() => {
    setIsLoading(true)
    axios
      .get(url)
      .then(response => Promise.resolve(mapResults(response.data)))
      .then(data => setData(data))
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [url])

  return { data, isLoading, error }
}

export { useApi }
