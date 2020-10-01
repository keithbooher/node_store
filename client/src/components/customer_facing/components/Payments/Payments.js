import React, { useState } from 'react'
import { connect } from 'react-redux'
import { convertCart, updateUser, updateCart } from '../../../../actions'
import { createOrder, createShipment, checkInventory, stripeIntent } from '../../../../utils/API'
import _ from "lodash"
import { reset } from "redux-form"
import { useCookies } from 'react-cookie'
import LowInventory from "../../../shared/LowInventory"
import ReviewItems from "./ReviewItems"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Modal from '../../../shared/Modal';


const checkPassedBillingUsed = (bill_addy, cart) => {
  // Check if any of the customers past billing addresses match the one thats submitted
  // If it matches then, we set the variable to true and prevent updating the user's address records
  let boolean = false
  for (const address of bill_addy) {
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
        && address.country === cart.billing_address.country
        ) {
      boolean = true
    }
  }
  return boolean
}
const checkPassedShippingUsed = (ship_addy, cart) => {
  // Check if any of the customers past shipping addresses match the one thats submitted
  // If it matches then, we set the variable to true and prevent updating the user's address records
  let boolean = false  
  for (const address of ship_addy) {
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
        boolean = true
    }
  }
  return boolean
}

const Payments = ({ 
  stripeIntent, 
  auth, 
  cart, 
  updateUser, 
  makeNewOrderAvailable, 
  chooseTab, 
  preExistingShipping, 
  preExistingBilling, 
  updateCart, 
  createOrder, 
  checkInventory, 
  createShipment,
  mobile,
  form,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [outOfStockMessage, setOutOfStock] = useState(null)
  const [loading, setLoading] = useState(false)
  const [issueWithPayment, setIssueWithPayment] = useState(false)
  const stripe = useStripe();
  const elements = useElements();

  const someFunction = async (e) => {
    setLoading(true)
    e.preventDefault();
    // First check if products are still available to buy
    const inventoryCheck = await checkInventory(cart.line_items)
    if (inventoryCheck.data.filter((item) => item !== null).length > 0) {
      // setState for low inventory error and then remove from cart
      setLoading(false)
      setOutOfStock(inventoryCheck.data)
      return 
    }

    let payment_method = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })

    // this is actually creating intent
    const charge = await stripeIntent((cart.total * 100) - 50, payment_method)
    if (charge.status !== 200) {
      setLoading(false)
      setIssueWithPayment(true)
      return
    }
      
    // let cart = cart
    let today = new Date()
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    cart.checkout_state = 'complete'
    cart.converted = true

    // update cart in db
        
    // Have to remove _id before we add billing and shipping to an order 
    // (mongoDB creates the _id so it throws a fit that there is already an _id)
    delete cart.billing_address._id
    delete cart.shipping_address._id
    cart.line_items = _.map(cart.line_items, (line_item) => {
      delete line_item._id
      return line_item
    })

    let user = auth
    // TO DO
    // in the check address functions map through the addresses and check.
    let past_billing_used = checkPassedBillingUsed(user.billing_address, cart)
    let past_shipping_used = checkPassedShippingUsed(user.shipping_address, cart)


    // if this address doesn't match past addresses used, we add to the user's address records
    if (past_shipping_used === false ) {
      if (!preExistingShipping) {
        user.shipping_address.push(cart.shipping_address)
      }
    }
    if (past_billing_used === false) {
      if (!preExistingBilling) {
        user.billing_address.push(cart.billing_address)
      }
    }
    if (past_billing_used === false || past_shipping_used === false) {
      // TO DO 
      // Change this to just be an api call
      updateUser(user)
    }

    // Make shipment
    let shipment = {
      billing_address: cart.billing_address,
      shipping_address: cart.shipping_address,
      chosen_rate: {
        cost: cart.chosen_rate.cost,
        shipping_method: cart.chosen_rate.shipping_method,
        shipping_rate: cart.chosen_rate.rate,
        carrier: cart.chosen_rate.carrier
      },
      status: 'pending',
      date_shipped: null,
      line_items: cart.line_items,
      _user_id: cart._user_id
    }
    const new_shipment = await createShipment(shipment)
    // Create Order
    let order = {
      sub_total: cart.sub_total,
      tax: cart.tax,
      total: cart.total,
      shipment: new_shipment.data._id,
      date_placed: date,
      _user_id: cart._user_id,
      email: auth.email ? auth.email : cart.email,
      payment: charge.data,
      customer_notes: form['customer_order_notes_form'].values ? form['customer_order_notes_form'].values.customer_notes : ""
    }
    const new_order = await createOrder(order)

    let updated_cart = await updateCart(cart)

    /////////////////////////////////////////////
    // For now Im just going to remove guest cart  
    // cookies every time someone checks out
    removeCookie("guest_cart")

    //make available to the checkout page and ultimately Review panel.
    makeNewOrderAvailable(new_order.data, updated_cart.data, new_shipment.data)
    setLoading(false)
    chooseTab('review')
  }

  const out_of_stock_title = "Sorry, these products are now low on stock and their quantities have been updated to reflect the most current available inventory count"

  return (
    <>
      {auth && <ReviewItems cart={cart} customer={auth} />}
      
      <form style={{ width: "80%", margin: "0px auto" }} onSubmit={someFunction}>
        <div className="background-color-white border-radius-s" style={{ padding: "10px" }}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '20px',
                  color: 'black',
                  '::placeholder': {
                    color: 'darkgrey',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        <div style={mobile ? { marginTop: "40px", width: "90%" } : { margin: "0px auto", width: "100%" }}>
          {loading ? <FontAwesomeIcon className="loadingGif margin-m-v" icon={faSpinner} spin /> : <button style={mobile ? { fontSize: "20px", width: "100%" } : { width: "300px", fontSize: "25px" }} className={`bold margin-m-v`}>Pay For Order</button>}
        </div>
      </form>

      {issueWithPayment && 
        <Modal cancel={() => setIssueWithPayment(false)}>
          <h2>There was an issue with your payment method</h2>
        </Modal>
      }

      {outOfStockMessage && 
        <LowInventory 
          adjust={true} 
          title={out_of_stock_title} 
          cart={cart} 
          out_of_stock_items={outOfStockMessage} 
          cancel={() => setOutOfStock(null)}
          update={(cart) => updateCart(cart)}
        />
      }
  </>
  )

}

function mapStateToProps({ auth, mobile, form }) {
  return { auth, mobile, form }
}

const actions = { reset, convertCart, updateUser, stripeIntent, updateCart, createOrder, createShipment, checkInventory }

export default connect(mapStateToProps, actions)(Payments)



