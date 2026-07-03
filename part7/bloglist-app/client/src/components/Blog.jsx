import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  Typography,
  Link,
  Button,
  Stack,
  TextField,
  List,
  ListItem,
  Divider,
} from '@mui/material'
import { useField } from '../hooks'

const Blog = ({ blog, user, handleLike, handleRemove, handleComment }) => {
  const comment = useField('text')

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

  const addComment = async (event) => {
    event.preventDefault()
    if (comment.value.trim() === '') {
      return
    }
    await handleComment(blog.id, comment.value)
    comment.reset()
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
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="body2">likes {blog.likes ?? 0}</Typography>
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

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" component="h3" gutterBottom>
          comments
        </Typography>
        {user && (
          <form onSubmit={addComment}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="add a comment"
                {...comment.spread}
              />
              <Button variant="contained" color="primary" type="submit">
                add comment
              </Button>
            </Stack>
          </form>
        )}
        <List dense sx={{ listStyleType: 'disc', pl: 2 }}>
          {(blog.comments ?? []).map((c, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'list-item' }}>
              {c.comment}
            </ListItem>
          ))}
        </List>
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
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        comment: PropTypes.string,
      })
    ),
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
  handleComment: PropTypes.func.isRequired,
}

export default Blog
