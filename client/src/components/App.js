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
  // Changed from didMount to willMount... harmful?
  componentWillMount() {
    this.props.fetchUser()
    this.props.allInstockProducts()
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