import React, { Component } from 'react'
import { connect } from 'react-redux'
import CheckoutContainer from '../../../page_components/front_end/Checkout/CheckoutContainer'
import { updateCheckoutState } from '../../../../actions'
import loadingGif from '../../../../images/pizzaLoading.gif'
import './checkout.css.scss'
// pull from actions. create action to make request for adding product-data to the cart

class Checkout extends Component  {
  constructor(props) {
    super()
    this.checkout_state = (props.cart ? props.cart.checkout_state : null)
    this.state = {
      
    }
  }

  async componentDidMount() {
    if(this.checkout_state === "shopping" ) {
      console.log('did mount')
      let cart_instance = this.props.cart
      cart_instance.checkout_state = 'address'
      await this.props.updateCheckoutState(cart_instance)
    }
  }

  updateCheckoutState(cart) {
    this.props.updateCheckoutState(cart)
  }

  
  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Node Store Checkout</h1>
        {!this.props.cart ? <img className="loadingGif loadingGifCenterScreen" src={loadingGif} /> :
          <CheckoutContainer updateCheckoutState={this.props.updateCheckoutState} address_form_state={this.props.form} cart={this.props.cart} /> }
      </div>
    )
  }
}


function mapStateToProps({ auth, cart, form }) {
  return { auth, cart, form }
}

const actions = { updateCheckoutState }

export default connect(mapStateToProps, actions)(Checkout)