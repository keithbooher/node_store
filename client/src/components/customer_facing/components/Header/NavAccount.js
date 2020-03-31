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
          <li className="header_list_item clickable" key="5"><Link to="/account">{this.props.auth.email}</Link></li>,
          <li className="header_list_item clickable" key="2"><a href="/api/logout">Logout</a></li>,
          <li className="header_list_item clickable" key="4"><Link to="/checkout">Checkout</Link></li>,
          <li className="header_list_item clickable"><Cart /></li>
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