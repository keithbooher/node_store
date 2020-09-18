import React, { useState } from 'react'
import { connect } from 'react-redux'
import { updateCart, createOrder, createShipment, updateOrder, stripeIntent } from "../../../../utils/API"
import AddressDisplayEdit from "../../shared/AddressDisplayEdit"
import { reset } from "redux-form"
import { capitalizeFirsts } from "../../../../utils/helpFunctions"
import { validatePresenceOnAll } from "../../../../utils/validations"
import { dispatchObj } from "../../../../actions"
import FormModal from "../../../shared/Form/FormModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { Link } from 'react-router-dom'
import { withRouter } from "react-router-dom"
import Modal from "../../../shared/Modal"
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const Payment = ({ 
  cart, 
  updateCart, 
  createOrder, 
  createShipment, 
  updateOrder, 
  topStateSetter, 
  history, 
  form,
  dispatchObj,
  customer,
  mobile,
  stripeIntent
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [propertyToEdit, setPropertyToEdit] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [offLinePayment, setOffLinePayment] = useState(null)


  const finalize = async (e, online_offline) => {
    e.preventDefault()
    let _cart = {...cart}
    let charge = "offline"
    if (online_offline !== "offline") {
      let payment_method = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      })
      
      const charge = await stripeIntent((cart.total * 100) - 50, payment_method)
    }
    // TO DO
    // IF PROCESSING ABOVE FAILS

    // TO DO
    // handle if the addresses used where past addresses and if not, add them to the users list of addresses
    let date = new Date()
    const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()

    _cart.checkout_state = 'complete'
    _cart.converted = true

    let updated_cart = await updateCart(_cart)

    // Create Order
    let order = {
      tax: _cart.tax,
      sub_total: _cart.sub_total,
      total: _cart.sub_total,
      date_placed: date,
      _user_id: _cart._user_id,
      email: customer.email ? customer.email : _cart.email,
      payment: charge.data
    }
    const new_order = await createOrder(order)

    // Make shipment
    let shipment = {
      billing_address: _cart.billing_address,
      shipping_address: _cart.shipping_address,
      chosen_rate: {
        cost: _cart.chosen_rate.cost,
        shipping_method: _cart.chosen_rate.shipping_method,
        shipping_rate: _cart.chosen_rate.rate
      },
      status: 'pending',
      date_shipped: null,
      line_items: _cart.line_items,
      _user_id: _cart._user_id
    }
    const new_shipment = await createShipment(shipment)

    // update order with shipment asynchronously
    let updated_order = new_order.data
    updated_order.shipment = new_shipment.data._id
    await updateOrder(updated_order)

    let state = {
      cart: updated_cart.data,
      step: "complete",
    }
    topStateSetter(state)
    history.push(`/admin/orders/${new_order.data._id}`)
  }

  const updateCartProperty = async (address, property) => {
    const form_value = form['edit_cart_property_form'].values[property]
    address[property] = form_value
    let cart = {...cart}
    if (address.bill_or_ship === "shipping") { 
      cart.shipping_address = address
    } else {
      cart.billing_address = address
    }

    const { data } = await updateCart(cart)
    topStateSetter({ cart: data })
    setPropertyToEdit(null)
    setEditForm(null)
    dispatchObj(reset("edit_cart_property_form"))
  }

  const showEditModal = (property, address) => {
    const form_object = {
      address,
      onSubmit: () => updateCartProperty(address, property),
      cancel: () => {
        dispatchObj(reset("edit_cart_property_form"))
        setPropertyToEdit(null)
        setEditForm(null)
      },
      submitButtonText: "Update Shipping Property",
      formFields: [
        { label: capitalizeFirsts(property), name: property, noValueError: `You must provide a value` },
      ],
      form: "edit_cart_property_form",
      validation: validatePresenceOnAll,
      initialValues: {
          [property]: address[property]
        }
    }
    setEditForm(form_object)
  }

  const showEditIndicator = (property, bill_or_ship) => {
    let propertyToEdit = {
      property,
      bill_or_ship
    }
    setPropertyToEdit(propertyToEdit)
  }

  return (
    <div>
      <div>

        <h3>Customer</h3>
        <div>{customer.email}</div>

        <h3>Line Items <FontAwesomeIcon className="hover hover-color-2" onClick={() => topStateSetter({ step: "cart" })} icon={faEdit} /></h3>
        <div className="flex flex_column">
          {cart.line_items.map((line_item, index) => {
            return (
              <div className={`${mobile && "flex"}`} key={index} style={{ marginTop: "5px" }}>
                {mobile ?
                  <div className="background-color-black margin-auto-v flex justify-center align-items-center" style={{ height: "150px", width: "150px", maxHeight: "150px", maxWidth: "150px" }}>
                    <img src={line_item.image} style={{ height: "auto", width: "auto", maxWidth: "150px", maxHeight: "150px" }} />
                  </div>
                : 
                  <div className="background-color-black margin-auto-v flex justify-center align-items-center" style={{ height: "300px", width: "300px", maxHeight: "300px", maxWidth: "300px" }}>
                    <img style={{ height: "auto", width: "auto", maxHeight: "300px", maxWidth: "300px" }} src={line_item.image}/>
                  </div>
                }

                <div>
                  <div>{line_item.product_name}</div>
                  <div>Quantity: {line_item.quantity}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className={`${mobile && "flex"}`}>            
          <div className={`${mobile && "w-50"}`}>
            <h3>Billing Address</h3>
            <AddressDisplayEdit 
              showEditIndicator={showEditIndicator} 
              showEditModal={showEditModal}
              address={cart.billing_address} 
              bill_or_ship={"billing"} 
              propertyToEdit={propertyToEdit}
            />
          </div>
          <div className={`${mobile && "w-50"}`}>
            <h3>Shipping Address</h3>
            <AddressDisplayEdit 
              showEditIndicator={showEditIndicator} 
              showEditModal={showEditModal}
              address={cart.shipping_address} 
              bill_or_ship={"shipping"} 
              propertyToEdit={propertyToEdit}
            />
          </div>
        </div>
      </div>

      <form onSubmit={(e) => finalize(e, "online")}>
        <CardElement />
        <div style={mobile ? { marginTop: "40px", width: "90%" } : { margin: "40px auto 0px auto", width: "80%" }}>
          <button style={mobile ? { fontSize: "20px", width: "100%" } : { width: "300px", fontSize: "25px" }} className={`bold margin-m-v`}>Pay For Order</button>
        </div>
      </form>

      <button onClick={() => setOffLinePayment(true)} >Pay Offline / 3rd party</button>

      {offLinePayment && 
        <Modal>
          <div>
            <h2>Are you sure you want to accept payment through another service?</h2>
            <button onClick={(e) => finalize(e, "offline")}>Yes</button>
            <button onClick={() => setOffLinePayment(false)}>No, cancel</button>
          </div>
        </Modal>
      }

      {
        editForm && 
          <div>
            <FormModal
              onSubmit={editForm.onSubmit}
              cancel={editForm.cancel}
              submitButtonText={editForm.submitButtonText}
              formFields={editForm.formFields}
              form={editForm.form}
              validation={editForm.validation}
              title={"Updating Shipping Property"}
              initialValues={editForm.initialValues}
            />
          </div>
      }
      <Link to=""></Link>
    </div>
  )

}

function mapStateToProps({ form, mobile }) {
  return { form, mobile }
}

const actions = { stripeIntent, updateCart, createOrder, updateOrder, dispatchObj, createShipment }

export default connect(mapStateToProps, actions)(withRouter(Payment))