import React from 'react'
import { render, cleanup } from '@testing-library/react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducers from '../../../../reducers'
import reduxThunk from 'redux-thunk'
import initialState from '../../../mock_props/initial_state'
import { BrowserRouter , Route } from 'react-router-dom'
import Home from '../../../../components/pages/customer_facing/Home'
import '@testing-library/jest-dom/extend-expect'

// found here https://github.com/testing-library/testing-library-docs/blob/master/docs/example-react-redux.md
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

const { getByText } = renderWithRedux(
  <BrowserRouter>
    <Home />
  </BrowserRouter>, { initialState });

describe('This will test Home page component', () => {
afterEach(cleanup)
  test('renders message', () => {
    const txt = getByText('Node Store');
     // as suggested by Giorgio Polvara a more idiomatic way:
     expect(txt).toBeInTheDocument()
  })
})
