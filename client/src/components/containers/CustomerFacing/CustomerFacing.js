import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import Home from '../../customer_facing/pages/Home'
import Product from '../../customer_facing/pages/Product'
import Category from '../../customer_facing/pages/Category'
import Checkout from '../../customer_facing/pages/Checkout'
import Account from '../../customer_facing/pages/Account'
import Header from '../../customer_facing/components/Header'
import FAQ from '../../customer_facing/components/FAQ'
import Sidebar from '../../customer_facing/components/Sidebar'
import OrderPage from "../../customer_facing/pages/Order"
import CartPage from "../../customer_facing/components/CartPage"
import EnlargeImage from "../../shared/EnlargeImage"
import Four04Page from "../../shared/Four04Page"
import { zeroInventorySettingCheck, usersCart, createGuestCart, getGuestCart, convertGuestCart } from "../../../actions"
import { withCookies, useCookies } from 'react-cookie'

import "./customer.scss"


const CustomerFacing = ({ 
  auth,
  zeroInventorySettingCheck,
  createGuestCart,
  getGuestCart,
  convertGuestCart,
  usersCart,
  sidebar,
  enlarge,
  cart
}) => {

  const [cookies, setCookie, removeCookie] = useCookies(['guest_cart']);

  useEffect(() => {
    settingCheck()
    getCart()
    window.cookies = cookies
  }, [])

  useEffect(() => {
    // dev tools
    window.cart = cart
  }, [cart])


  const settingCheck = async () => {
    return await zeroInventorySettingCheck()
  }

  const getCart = async () => {
    // If no user signed in
    if (!auth) {
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
    } else if (auth && cookies.guest_cart) {
      // User is signed in but had an open guest cart
      // convert guest cart to this user's cart
      const guest_cart_id = cookies.guest_cart
      await convertGuestCart(guest_cart_id, auth._id, auth.email)
      removeCookie('guest_cart')
    } else {
      // User is signed in and no cart in cookies
      await usersCart(auth._id)
      removeCookie('guest_cart')
    }
  }

  let sidebar_class
  switch (sidebar) {
    case true:
      sidebar_class = "sidebar_open_content"
      break;
  
    case false:
      sidebar_class = "sidebar_closed_container"        
      break;
  
    default:
      sidebar_class = ""
      break;
  }

  return (
    <div className="customer_container">
      <Sidebar />
      <div className={`content_subcontainer ${sidebar_class}`}>
        <Header />
        <div id="body_content_container" className="padding-s">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/shop/:category" component={Category} />
            <Route exact path="/shop/:category/:product" component={Product} />
            <Route exact path="/checkout" component={Checkout} />
            <Route path="/account" component={Account} />
            <Route path="/order/:id" component={OrderPage} />
            <Route path="/faq" component={FAQ} />
            <Route path="/cart" component={CartPage} />
            <Route component={Four04Page} />
          </Switch>
        </div>
      </div>

      {enlarge && <EnlargeImage cancel={() => this.setState({ enlargeImage: null })} image={enlarge.image} path={enlarge.path} />}  

    </div>
  )

}


function mapStateToProps({ sidebar, enlarge, cart  }) {
  return { sidebar, enlarge, cart }
}

const actions = { usersCart, createGuestCart, getGuestCart, convertGuestCart, zeroInventorySettingCheck }

export default connect(mapStateToProps, actions)(withCookies(CustomerFacing))