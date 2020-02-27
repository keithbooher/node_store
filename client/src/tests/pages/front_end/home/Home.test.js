import React from 'react'
import { render, cleanup } from '@testing-library/react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducers from '../../../../reducers'
import reduxThunk from 'redux-thunk'
import initialState from '../../../mock_props/initial_state'
import { BrowserRouter , Route } from 'react-router-dom'
import Home from '../../../../components/pages/front_end/Home'
import '@testing-library/jest-dom/extend-expect'

// this is a handy function that I normally make available for all my tests
// that deal with connected components.
// you can provide initialState for the entire store that the ui is rendered with
function renderWithRedux(ui, { initialState, store = createStore(reducers, initialState, applyMiddleware(reduxThunk)) } = {}) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  }
}

afterEach(cleanup)

describe('This will test MyComponent', () => {
  test('renders message', () => {
    const { getByText }= renderWithRedux(<BrowserRouter>
                                            <Home />
                                          </BrowserRouter>, {initialState})

     // as suggested by Giorgio Polvara a more idiomatic way:
     expect(getByText('Node Store')).toBeInTheDocument()
  })
})