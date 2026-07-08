import { useNavigate } from 'react-router-dom'
import { TextField, Button, Stack, Typography } from '@mui/material'
import { useField } from '../hooks'
import { useUserActions } from '../store/userStore'
import { useNotify } from '../store/notificationStore'

const LoginForm = () => {
  const username = useField('text')
  const password = useField('password')
  const { login } = useUserActions()
  const notify = useNotify()
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await login({ username: username.value, password: password.value })
      username.reset()
      password.reset()
      navigate('/')
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Log in to application
      </Typography>
      <form onSubmit={handleLogin}>
        <Stack spacing={2} sx={{ width: 400, maxWidth: '100%' }}>
          <TextField
            fullWidth
            variant="standard"
            label="username"
            {...username.spread}
          />
          <TextField
            fullWidth
            variant="standard"
            label="password"
            {...password.spread}
          />
          <Button variant="contained" color="primary" type="submit">
            login
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default LoginForm
