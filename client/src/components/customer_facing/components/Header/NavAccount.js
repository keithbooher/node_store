import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Cart from '../Cart'
import { withRouter } from 'react-router-dom';  
import Dropdown from "../../../shared/Dropdown"

class AccountNav extends Component {
  renderDropDowm() {
    return [
      <Link className="header_list_item clickable a-invert" to="/account">{this.props.auth.email}</Link>,
      <a className="header_list_item clickable a-invert" href="/api/logout">Logout</a>
    ]
  }

  renderContent() {
    switch (this.props.auth) {
      case null:
        return
      case false:
        return <a href="/auth/google">Sign in with Google</a>
      default:
        return [
          <Link className="header_list_item clickable" to="/checkout">Checkout</Link>,
          <Dropdown elements={this.renderDropDowm()} />,
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




// // WHY THE FUCK WAS I DOING THIS
// const Checkout = (props) => {
//   const { location } = props;
//   if (location.pathname.match('/admin')){
//     return null;
//   }
//   return (
//     <Link className="header_list_item clickable" to="/checkout">Checkout</Link>
//   )
// }

// const CheckoutThatCanHide = withRouter(Checkout);