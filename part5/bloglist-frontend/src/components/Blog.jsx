import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  Typography,
  Link,
  Button,
  Stack,
} from '@mui/material'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  if (!blog) {
    return null
  }

  const likeBlog = () => {
    const blogObject = {
      user: blog.user.id,
      likes: (blog.likes ?? 0) + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    handleLike(blog.id, blogObject)
  }

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleRemove(blog.id)
    }
  }

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          by {blog.author}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <Link href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Added by {blog.user.name}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2">
            likes {blog.likes ?? 0}
          </Typography>
          {user && (
            <Button variant="outlined" color="primary" onClick={likeBlog}>
              like
            </Button>
          )}
          {user && blog.user?.username === user.username && (
            <Button variant="outlined" color="error" onClick={removeBlog}>
              remove
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    url: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      username: PropTypes.string,
    }),
  }),
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
}

export default Blog
