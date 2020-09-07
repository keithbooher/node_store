import React, { Component } from 'react'
import { connect } from 'react-redux'
import CheckoutContainer from './page_components/CheckoutContainer'
import { getCurrentUser } from '../../../../utils/API'
import MetaTags from 'react-meta-tags'
import './checkout.css.scss'
// pull from actions. create action to make request for adding product-data to the cart

class Checkout extends Component  {
  constructor(props) {
    super()
    this.state = {
      current_user: null
    }
  }
  async componentDidMount() {
    // make api request for cart and then set the state for cart (if we need it here)
    const current_user = await this.props.getCurrentUser()
    console.log(current_user.data)
    this.setState({ current_user: current_user.data })
  }
  
  render() {
    // Need to render a side container showing the contents of the cart 
    return (
      <div style={{ padding: ".4em .4em 100px .4em" }} className={`${!this.props.mobile && "max-customer-container-width margin-auto-h"}`}>
        <MetaTags>
          <title>Node Store Checkout</title>
          <meta name="description" content="Finalize your purchase here" />
          <meta name="keywords" content="" />
        </MetaTags>
        <h1 style={{ textAlign: 'center' }}>Checkout</h1>
        {this.state.current_user !== null ? 
          <CheckoutContainer current_user={this.state.current_user} />
        : ""}
      </div>
    )
  }
}

const actions = { getCurrentUser }

export default connect(null, actions)(Checkout)