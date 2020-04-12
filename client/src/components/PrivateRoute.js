import React from 'react'
import { Route, Redirect } from 'react-router-dom'


// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, admin, ...rest }) {
  if (admin === null) {
    return (
      ""
    )
  } else {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          admin === true ? (children) 
          : (<Redirect to={{pathname: "/", state: {from: location}}}/>)
        }
      />
    )
  }
}

export default PrivateRoute