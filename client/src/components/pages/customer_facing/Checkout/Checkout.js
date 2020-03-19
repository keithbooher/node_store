import React, { Component } from 'react'
import { connect } from 'react-redux'
import CheckoutContainer from '../../../page_components/customer_facing/Checkout/CheckoutContainer'
import { updateCart, convertCart, clearCheckoutForm, updateUser } from '../../../../actions'
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
      let cart_instance = this.props.cart
      cart_instance.checkout_state = 'address'
      await this.props.updateCart(cart_instance)
    }
  }

  updateCart(cart) {
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
    console.log(this.props)
    // Need to render a side container showing the contents of the cart 
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Node Store Checkout</h1>
        {!this.props.cart ? 
          this.alternativeViews() :
          <CheckoutContainer updateUser={updateUser} clearCheckoutForm={clearCheckoutForm} convertCart={this.props.convertCart} updateCart={this.props.updateCart} address_form_state={this.props.form} cart={this.props.cart} /> }
      </div>
    )
  }
}


function mapStateToProps({ cart, form }) {
  return { cart, form }
}

const actions = { updateCart, convertCart, clearCheckoutForm, updateUser }

export default connect(mapStateToProps, actions)(Checkout)