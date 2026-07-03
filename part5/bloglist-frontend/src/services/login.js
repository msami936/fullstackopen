import axios from 'axios'
const baseUrl = '/api/login'

const login = credentials => {
  const request = axios.post(baseUrl, credentials)
  return request.then(response => response.data)
}

const logout = () => {
  window.localStorage.removeItem('loggedBlogappUser')
}

export default { login, logout }
