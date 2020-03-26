import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Cart from '../Cart'

class AccountNav extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return
      case false:
        return <li><a href="/auth/google">Sign in with Google</a></li>
      default:
        return [
          <li key="5"><Link to="/account">{this.props.auth.email}</Link></li>,
          <li key="2"><a href="/api/logout">Logout</a></li>,
          <li key="4"><Link to="/checkout">Checkout</Link></li>,
          <li><Cart /></li>
        ]
    }
  }

  render() {
    return (
    <>
      {this.renderContent()}
    </>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}


export default connect(mapStateToProps)(AccountNav)