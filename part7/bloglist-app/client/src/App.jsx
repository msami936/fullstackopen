import { useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Button, AppBar, Toolbar, Typography, Box } from '@mui/material'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import User from './components/User'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import { useBlogActions } from './store/blogStore'
import { useUser, useUserActions } from './store/userStore'
import { useNotification } from './store/notificationStore'

const CreateBlog = () => {
  const user = useUser()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  return <BlogForm />
}

const App = () => {
  const user = useUser()
  const { initializeUser, logout } = useUserActions()
  const { initializeBlogs } = useBlogActions()
  const { message, type } = useNotification()
  const navigate = useNavigate()

  useEffect(() => {
    initializeBlogs()
    initializeUser()
  }, [initializeBlogs, initializeUser])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            users
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/create">
              new blog
            </Button>
          )}
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              logout
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <ErrorBoundary>
        <Box sx={{ m: 2 }}>
          <Notification message={message} type={type} />

          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/blogs/:id" element={<BlogView />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </ErrorBoundary>
    </div>
  )
}

export default App
