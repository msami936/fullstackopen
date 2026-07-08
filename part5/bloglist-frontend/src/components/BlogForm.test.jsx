import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls createBlog with correct data on submit', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    await user.type(screen.getByLabelText('title'), 'a new blog')
    await user.type(screen.getByLabelText('author'), 'author name')
    await user.type(screen.getByLabelText('url'), 'http://example.com')
    await user.click(screen.getByRole('button', { name: 'create' }))

    expect(createBlog).toHaveBeenCalledWith({
      title: 'a new blog',
      author: 'author name',
      url: 'http://example.com',
    })
  })
})
