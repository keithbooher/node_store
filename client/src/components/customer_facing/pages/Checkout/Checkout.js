import React, { Component } from 'react'
import CheckoutContainer from './page_components/CheckoutContainer'
import { getCurrentUser } from '../../../../utils/API'
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
    const current_user = await getCurrentUser()
    this.setState({ current_user: current_user.data })
  }
  
  render() {
    // Need to render a side container showing the contents of the cart 
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Node Store Checkout</h1>
        {this.state.current_user !== null ? 
          <CheckoutContainer current_user={this.state.current_user} />
        : ""}
      </div>
    )
  }
}

export default Checkout