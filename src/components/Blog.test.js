import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const updateLikes = jest.fn()

  beforeEach(() => {
    const deleteBlog = jest.fn()

    const blog = {
      title: 'Blog title',
      author: 'Blog author',
      url: 'Blog URL',
      likes: 10
    }
    container = render(<Blog blog={blog} deleteBlog={deleteBlog} updateLikes={updateLikes} />).container
  })

  test('rendered component displays blog\'s title and author but not url and likes', () => {
    const blog = screen.getByText('Blog title Blog author')
    expect(blog).toBeDefined()

    const blogDetails = container.querySelector('.blog-details')
    expect(blogDetails).toHaveStyle('display: none')
  })

  test('renders url and likes when clicking view button', async () => {
    const user = userEvent.setup()
    const blogDetails = container.querySelector('.blog-details')
    const viewButton = screen.getByText('view')

    await user.click(viewButton)
    expect(blogDetails).not.toHaveStyle('display: none')
  })

  test('event handler of like button is called twice when clicked two times', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(updateLikes.mock.calls).toHaveLength(2)

  })
})