import React, { Component } from 'react'
import { BrowserRouter , Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchUser } from '../actions'
import '../stylesheets/all.css.scss'

import Header from './customer_facing/components/Header'
import Home from './customer_facing/pages/Home'
import Product from './customer_facing/pages/Product'
import Category from './customer_facing/pages/Category'
import Checkout from './customer_facing/pages/Checkout'
import Account from './customer_facing/pages/Account'


class App extends Component {
  componentDidMount() {
    // Check to see if user is logged in
    this.props.fetchUser()
  }

  render() {
    
    console.log(this.props)
    return (
      <div className="">
        <BrowserRouter>
          <div>
            <Header />
            <div id="body_content_container">
              <Route exact path="/" component={Home} />
              <Route exact path="/shop/:category" component={Category} />
              <Route exact path="/shop/:category/:product" component={Product} />
              <Route exact path="/checkout" component={Checkout} />
              <Route exact path="/account" component={Account} />
            </div>
          </div>
        </BrowserRouter>
      </div>
    )
  }
}


const actions = { fetchUser }

export default connect(null, actions)(App)