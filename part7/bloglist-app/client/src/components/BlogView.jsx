import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Blog from './Blog'
import NotFound from './NotFound'
import blogService from '../services/blogs'
import { useBlog, useBlogActions } from '../store/blogStore'
import { useUser } from '../store/userStore'

const BlogView = () => {
  const { id } = useParams()
  const blog = useBlog(id)
  const { setBlog, likeBlog, removeBlog, addComment } = useBlogActions()
  const user = useUser()
  const navigate = useNavigate()
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setNotFound(false)
    blogService
      .getById(id)
      .then((fetchedBlog) => {
        if (fetchedBlog) {
          setBlog(fetchedBlog)
        } else {
          setNotFound(true)
        }
      })
      .catch(() => setNotFound(true))
  }, [id, setBlog])

  if (notFound) {
    return <NotFound />
  }

  if (!blog) {
    return null
  }

  const handleRemove = async (blogId) => {
    await removeBlog(blogId)
    navigate('/')
  }

  return (
    <Blog
      blog={blog}
      user={user}
      handleLike={likeBlog}
      handleRemove={handleRemove}
      handleComment={addComment}
    />
  )
}

export default BlogView
