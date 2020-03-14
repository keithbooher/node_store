import React, { Component } from 'react'
import { connect } from 'react-redux'
import CheckoutContainer from '../../../page_components/front_end/Checkout/CheckoutContainer'
import { updateCart, convertCart, clearCheckoutForm } from '../../../../actions'
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
      await this.props.updateCart(cart_instance)
    }
  }

  updateCart(cart) {
    console.log('here?')
    this.props.updateCart(cart)
  }

  convertCart(cart) {
    this.props.convertCart(cart)
  }

  alternativeViews() {
    if (this.props.cart === {} || this.props.cart === null) {
      return <div>You have an empty cart right now, my dude</div>
    } else {
      return <img className="loadingGif loadingGifCenterScreen" src={loadingGif} />
    }
  }
  
  render() {
    // Need to render a side container showing the contents of the cart 
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Node Store Checkout</h1>
        {!this.props.cart ? 
          this.alternativeViews() :
          <CheckoutContainer clearCheckoutForm={clearCheckoutForm} convertCart={this.props.convertCart} updateCart={this.props.updateCart} address_form_state={this.props.form} cart={this.props.cart} /> }
      </div>
    )
  }
}


function mapStateToProps({ auth, cart, form }) {
  return { auth, cart, form }
}

const actions = { updateCart, convertCart, clearCheckoutForm }

export default connect(mapStateToProps, actions)(Checkout)