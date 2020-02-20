import React, { Component } from 'react'
import { BrowserRouter , Route } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'
import '../stylesheets/all.css.scss'

import Header from './PageComponents/front_end/Header'
import Home from './Pages/front_end/Home'
import Product from './Pages/front_end/Product'
import Category from './Pages/front_end/Category'


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

    // This is here purely as a development mechanic, nodemon was restarting server too fast or something (504 gateway timeouts on fetchuser() and others, otherwise)
    // setTimeout(() => {
    //   if(process.env.NODE_ENV === 'development' && !this.props.auth) {
    //     window.location.reload()
    //   }
    // }, 800);
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


export default connect(mapStateToProps, actions)(App)