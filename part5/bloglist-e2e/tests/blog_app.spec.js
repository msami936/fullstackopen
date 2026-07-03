const { test, expect } = require('@playwright/test')

const { describe, beforeEach } = test

const loginWith = async (page, username, password) => {
  await page.goto('http://localhost:5173/login')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlogWithUi = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const createUser = async (request, user) => {
  await request.post('http://localhost:3003/api/users', {
    data: user,
  })
}

const createBlogWithApi = async (request, blog, credentials = {
  username: 'mluukkai',
  password: 'salainen',
}) => {
  const response = await request.post('http://localhost:3003/api/login', {
    data: credentials,
  })
  const user = await response.json()

  await request.post('http://localhost:3003/api/blogs', {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    data: blog,
  })
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await createUser(request, {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen',
    })

    await page.goto('http://localhost:5173')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'new blog' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a logged in user can create a blog', async ({ page }) => {
      await createBlogWithUi(
        page,
        'You are not gonna need it',
        'Ron Jeffries',
        'https://ronjeffries.com/xprog/articles/practices/pracnotneed/'
      )

      await expect(page.getByRole('link', {
        name: 'You are not gonna need it by Ron Jeffries',
      })).toBeVisible()
    })

    test('a logged in user can like blogs', async ({ page, request }) => {
      await createBlogWithApi(request, {
        title: 'Likeable blog',
        author: 'Test Author',
        url: 'https://example.com/likeable',
        likes: 0,
      })
      await page.goto('http://localhost:5173')

      await page.getByRole('link', { name: 'Likeable blog by Test Author' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a logged in user can delete a blog', async ({ page, request }) => {
      await createBlogWithApi(request, {
        title: 'Delete me',
        author: 'Test Author',
        url: 'https://example.com/delete',
        likes: 0,
      })
      await page.goto('http://localhost:5173')

      await page.getByRole('link', { name: 'Delete me by Test Author' }).click()

      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Remove blog Delete me by Test Author')
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByRole('link', {
        name: 'Delete me by Test Author',
      })).not.toBeVisible()
    })
  })
})
