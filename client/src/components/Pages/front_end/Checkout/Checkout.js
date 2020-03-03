import React, { Component } from 'react'
import { connect } from 'react-redux'
import './checkout.css.scss'
import CheckoutContainer from '../../../page_components/front_end/Checkout/CheckoutContainer'
// pull from actions. create action to make request for adding product-data to the cart

class Checkout extends Component  {
  constructor(props) {
    super()
    this.state = {
      
    }
  }

  
  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>
          Node Store Checkout
        </h1>
        <CheckoutContainer />

      </div>
    )
  }
}


function mapStateToProps({ auth, cart }) {
  return { auth, cart }
}

export default connect(mapStateToProps, null)(Checkout)