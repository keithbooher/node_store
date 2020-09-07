import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Cart from '../Cart'
import { useHistory } from 'react-router-dom';  
import SignInDropDown from "./AccountDropdown/SignInDropdown"
import AccountDropDown from "./AccountDropdown"
import { logout as logoutReq } from "../../../../utils/API"
import { withCookies, useCookies } from 'react-cookie'

// when the user logs out we need to store their cart id in the guest_cart cookies
const AccountNav = ({ auth, logoutReq }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['guest_cart']);
  const history = useHistory()

  const logout = async () => {
    // if (!cart || !cart._id) return
    // WHY EVEN SET THE USERS CART ID TO COOKIE?
    // WHEN THEY LOG IN THEY WILL GET THEIR CART
    // if (cart) {
    //   setCartCookie(cart._id)
    // }
    await logoutReq()
    removeCookie("guest_cart")
    history.push("/")
    window.location.reload()
  }

  const renderDropDown = () => {
    return [
      <Link style={{ marginTop: "0px" }} className="hover-color-7" to="/account/details">{auth.email}</Link>,
      <a className="hover-color-7" onClick={logout}>Logout</a>
    ]
  }

  const renderContent = () => {
    console.log(auth)
    if (auth) {
      switch (auth._id) {
        case "000000000000000000000000":
            return [
              <SignInDropDown />, 
              <Cart />
            ]
        default:
          return [
            <AccountDropDown key={1} elements={renderDropDown()} />,
            <Cart key={2} />
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

const actions = { logoutReq }

export default connect(mapStateToProps, actions)(AccountNav)




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