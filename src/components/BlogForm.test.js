import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('createBlog is called with the right arguments', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const button = screen.getByRole('button')
  const input = await screen.findAllByRole('textbox')
  const titleInput = input[0]
  const authorInput = input[1]
  const urlInput = input[2]
  await user.type(titleInput, 'Blog title')
  await user.type(authorInput, 'Blog author')
  await user.type(urlInput, 'Blor url')
  await user.click(button)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Blog title',
    author: 'Blog author',
    url: 'Blor url',
  })
})