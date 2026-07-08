import { Link } from 'react-router-dom'
import { Typography, List, ListItem, Link as MuiLink } from '@mui/material'
import { useBlogs } from '../store/blogStore'

const BlogList = () => {
  const blogs = useBlogs()

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        blogs
      </Typography>
      <List>
        {blogs
          .slice()
          .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
          .map((blog) => (
            <ListItem
              key={blog.id}
              disablePadding
              sx={{ display: 'list-item' }}
            >
              <MuiLink component={Link} to={`/blogs/${blog.id}`}>
                {blog.title} by {blog.author}
              </MuiLink>
            </ListItem>
          ))}
      </List>
    </div>
  )
}

export default BlogList
