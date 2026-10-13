import { render } from '@testing-library/react'
import { it, expect } from 'vitest'
import App from './App'

it('renders app shell', () => {
  render(<App />)
  expect(document.querySelector('#root-viewport')).toBeTruthy()
})
