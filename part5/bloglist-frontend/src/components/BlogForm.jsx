import { useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Button, Stack } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ width: 400, maxWidth: '100%' }}>
          <TextField
            fullWidth
            label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <TextField
            fullWidth
            label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <TextField
            fullWidth
            label="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
          <Button variant="contained" color="primary" type="submit" sx={{ alignSelf: 'flex-start' }}>
            create
          </Button>
        </Stack>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
