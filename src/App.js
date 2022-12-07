import { useState, useEffect, useRef } from 'react'

import './App.css'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })

      blogService.setToken(loggedUser.token)
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
      setUser(loggedUser)
      setUsername('')
      setPassword('')
    } catch(exception) {
      console.log(exception)
      displayNotification(exception.response.data, 'error-message')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleUsernameChange = ({ target }) => {
    setUsername(target.value)
  }
  const handlePasswordChange = ({ target }) => {
    setPassword(target.value)
  }

  const createBlog = async newBlog => {
    try {
      const savedBlog = await blogService.create(newBlog)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(savedBlog))
      displayNotification(`a new blog ${savedBlog.title} by ${savedBlog.author} added`, 'success-message')

    } catch(exception) {
      displayNotification(exception.response.data.error, 'error-message')
    }
  }

  const removeBlog = async id => {
    try {
      await blogService.remove(id)
      displayNotification('blog removed', 'success-message')
      setBlogs(blogs.filter(b => b.id !== id))
    } catch(exception) {
      displayNotification(exception.response.data.error, 'error-message')
    }
  }

  const updateLikes = async (id, blogToUpdate) => {
    const updatedBlog = await blogService.update(id, blogToUpdate)
    setBlogs(blogs.map(b => b.id === id ? updatedBlog : b))
  }

  const displayNotification = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)

  }

  const sortedBlogs = [...blogs].sort((b1, b2) => b2.likes - b1.likes)

  if (user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={message} />
        <div>
          {user.name} logged-in
          <button onClick={handleLogout}>Log out</button>
        </div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>
        <div>
          {sortedBlogs.map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              removeBlog={() => removeBlog(blog.id)}
              updateLikes={updateLikes}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <LoginForm
        handleLogin={handleLogin}
        username={username}
        handleUsernameChange={handleUsernameChange}
        password={password}
        handlePasswordChange={handlePasswordChange}
      />
    </div>
  )
}

export default App
