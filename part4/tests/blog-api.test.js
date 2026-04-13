const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test-helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {  
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash("kakakaka", 10)
    const user = new User({
       username: "ssss",
       name: "kkkkk",
       blogs: [],
       passwordHash
    })
  
    await user.save()
}, 100000)

beforeEach(async () => {  
  await Blog.deleteMany({})

  const users = await User.find({})
  const user = users[0]

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: user._id,
      likes: blog.likes ? blog.likes : 0
    }))

  const promiseArray = blogObjects.map(blog => {
      user.blogs = user.blogs.concat(blog._id)
      return blog.save()
    })
  await Promise.all(promiseArray)
  await user.save()
}, 100000)

describe('when there is initially some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const blogToView = blogsAtStart[0]
  
    const resultBlog = await api    
      .get(`/api/blogs/${blogToView.id}`)    
      .expect(200)    
      .expect('Content-Type', /application\/json/)
  
    expect(resultBlog.body.id).toBeDefined()
    expect(resultBlog.body._id).not.toBeDefined()
  })
})

describe('viewing a specific blog', () => {

  test('a valid blog can be added and linked to an existing user', async () => {
    const user = {
      username: "ssss",
      password: "kakakaka",
    }

    const loginUser = await api
      .post('/api/login')
      .send(user)

    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }  

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length + 1)

    const addedBlog = blogsAtEnd.body.find(blog => blog.title === newBlog.title)

    expect(addedBlog).toBeDefined()
    expect(addedBlog.user).toBeDefined()
    expect(addedBlog.user.username).toBe('ssss')

    expect(usersAtEnd.body[0].blogs).toHaveLength(helper.initialBlogs.length + 1)
  }, 100000)

  test('a blog cannot be added without a token', async () => {
    const newBlog = {
      title: 'Typaaae wars',
      author: 'Robeaaart C. Martin',
      url: 'http://aaablog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 200
    }  

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(n => n.title)

    expect(titles).not.toContain(
      'Typaaae wars'
    )
  }, 100000)

  test('new blog without likes property will be set to 0', async () => {
    const user = {
      username: "ssss",
      password: "kakakaka",
    }

    const loginUser = await api
      .post('/api/login')
      .send(user)
    
    const newBlog = {
      title: 'Typefghfhgfhg wars',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWarsgfghfhgf.html',
      author: 'Robertdsjflkjfslkd C. Martin',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)

        expect(addedBlog).toBeDefined()
        expect(addedBlog.likes).toBe(0)
  }) 

  test('new blog without title property will not be added', async () => {
    const user = {
      username: "ssss",
      password: "kakakaka",
    }

    const loginUser = await api
      .post('/api/login')
      .send(user)
    
    const newBlog = {
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/Typsgfghfhgf.html',
      author: 'Robertdsjflkd C. Martin',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }) 

  test('new blog without url property will not be added', async () => {
    const user = {
      username: "ssss",
      password: "kakakaka",
    }

    const loginUser = await api
      .post('/api/login')
      .send(user)

    const newBlog = {
      title: 'dgfshjdfgsjdh',
      author: 'Robertdsjflkd C. Martin'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }) 
})

describe('deletion of a note', () => {

  test('deletion fails if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('deletion fails if token owner did not add the blog', async () => {
    const passwordHash = await bcrypt.hash('anotherpassword', 10)
    const anotherUser = new User({
      username: 'anotheruser',
      name: 'Another User',
      passwordHash,
      blogs: []
    })
    await anotherUser.save()

    const loginUser = await api
      .post('/api/login')
      .send({ username: 'anotheruser', password: 'anotherpassword' })

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect(403)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
  
  test('a blog can be deleted', async () => {
    const user = {
      username: "ssss",
      password: "kakakaka",
    }

    const loginUser = await api
      .post('/api/login')
      .send(user)
  
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api    
      .delete(`/api/blogs/${blogToDelete.id}`)  
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('update of a note', () => {
  test('the information of an individual blog post is updated', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const newBlog = {
      title: blogsAtStart[0].title,
      author: blogsAtStart[0].author,
      url: blogsAtStart[0].url,
      likes: 2000000
    }  

    const updatedResponse = await api    
      .put(`/api/blogs/${blogToView.id}`)  
      .send(newBlog)  
      .expect(200)    
      .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      const updatedBlogInDb = blogsAtEnd.find(blog => blog.id === blogToView.id)

      expect(updatedBlogInDb.likes).toBe(2000000)
      expect(updatedResponse.body.likes).toBe(2000000)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })

      await user.save()
  })

  test('users are returned as json with id and without passwordHash', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(1)
    expect(response.body[0].id).toBeDefined()
    expect(response.body[0].passwordHash).not.toBeDefined()
  })

  test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
          username: 'miaa',
          name: 'miadhfkjsdhf',
          password: 'moimoi'
      }

      await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
      
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username does not exist', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        name: 'Ssdsduper',
        password: 'salainen',
    }

    const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(result.body.error).toContain('password and username must be given')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if password does not exist', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        name: 'Ssdsduper',
        username: 'salainen',
    }

    const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(result.body.error).toContain('password and username must be given')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
          username: 'root',
          name: 'Super',
          password: 'salainen',
      }

      const result = await api 
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/ )

      expect(result.body.error).toContain('expected `username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if username is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'ro',
        name: 'Sususususu',
        password: 'salainen',
    }

    const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(result.body.error).toContain('password or username must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if password is less than three characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'kakakaka',
        name: 'Superkakakak',
        password: 'sa',
    }

    const result = await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/ )

    expect(result.body.error).toContain('password or username must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})