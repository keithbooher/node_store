import React, { Component } from 'react'
import { BrowserRouter , Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchUser } from '../actions'
import '../stylesheets/all.css.scss'

import Header from './customer_facing/components/Header'
import Admin from './Admin'
import CustomerFacing from './CustomerFacing';

import PrivateRoute from './PrivateRoute'

class App extends Component {
  constructor(props) {
    super()
    this.state = {admin: null}
  }
  async componentDidMount() {
    // Check to see if user is logged in
    // Also using this to pass to prive route
    let admin = await this.props.fetchUser()
    switch (admin) {
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
        admin = true
        break;
    }
    this.setState({ admin: admin })
  }

  render() {
    console.log(this.state.admin)
    return (
      <BrowserRouter>
        <HideableHeader />
        <HideableCustomerFacing />
        <PrivateRoute admin={this.state.admin} path="/admin">
          <Admin />
        </PrivateRoute>
      </BrowserRouter>
    )
  }
}

const HeaderSwitch = (props) => {
  const { location } = props;
  if (location.pathname.match('/admin')){
    return null;
  }
  return (
    <Header />
  )
}

const CustomerFacingSwitch = (props) => {
  const { location } = props;
  if (location.pathname.match('/admin')){
    return null;
  }
  return (
    <CustomerFacing />
  )
}

const HideableHeader = withRouter(HeaderSwitch);
const HideableCustomerFacing = withRouter(CustomerFacingSwitch);

const actions = { fetchUser }

export default connect(null, actions)(App)