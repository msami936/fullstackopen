import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

const mockCreateBlog = vi.fn()
const mockNotify = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../store/blogStore', () => ({
  useBlogActions: () => ({ createBlog: mockCreateBlog }),
}))

vi.mock('../store/userStore', () => ({
  useUser: () => ({ username: 'test', name: 'Test User' }),
}))

vi.mock('../store/notificationStore', () => ({
  useNotify: () => mockNotify,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('<BlogForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateBlog.mockResolvedValue({
      title: 'a new blog',
      author: 'author name',
    })
  })

  test('calls createBlog with correct data on submit', async () => {
    const user = userEvent.setup()

    render(<BlogForm />)

    await user.type(screen.getByLabelText('title'), 'a new blog')
    await user.type(screen.getByLabelText('author'), 'author name')
    await user.type(screen.getByLabelText('url'), 'http://example.com')
    await user.click(screen.getByRole('button', { name: 'create' }))

    expect(mockCreateBlog).toHaveBeenCalledWith(
      {
        title: 'a new blog',
        author: 'author name',
        url: 'http://example.com',
      },
      { username: 'test', name: 'Test User' }
    )
  })
})
