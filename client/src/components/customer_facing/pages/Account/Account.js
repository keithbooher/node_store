import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import MultiPanel from '../../../shared/MultiPanel/MultiPanel'
import Details from './page_components/Details'
import Orders from './page_components/Orders'
import Reviews from './page_components/Reviews'
import MetaTags from 'react-meta-tags'
import './account.scss'
class Account extends Component  {
  constructor(props) {
    super()
    this.chooseTab = this.chooseTab.bind(this)
    this.state = {
      chosen_tab: "details"
    }
  }


  chooseTab(tab_of_choice) {
    this.setState({ chosen_tab: tab_of_choice })
  }

  
  render() {
    const sections = [
      {tab: "details", path: "/account/details"},
      {tab: "orders", path: "/account/orders"},
      {tab: "reviews", path: "/account/reviews"}
    ]
    return (
      <div style={{ padding: ".4em .4em 80px .4em" }} className={`${!this.props.mobile && "max-customer-container-width margin-auto-h"}`}>
        <MetaTags>
          <title>Account Info | Keep Your Eye Open</title>
          <meta name="description" content="Adjust and review your user information and purchase history" />
          <meta name="keywords" content="" />
        </MetaTags>
        <h1 style={{ textAlign: 'center' }}>Account</h1>
        <MultiPanel chosen_tab={this.state.chosen_tab} chooseTab={this.chooseTab} sections={sections}>
          <div>
            <Route exact path="/account/details" component={Details} />
            <Route exact path="/account/orders" component={Orders} />
            <Route exact path="/account/reviews" component={Reviews} />
          </div>
        </MultiPanel>
      </div>
    )
  }
}

export default Account