import React, { Component } from 'react'
import { BrowserRouter , Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchUser, usersCart, createGuestCart, getGuestCart } from '../actions'
import '../stylesheets/all.css.scss'

import RemoveCookies from "./removeCookies"
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie'

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
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props) {
    super()
    this.state = {admin: null}
  }
  async componentDidMount() {
    const { cookies } = this.props
    // Check to see if user is logged in
    // Also using this to pass to private route
    let user = await this.props.fetchUser()
 
    // If no user signed in
    if (!user) {
      // Look for guest cart
      const cookieGuestCart = cookies.get('guest_cart')
      if (!cookieGuestCart) {
        // Create the guest cart
        const guest_cart = await this.props.createGuestCart()        
        cookies.set('guest_cart', guest_cart._id, { path: '/' });
      } else {
        // Find the guest cart
        const guest_cart_id = cookies.get('guest_cart')
        const guest_cart = await this.props.getGuestCart(guest_cart_id)
      }
    } else {
      let cart = await this.props.usersCart(user._id)
    }

    // if not signed in, we'll check for any created guest carts in the cookies
    // if not, then create a guest users cart in the database and store it's ID in the cookies (_user_id set to "guest" for the time being)
    
    // NEXT!!!
    // Later, if the user decides to login while they have a guest cart built; once logged in 
    // we will check to see if there was a saved guest cart in the cookies. If so, update that
    // cart with the user's ID and destroy prior open carts. 

    // THEN NEED TO SEE IF A GUEST CAN MAKE IT THROUGH CHECKOUT

    // Then we can fire the below request to get the user's cart. 

    window.cookie = cookies.get('guest_cart')
    
    let admin = checkAdmin(user)
    this.setState({ admin: admin })
  }

  render() {
    return (
      <BrowserRouter>
        <CustomerFacing />
        {/* <RemoveCookies /> for debugging */}
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

const actions = { fetchUser, usersCart, createGuestCart, getGuestCart }

export default connect(null, actions)(withCookies(App))