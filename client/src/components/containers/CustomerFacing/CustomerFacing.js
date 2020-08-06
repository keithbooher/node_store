import React, { Component } from 'react'
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
import EnlargeImage from "../../shared/EnlargeImage"
import Four04Page from "../../shared/Four04Page"
import { zeroInventorySettingCheck } from "../../../actions"

import "./customer.scss"


class CustomerFacing extends Component {
  constructor(props) {
    super()
    this.state = {
      admin: null,

    }
  }

  async componentDidMount() {
    await this.props.zeroInventorySettingCheck()
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
    console.log(this.props)
    return (
      <div className="customer_container">

        <Sidebar />

        <div className={`content_subcontainer ${sidebar_class}`}>
          <Header setCartCookie={this.props.setCartCookie} />
          <div id="body_content_container" className="padding-s">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/shop/:category" component={Category} />
              <Route exact path="/shop/:category/:product" component={Product} />
              <Route exact path="/checkout" component={Checkout} />
              <Route path="/account" component={Account} />
              <Route path="/order/:id" component={OrderPage} />
              <Route path="/faq" component={FAQ} />
              <Route component={Four04Page} />
            </Switch>
          </div>
        </div>

        {this.props.enlarge && <EnlargeImage cancel={() => this.setState({ enlargeImage: null })} image={this.props.enlarge.image} path={this.props.enlarge.path} />}  

      </div>
    )
  }
}


function mapStateToProps({ sidebar, enlarge  }) {
  return { sidebar, enlarge }
}


export default connect(mapStateToProps, {zeroInventorySettingCheck})(CustomerFacing)