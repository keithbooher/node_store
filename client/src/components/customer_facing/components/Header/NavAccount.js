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
        return <a href="/auth/google">Sign in with Google</a>
      default:
        return [
          <Link className="header_list_item clickable" to="/account">{this.props.auth.email}</Link>,
          <a className="header_list_item clickable" href="/api/logout">Logout</a>,
          <Link className="header_list_item clickable" to="/checkout">Checkout</Link>,
          <Cart />
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