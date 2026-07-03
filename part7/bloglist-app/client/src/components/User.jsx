import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Typography, List, ListItem, Link as MuiLink } from '@mui/material'
import userService from '../services/users'
import NotFound from './NotFound'

const User = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    userService
      .getById(id)
      .then((user) => setUser(user))
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) {
    return <NotFound />
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        {user.name}
      </Typography>
      <Typography variant="h6" component="h3" gutterBottom>
        added blogs
      </Typography>
      <List>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id} disablePadding sx={{ display: 'list-item' }}>
            <MuiLink component={Link} to={`/blogs/${blog.id}`}>
              {blog.title}
            </MuiLink>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default User
