import React, { useState, useEffect } from 'react'
import { BrowserRouter, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchUser, usersCart, createGuestCart, getGuestCart, convertGuestCart } from '../actions'
import '../stylesheets/all.css.scss'

import { withCookies, useCookies } from 'react-cookie'

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



const App = ({ fetchUser, usersCart, createGuestCart, getGuestCart, convertGuestCart }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['guest_cart']);

  const setCartCookie = (id) => {
    setCookie('guest_cart', id, { path: '/' })
  }

  const [admin, setAdmin] = useState(null)
  useEffect(() => {
    async function mount() {
      // Check to see if user is logged in
      let user = await fetchUser()
  
      // If no user signed in
      if (!user) {
        // Look for guest cart
        const cookieGuestCart = cookies.guest_cart
        if (!cookieGuestCart) {
          // Guest user landing for the first time
          // Create the guest cart
          const guest_cart = await createGuestCart()        
          setCookie('guest_cart', guest_cart._id, { path: '/' })
        } else {
          // Guest user, but they have cart cookies with us 
          // Find the guest cart
          const guest_cart_id = cookies.guest_cart
          const guestCart = await getGuestCart(guest_cart_id)
          if (!guestCart) {
            await createGuestCart()
          }
        } 
      } else if (user && cookies.guest_cart) {
        // User is signed in but had an open guest cart
        // convert guest cart to this user's cart
        const guest_cart_id = cookies.guest_cart
        await convertGuestCart(guest_cart_id, user._id, user.email)
        removeCookie('guest_cart')
      } else {
        console.log('4')
        // User is signed in and no cart in cookies
        await usersCart(user._id)
      }

      window.cookies = cookies
      
      let checkedAdmin = checkAdmin(user)
      setAdmin(checkedAdmin)
    }
    mount()
    return () => {}
  }, [])

  return (
    <BrowserRouter>
      <CustomerFacing setCartCookie={setCartCookie} />
      <PrivateRoute admin={admin} path="/admin">
        <Admin />
      </PrivateRoute>
    </BrowserRouter>
  )

}

const CustomerFacingSwitch = (props) => {
  const { location, setCartCookie } = props;
  if (location.pathname.match('/admin')){
    return null;
  }
  return (
    <Customer setCartCookie={setCartCookie} />
  )
}

const CustomerFacing = withRouter(CustomerFacingSwitch);

const actions = { fetchUser, usersCart, createGuestCart, getGuestCart, convertGuestCart }

export default connect(null, actions)(withCookies(App))