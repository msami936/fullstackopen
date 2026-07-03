import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '1',
    title: 'Component testing is fun',
    author: 'Dan Abramov',
    url: 'https://react.dev',
    likes: 5,
    user: {
      id: 'u1',
      name: 'Matti Luukkainen',
      username: 'mluukkai',
    },
  }

  const creator = { username: 'mluukkai' }
  const otherUser = { username: 'other' }
  const handleLike = vi.fn()
  const handleRemove = vi.fn()
  const handleComment = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders blog details without buttons for non-logged-in users', () => {
    render(
      <Blog
        blog={blog}
        user={null}
        handleLike={handleLike}
        handleRemove={handleRemove}
        handleComment={handleComment}
      />
    )

    expect(screen.getByText('Component testing is fun')).toBeInTheDocument()
    expect(screen.getByText('by Dan Abramov')).toBeInTheDocument()
    expect(screen.getByText('https://react.dev')).toBeInTheDocument()
    expect(screen.getByText(/likes 5/)).toBeInTheDocument()
    expect(screen.getByText('Added by Matti Luukkainen')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'like' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'remove' })
    ).not.toBeInTheDocument()
  })

  test('shows only like button for logged-in non-creator', () => {
    render(
      <Blog
        blog={blog}
        user={otherUser}
        handleLike={handleLike}
        handleRemove={handleRemove}
        handleComment={handleComment}
      />
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'remove' })
    ).not.toBeInTheDocument()
  })

  test('shows like and remove buttons for blog creator', () => {
    render(
      <Blog
        blog={blog}
        user={creator}
        handleLike={handleLike}
        handleRemove={handleRemove}
        handleComment={handleComment}
      />
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
  })

  test('calls handleLike twice when like button is clicked twice', async () => {
    const userEvents = userEvent.setup()

    render(
      <Blog
        blog={blog}
        user={otherUser}
        handleLike={handleLike}
        handleRemove={handleRemove}
        handleComment={handleComment}
      />
    )

    await userEvents.click(screen.getByRole('button', { name: 'like' }))
    await userEvents.click(screen.getByRole('button', { name: 'like' }))

    expect(handleLike.mock.calls).toHaveLength(2)
  })
})
