import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { updateCart, createOrder, createShipment } from "../../../../utils/API"
import { handleToken } from '../../../../actions'


class Payment extends Component {
  constructor(props) {
    super()
    this.finalize = this.finalize.bind(this)
    this.state = {

    }
  }

  async componentDidMount() {

  }
  
  async proceedToNextStep() {

  }

  async finalize(token) {
    await handleToken(token)
    // TO DO
    // IF HANDLING ABOVE TOKEN FAILS ^

    // TO DO
    // handle if the addresses used where past addresses and if not, add them to the users list of addresses
    let date = new Date()
    const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()

    let cart = this.props.cart
    cart.checkout_state = 'complete'
    cart.deleted_at = today
    cart.converted = true

    let updated_cart = await updateCart(cart)

    // Make shipment
    let shipment = {
      billing_address: cart.billing_address,
      shipping_address: cart.shipping_address,
      chosen_rate: {
        cost: cart.chosen_rate.cost,
        shipping_method: cart.chosen_rate.shipping_method
      },
      status: 'pending',
      date_shipped: null,
      line_items: cart.line_items,
      _user_id: cart._user_id
    }

    const new_shipment = await createShipment(shipment)

    // Create Order
    let order = {
      sub_total: 1,
      total: cart.total,
      shipment: new_shipment.data._id,
      date_placed: date,
      _user_id: cart._user_id,
      email: cart.email
    }

    await createOrder(order)

    let state = {
      cart: updated_cart.data,
      step: "complete",
    }
    this.props.topStateSetter(state)
  }

  render() {
    console.log(this.state)
    console.log(this.props)
    return (
      <div>
        <StripeCheckout
          name="Node Store"
          description='Purchase your order at ______' 
          panelLabel="Purchase"
          amount={this.props.cart.total}
          token={token => this.finalize(token)}
          stripeKey={process.env.REACT_APP_STRIPE_KEY}
          email={this.props.customer.email}
        >
          <button className="btn">Pay For Order</button>
        </StripeCheckout>
      </div>
    )
  }
}

export default Payment