import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom';  
import { stripeIntent, updateCart, createOrder, createShipment, updateOrder } from "../../../utils/API"
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const Payment = ({ 
  mobile, 
  cart, 
  stripeIntent, 
  updateCart, 
  createOrder, 
  createShipment, 
  updateOrder
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory()

  const finalize = async (e) => {
    e.preventDefault()
    await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })
    let charge = await stripeIntent((cart.total * 100) - 50)
    // TO DO
    // IF HANDLING ABOVE TOKEN FAILS ^

    // TO DO
    // handle if the addresses used where past addresses and if not, add them to the users list of addresses
    let date = new Date()
    const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()

    cart.checkout_state = 'complete'
    cart.deleted_at = today
    cart.converted = true

    let updated_cart = await updateCart(cart)

    // Create Order
    let order = {
      tax: cart.tax,
      sub_total: cart.sub_total,
      total: cart.sub_total,
      date_placed: date,
      _user_id: cart._user_id,
      email: cart.email,
      payment: charge
    }
    const new_order = await createOrder(order)

    // Make shipment
    let shipment = {
      billing_address: cart.billing_address,
      shipping_address: cart.shipping_address,
      chosen_rate: {
        cost: cart.chosen_rate.cost,
        shipping_method: cart.chosen_rate.shipping_method,
        shipping_rate: cart.chosen_rate.rate
      },
      status: 'pending',
      date_shipped: null,
      line_items: cart.line_items,
      _user_id: cart._user_id
    }
    const new_shipment = await createShipment(shipment)

    // update order with shipment asynchronously
    let updated_order = new_order.data
    updated_order.shipment = new_shipment.data._id
    await updateOrder(updated_order)

    history.push(`/admin/orders/${new_order.data._id}`)
  }

  return (
    <form onSubmit={(e) => finalize(e)}>
      <CardElement />
      <div style={mobile ? { marginTop: "40px", width: "90%" } : { margin: "40px auto 0px auto", width: "80%" }}>
        <button style={mobile ? { fontSize: "20px", width: "100%" } : { width: "300px", fontSize: "25px" }} className={`bold margin-m-v`}>Pay For Order</button>
      </div>
    </form>
  )

}

function mapStateToProps({ mobile }) {
  return { mobile }
}

const actions = { stripeIntent, updateCart, createOrder, createShipment, updateOrder }

export default connect(mapStateToProps, actions)(Payment)
