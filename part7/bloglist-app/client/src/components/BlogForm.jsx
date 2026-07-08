import { useNavigate } from 'react-router-dom'
import { TextField, Button, Stack, Typography } from '@mui/material'
import { useField } from '../hooks'
import { useBlogActions } from '../store/blogStore'
import { useUser } from '../store/userStore'
import { useNotify } from '../store/notificationStore'

const BlogForm = () => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
  const { createBlog } = useBlogActions()
  const user = useUser()
  const notify = useNotify()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const returnedBlog = await createBlog(
      { title: title.value, author: author.value, url: url.value },
      user
    )
    title.reset()
    author.reset()
    url.reset()
    notify(
      `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
      'success'
    )
    navigate('/')
  }

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        create new
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ width: 400, maxWidth: '100%' }}>
          <TextField fullWidth label="title" {...title.spread} />
          <TextField fullWidth label="author" {...author.spread} />
          <TextField fullWidth label="url" {...url.spread} />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ alignSelf: 'flex-start' }}
          >
            create
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default BlogForm
