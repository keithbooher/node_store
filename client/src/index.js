import React from 'react'
import ReactDOM from 'react-dom'
import Root from './components/Root'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'
import reduxThunk from 'redux-thunk'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

Bugsnag.start({
  apiKey: process.env.REACT_APP_BUG_SNAG_KEY,
  plugins: [new BugsnagPluginReact()],
  enabledReleaseStages: [ 'production', 'staging' ]
})

var ErrorBoundary = Bugsnag.getPlugin('react')
  .createErrorBoundary(React)

const store = createStore(reducers, {}, applyMiddleware(reduxThunk))

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </Provider>, 
  document.querySelector('#root')
)