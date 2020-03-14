import React, { Component } from 'react'
import { BrowserRouter , Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchUser, usersCart, allInStockProducts } from '../actions'
import '../stylesheets/all.css.scss'

import Header from './page_components/front_end/Header'
import Home from './pages/front_end/Home'
import Product from './pages/front_end/Product'
import Category from './pages/front_end/Category'
import Checkout from './pages/front_end/Checkout'
import Account from './pages/front_end/Account'


class App extends Component {
  componentDidMount() {
    // Check to see if user is logged in
    this.props.fetchUser().then(() => {
      if (this.props.auth) {
        // If logged in, check for cart.
        this.props.usersCart(this.props.auth._id)
      }
    })
    this.props.allInStockProducts()
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

function mapStateToProps({ auth, cart, products }) {
  return { auth, cart, products }
}

const actions = { fetchUser, usersCart, allInStockProducts }

export default connect(mapStateToProps, actions)(App)