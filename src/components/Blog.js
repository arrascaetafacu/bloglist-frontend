import { useState } from 'react'

const Blog = ({ blog, removeBlog, updateLikes }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleUpdate = () => {
    const blogToUpdate = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user,
      likes: blog.likes + 1,
    }

    updateLikes(blog.id, blogToUpdate)
  }

  return (

    <div className="blog">
      {blog.title} {blog.author}
      <button onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
      <div
        className="blog-details"
        style={{ display: showDetails ? '' : 'none' }}
      >
        <li>{blog.url}</li>
        <li>likes: {blog.likes}<button onClick={handleUpdate}>like</button></li>
        <button id='remove-btn' onClick={removeBlog}>remove</button>
      </div>
    </div>

  )
}

export default Blog