import React, { Component } from 'react'
import { BrowserRouter , Route } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'
import '../stylesheets/all.css.scss'

import Header from './Header'
import Home from './Pages/Home'
import Product from './Pages/Product'
import Category from './Pages/Category'


class App extends Component {
  // Changed from didMount to willMount... harmful?
  componentWillMount() {
    this.props.fetchUser()
    this.props.allProducts()
  }

  render() {
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

export default connect(null, actions)(App)