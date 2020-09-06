import React, { Component } from 'react'
import { connect } from 'react-redux'
import StripeCheckout from 'react-stripe-checkout'
import { updateCart, createOrder, createShipment, updateOrder, handleToken } from "../../../../utils/API"
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
class Payment extends Component {
  constructor(props) {
    super()
    this.finalize = this.finalize.bind(this)
    this.showEditIndicator = this.showEditIndicator.bind(this)
    this.showEditModal = this.showEditModal.bind(this)
    this.updateCartProperty = this.updateCartProperty.bind(this)
    this.state = {
      propertyToEdit: null,
      editForm: null
    }
  }

  async componentDidMount() {

  }
  
  async proceedToNextStep() {

  }

  async finalize(token) {
    let charge = "offline"
    if (token !== "offline") {
      charge = await this.props.handleToken(token)
    }
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

    let updated_cart = await this.props.updateCart(cart)

    // Create Order
    let order = {
      tax: cart.tax,
      sub_total: cart.sub_total,
      total: cart.sub_total,
      date_placed: date,
      _user_id: cart._user_id,
      email: this.props.customer.email ? this.props.customer.email : cart.email,
      payment: charge.data
    }
    const new_order = await this.props.createOrder(order)

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
    const new_shipment = await this.props.createShipment(shipment)

    // update order with shipment asynchronously
    let updated_order = new_order.data
    updated_order.shipment = new_shipment.data._id
    await this.props.updateOrder(updated_order)

    let state = {
      cart: updated_cart.data,
      step: "complete",
    }
    this.props.topStateSetter(state)
    this.props.history.push(`/admin/orders/${new_order.data._id}`)
  }

  async updateCartProperty(address, property) {
    const form_value = this.props.form['edit_cart_property_form'].values[property]
    address[property] = form_value
    let cart = this.props.cart
    if (address.bill_or_ship === "shipping") { 
      cart.shipping_address = address
    } else {
      cart.billing_address = address
    }

    const { data } = await this.props.updateCart(cart)
    this.props.topStateSetter({ cart: data })
    this.setState({ editForm: null, propertyToEdit: null })
    this.props.dispatchObj(reset("edit_cart_property_form"))
  }

  showEditModal(property, address) {
    const form_object = {
      address,
      onSubmit: () => this.updateCartProperty(address, property),
      cancel: () => {
        this.props.dispatchObj(reset("edit_cart_property_form"))
        this.setState({ editForm: null, propertyToEdit: null })
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
    this.setState({ editForm: form_object })
  }

  showEditIndicator(property, bill_or_ship) {
    let propertyToEdit = {
      property,
      bill_or_ship
    }
    this.setState({ propertyToEdit })
  }

  render() {
    console.log(this.props)
    return (
      <div>

        <div>

          <h3>Customer</h3>
          <div>{this.props.customer.email}</div>

          <h3>Line Items <FontAwesomeIcon className="hover hover-color-2" onClick={() => this.props.topStateSetter({ step: "cart" })} icon={faEdit} /></h3>
          <div className="flex flex_column">
            {this.props.cart.line_items.map((line_item, index) => {
              return (
                <div className={`${this.props.mobile && "flex"}`} key={index} style={{ marginTop: "5px" }}>
                  {this.props.mobile ?
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

          <div className={`${this.props.mobile && "flex"}`}>            
            <div className={`${this.props.mobile && "w-50"}`}>
              <h3>Billing Address</h3>
              <AddressDisplayEdit 
                showEditIndicator={this.showEditIndicator} 
                showEditModal={this.showEditModal}
                address={this.props.cart.billing_address} 
                bill_or_ship={"billing"} 
                propertyToEdit={this.state.propertyToEdit}
              />
            </div>
            <div className={`${this.props.mobile && "w-50"}`}>
              <h3>Shipping Address</h3>
              <AddressDisplayEdit 
                showEditIndicator={this.showEditIndicator} 
                showEditModal={this.showEditModal}
                address={this.props.cart.shipping_address} 
                bill_or_ship={"shipping"} 
                propertyToEdit={this.state.propertyToEdit}
              />
            </div>
          </div>


        </div>

        <StripeCheckout
          name="Node Store"
          description='Purchase your order at ______' 
          panelLabel="Purchase"
          amount={this.props.cart.total}
          token={token => this.finalize(token)}
          stripeKey={process.env.REACT_APP_STRIPE_KEY}
          email={this.props.customer.email}
        >
          <button className="btn margin-s-v">Pay With Credit Card</button>
        </StripeCheckout>

        <button onClick={() => this.setState({ offLinePayment: true })} >Pay Offline / 3rd party</button>

        {this.state.offLinePayment && 
          <Modal>
            <div>
              <h2>Are you sure you want to accept payment through another service?</h2>
              <button onClick={() => this.finalize("offline")}>Yes</button>
              <button onClick={() => this.setState({ offLinePayment: false })}>No, cancel</button>
            </div>
          </Modal>
        }

        {
          this.state.editForm && 
            <div>
              <FormModal
                onSubmit={this.state.editForm.onSubmit}
                cancel={this.state.editForm.cancel}
                submitButtonText={this.state.editForm.submitButtonText}
                formFields={this.state.editForm.formFields}
                form={this.state.editForm.form}
                validation={this.state.editForm.validation}
                title={"Updating Shipping Property"}
                initialValues={this.state.editForm.initialValues}
              />
            </div>
        }
        <Link to=""></Link>
      </div>
    )
  }
}

function mapStateToProps({ form, mobile }) {
  return { form, mobile }
}

const actions = { handleToken, updateCart, createOrder, updateOrder, dispatchObj, createShipment }

export default connect(mapStateToProps, actions)(withRouter(Payment))