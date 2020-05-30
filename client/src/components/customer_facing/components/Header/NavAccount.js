import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Cart from '../Cart'
import { useHistory } from 'react-router-dom';  
import AccountDropDown from "./Dropdown"
import { logout as logoutReq } from "../../../../utils/API"

// when the user logs out we need to store their cart id in the guest_cart cookies
const AccountNav = ({ auth, cart, setCartCookie }) => {
  const history = useHistory()
  const logout = async () => {
    console.log(cart._id)
    setCartCookie(cart._id)
    await logoutReq()
    history.push("/")
    window.location.reload()
  }

  const renderDropDown = () => {
    return [
      <Link className="header_list_item clickable a-invert" to="/account">{auth.email}</Link>,
      <div onClick={logout} className="header_list_item clickable a-invert">Logout</div>
    ]
  }

  const renderContent = () => {
    if (auth) {
      switch (auth._id) {
        case "000000000000000000000000":
            return [<a href="/auth/google">Sign in with Google</a>, <Cart />]
        default:
          return [
            <AccountDropDown elements={renderDropDown()} />,
            <Cart />
          ]
      }
    }

  }

  return (
  <>
    {renderContent()}
  </>
  )
}

function mapStateToProps({ auth, cart }) {
  return { auth, cart }
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