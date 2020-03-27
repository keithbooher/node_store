import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { connect } from 'react-redux'
import { clearCheckoutForm, updateCart, convertCart, updateUser, handleToken } from '../../../../actions'
import API from '../../../../utils/API'
import _ from "lodash"

class Payments extends Component {
  constructor(props) {
    super()
    this.someFunction = this.someFunction.bind(this)
  }
  async someFunction(token) {
    console.log(token)
    await this.props.handleToken(token)
    let cart = this.props.cart
    cart.checkout_state = 'complete'

    let today = new Date()
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    cart.deleted_at = date
    cart.converted = true
    await this.props.updateCart(cart)
        
    // Have to remove _id before we add billing and shipping to an order 
    // (mongoDB creates the _id so it throws a fit that there is already an _id)
    delete cart.billing_address._id
    delete cart.shipping_address._id
    cart.line_items = _.map(cart.line_items, (line_item) => {
      delete line_item._id
      return line_item
    })

    if (this.props.preExistingShipping === null || this.props.preExistingBilling === null) {
      // TO DO
      // Do some amount of checking to see if the address already exists

      let user = this.props.auth
      user.billing_address.push(cart.billing_address)
      user.shipping_address.push(cart.shipping_address)
      this.props.updateUser(user)
    }

    let order = {
      sub_total: cart.sub_total,
      total: cart.sub_total,
      billing_address: cart.billing_address,
      shipping_address: cart.shipping_address,
      date_placed: date,
      line_items: cart.line_items,
      _user_id: cart._user_id,
    }

    const new_order = await API.createOrder(order)

    //make available to the checkout page, ultimately Review panel.
    this.props.makeNewOrderAvailable(new_order.data)

    this.props.chooseTab("review")
    this.props.convertCart({checkout_state: 'complete', line_items: []})
    this.props.clearCheckoutForm()
  }

  render() {
    // console.log(this.props)
    return (
        <StripeCheckout
          name="Node Store"
          description='Purchase your order at ______' 
          panelLabel="Purchase"
          amount={500}
          token={token => this.someFunction(token)}
          stripeKey={process.env.REACT_APP_STRIPE_KEY}
        >
          <button className="btn">Pay For Order</button>
        </StripeCheckout>
    )
  }
}

function mapStateToProps({ auth, cart }) {
  return { auth, cart }
}

const actions = { clearCheckoutForm, updateCart, convertCart, updateUser, handleToken }

export default connect(mapStateToProps, actions)(Payments)