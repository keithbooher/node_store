import React, { Component } from 'react'
import { BrowserRouter , Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchUser, usersCart } from '../actions'
import '../stylesheets/all.css.scss'

import Admin from './containers/Admin'
import Customer from './containers/CustomerFacing';

import PrivateRoute from './PrivateRoute'

const checkAdmin = (user) => {
  let admin 
  switch (user) {
    case undefined:
      admin = null      
      break;
    case null:
      admin = false      
      break;
    case '':
      admin = false      
      break;
    default:
      if (user.role === "admin") {
        admin = true
      } else {
        admin = false
      }
      break;
  }
  return admin
}

class App extends Component {
  constructor(props) {
    super()
    this.state = {admin: null}
  }
  async componentDidMount() {
    // Check to see if user is logged in
    // Also using this to pass to private route
    let user = await this.props.fetchUser()
    let cart = await this.props.usersCart(user._id)
    
    let admin = checkAdmin(user)
    this.setState({ admin: admin })
  }

  render() {
    return (
      <BrowserRouter>
        <CustomerFacing />
        <PrivateRoute admin={this.state.admin} path="/admin">
          <Admin />
        </PrivateRoute>
      </BrowserRouter>
    )
  }
}

const CustomerFacingSwitch = (props) => {
  const { location } = props;
  if (location.pathname.match('/admin')){
    return null;
  }
  return (
    <Customer />
  )
}

const CustomerFacing = withRouter(CustomerFacingSwitch);

const actions = { fetchUser, usersCart }

export default connect(null, actions)(App)