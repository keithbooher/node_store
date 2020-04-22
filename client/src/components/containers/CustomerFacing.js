import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Home from '../customer_facing/pages/Home'
import Product from '../customer_facing/pages/Product'
import Category from '../customer_facing/pages/Category'
import Checkout from '../customer_facing/pages/Checkout'
import Account from '../customer_facing/pages/Account'


class CustomerFacing extends Component {
  constructor(props) {
    super()
    this.state = {admin: null}
  }

  render() {
    return (
      <div id="body_content_container">
        <Route exact path="/" component={Home} />
        <Route exact path="/shop/:category" component={Category} />
        <Route exact path="/shop/:category/:product" component={Product} />
        <Route exact path="/checkout" component={Checkout} />
        <Route exact path="/account" component={Account} />
      </div>
    )
  }
}


export default CustomerFacing