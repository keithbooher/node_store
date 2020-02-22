import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup } from '@testing-library/react'
import MyComponent from '../components/MyComponent'

afterEach(cleanup)

describe('This will test MyComponent', () => {
  test('renders message', () => {
     const { getByText }= render(<MyComponent 
                                 firstName="Alejandro"
                                 lastName="Roman"
                              />)

     // as suggested by Giorgio Polvara a more idiomatic way:
     expect(getByText('Hi Alejandro Roman')).toBeInTheDocument()
  })
})