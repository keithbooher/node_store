import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { connect } from 'react-redux'
import { updateCart, convertCart, updateUser, handleToken } from '../../../../actions'
import { createOrder } from '../../../../utils/API'
import _ from "lodash"
import { reset } from "redux-form"

class Payments extends Component {
  constructor(props) {
    super()
    this.someFunction = this.someFunction.bind(this)
  }
  async someFunction(token) {
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

    let user = this.props.auth
    let past_billing_used = false
    let past_shipping_used = false
    // Check if any of the customers past billing addresses match the one thats submitted
    // If it matches then, we set the variable to true and prevent updating the user's address records
    for (const address of this.props.auth.billing_address) {
      if (
          address.first_name === cart.billing_address.first_name
          && address.last_name === cart.billing_address.last_name
          && address.street_address_1 === cart.billing_address.street_address_1
          && address.street_address_2 === cart.billing_address.street_address_2
          && address.city === cart.billing_address.city
          && address.state === cart.billing_address.state
          && address.zip_code === cart.billing_address.zip_code
          && address.phone_number === cart.billing_address.phone_number
          && address._user_id === cart.billing_address._user_id
          ) {
        past_billing_used = true
      }
    }
    // Check if any of the customers past shipping addresses match the one thats submitted
    // If it matches then, we set the variable to true and prevent updating the user's address records
    for (const address of this.props.auth.shipping_address) {
      if (
        address.first_name === cart.shipping_address.first_name
        && address.last_name === cart.shipping_address.last_name
        && address.street_address_1 === cart.shipping_address.street_address_1
        && address.street_address_2 === cart.shipping_address.street_address_2
        && address.city === cart.shipping_address.city
        && address.state === cart.shipping_address.state
        && address.zip_code === cart.shipping_address.zip_code
        && address.phone_number === cart.shipping_address.phone_number
        && address._user_id === cart.shipping_address._user_id
        ) {
        past_shipping_used = true
      }
    }

    // if this address doesn't match past addresses used, we add to the user's address records
    if (past_shipping_used === false) {
      user.shipping_address.push(cart.shipping_address)
    }
    if (past_billing_used === false) {
      user.billing_address.push(cart.billing_address)
    }
    if (past_billing_used === false || past_shipping_used === false) {
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
      email: user.email
    }

    const new_order = await createOrder(order)

    //make available to the checkout page, ultimately Review panel.
    this.props.makeNewOrderAvailable(new_order.data)

    this.props.chooseTab("review")
    this.props.convertCart({checkout_state: 'complete', line_items: []})
    this.props.reset("billing_checkout_form")
    this.props.reset("shipping_checkout_form")
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

function mapStateToProps({ auth }) {
  return { auth }
}

const actions = { reset, updateCart, convertCart, updateUser, handleToken }

export default connect(mapStateToProps, actions)(Payments)