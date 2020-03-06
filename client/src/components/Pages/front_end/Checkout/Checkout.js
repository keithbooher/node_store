import React, { Component } from 'react'
import { connect } from 'react-redux'
import CheckoutContainer from '../../../page_components/front_end/Checkout/CheckoutContainer'
import { updateCheckoutState } from '../../../../actions'
import './checkout.css.scss'
// pull from actions. create action to make request for adding product-data to the cart

class Checkout extends Component  {
  constructor(props) {
    super()
    this.checkout_state = (props.cart ? props.cart.checkout_state : null)
    this.state = {
      
    }
  }

  componentDidMount() {
    const checkout_states = ['shopping', 'address', 'payment', 'review']
    if(this.checkout_state === "shopping" ) {
      this.props.updateCheckoutState('address')
    }
  }

  
  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>
          Node Store Checkout
        </h1>
        <CheckoutContainer cart={this.props.cart} />

      </div>
    )
  }
}


function mapStateToProps({ auth, cart }) {
  return { auth, cart }
}

export default connect(mapStateToProps, null)(Checkout)