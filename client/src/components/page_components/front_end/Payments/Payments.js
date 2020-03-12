import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { connect } from 'react-redux'
import * as actions from '../../../../actions'
import API from '../../../../utils/API'
import _ from "lodash"

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
    this.props.updateCart(cart)

    delete cart.billing_address._id
    delete cart.shipping_address._id
    cart.line_items = _.map(cart.line_items, (line_item) => {
      delete line_item._id
      return line_item
    })

    let order = {
      sub_total: cart.sub_total,
      total: cart.sub_total,
      billing_address: cart.billing_address,
      shipping_address: cart.shipping_address,
      date_placed: date,
      line_items: cart.line_items,
      _user_id: cart._user_id,
    }

    console.log(order)

    await API.createOrder(order)
    console.log('made itt?????')
    this.props.clearCheckoutForm()
    this.props.chooseTab("review")
  }

  render() {
    console.log(this.props)
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

export default connect(null, actions)(Payments)