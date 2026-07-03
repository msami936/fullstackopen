import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initializeBlogs: async () => {
      const blogs = await blogService.getAll()
      set({ blogs })
    },
    createBlog: async (blogObject, user) => {
      const returnedBlog = await blogService.create(blogObject)
      set((state) => ({
        blogs: state.blogs.concat({
          ...returnedBlog,
          user: {
            username: user.username,
            name: user.name,
            id: returnedBlog.user,
          },
        }),
      }))
      return returnedBlog
    },
    likeBlog: async (id, blogObject) => {
      const returnedBlog = await blogService.update(id, blogObject)
      set((state) => ({
        blogs: state.blogs.map((blog) =>
          blog.id !== id ? blog : { ...blog, likes: returnedBlog.likes }
        ),
      }))
    },
    removeBlog: async (id) => {
      await blogService.remove(id)
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id),
      }))
    },
    setBlog: (blog) => {
      set((state) => ({
        blogs: state.blogs.some((b) => b.id === blog.id)
          ? state.blogs.map((b) => (b.id === blog.id ? blog : b))
          : state.blogs.concat(blog),
      }))
    },
    addComment: async (id, comment) => {
      const updatedBlog = await blogService.addComment(id, comment)
      set((state) => ({
        blogs: state.blogs.map((blog) => (blog.id !== id ? blog : updatedBlog)),
      }))
      return updatedBlog
    },
  },
}))

export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)
export const useBlog = (id) =>
  useBlogStore((state) => state.blogs.find((blog) => blog.id === id))
