import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'

import Home from '../../customer_facing/pages/Home'
import Product from '../../customer_facing/pages/Product'
import Category from '../../customer_facing/pages/Category'
import Checkout from '../../customer_facing/pages/Checkout'
import Account from '../../customer_facing/pages/Account'
import Header from '../../customer_facing/components/Header'
import Sidebar from '../../customer_facing/components/Sidebar'
import "./customer.scss"


class CustomerFacing extends Component {
  constructor(props) {
    super()
    this.state = {admin: null}
  }

  render() {
    let sidebar_class
    switch (this.props.sidebar) {
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
          <Header setCartCookie={this.props.setCartCookie} />
          <div id="body_content_container" className="padding-s">
            <Route exact path="/" component={Home} />
            <Route exact path="/shop/:category" component={Category} />
            <Route exact path="/shop/:category/:product" component={Product} />
            <Route exact path="/checkout" component={Checkout} />
            <Route path="/account" component={Account} />
          </div>
        </div>

      </div>
    )
  }
}


function mapStateToProps({ sidebar }) {
  return { sidebar }
}

export default connect(mapStateToProps, null)(CustomerFacing)