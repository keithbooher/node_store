import React, { Component } from 'react'
import { BrowserRouter , Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchUser } from '../actions'
import '../stylesheets/all.css.scss'

import Header from './page_components/customer_facing/Header'
import Home from './pages/customer_facing/Home'
import Product from './pages/customer_facing/Product'
import Category from './pages/customer_facing/Category'
import Checkout from './pages/customer_facing/Checkout'
import Account from './pages/customer_facing/Account'


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