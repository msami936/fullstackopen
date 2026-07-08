import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const BlogList = ({ blogs }) => (
  <div>
    <h2>blogs</h2>
    <ul>
      {blogs.slice().sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0)).map(blog =>
        <li key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </li>
      )}
    </ul>
  </div>
)

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
}

export default BlogList
