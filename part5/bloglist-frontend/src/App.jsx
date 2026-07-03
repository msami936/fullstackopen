import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { TextField, Button, Stack, AppBar, Toolbar, Typography, Box } from '@mui/material'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type) => {
    if (type === 'error') {
      setErrorMessage(message)
      setSuccessMessage(null)
    } else {
      setSuccessMessage(message)
      setErrorMessage(null)
    }

    setTimeout(() => {
      setErrorMessage(null)
      setSuccessMessage(null)
    }, 5000)
  }

  const handleLogin = (event) => {
    event.preventDefault()
    loginService.login({ username, password })
      .then(userObject => {
        window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userObject))
        blogService.setToken(userObject.token)
        setUser(userObject)
        setUsername('')
        setPassword('')
        navigate('/')
      })
      .catch(() => {
        notify('wrong username or password', 'error')
      })
  }

  const handleLogout = () => {
    loginService.logout()
    setUser(null)
    navigate('/')
  }

  const createBlog = (blogObject) => {
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(prevBlogs => prevBlogs.concat({
        ...returnedBlog,
        user: {
          username: user.username,
          name: user.name,
          id: returnedBlog.user,
        },
      }))
      notify(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success')
      navigate('/')
    })
  }

  const addLike = (id, blogObject) => {
    blogService.update(id, blogObject).then(returnedBlog => {
      setBlogs(prevBlogs =>
        prevBlogs.map(blog =>
          blog.id !== id ? blog : { ...blog, likes: returnedBlog.likes }
        )
      )
    })
  }

  const removeBlog = (id) => {
    blogService.remove(id).then(() => {
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== id))
      navigate('/')
    })
  }

  const BlogView = () => {
    const { id } = useParams()
    const blog = blogs.find(b => b.id === id)

    return (
      <Blog
        blog={blog}
        user={user}
        handleLike={addLike}
        handleRemove={removeBlog}
      />
    )
  }

  const CreateBlog = () => {
    if (!user) {
      navigate('/login')
      return null
    }

    return <BlogForm createBlog={createBlog} />
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <Stack spacing={2} sx={{ width: 400, maxWidth: '100%' }}>
          <TextField
            fullWidth
            variant="standard"
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <TextField
            fullWidth
            variant="standard"
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button variant="contained" color="primary" type="submit">
            login
          </Button>
        </Stack>
      </form>
    </div>
  )

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

      <Box sx={{ m: 2 }}>
        <Notification message={errorMessage} type="error" />
        <Notification message={successMessage} type="success" />

        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/login" element={loginForm()} />
        </Routes>
      </Box>
    </div>
  )
}

export default App
