import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from "../../shared/Form"
import { reset } from "redux-form"
import { createOrder, createShipment, updateCart, getCartByID, getShippingMethodForCheckout, updateOrder } from "../../../utils/API"
import { formatMoney, capitalizeFirsts } from "../../../utils/helpFunctions"
import { dispatchObj } from "../../../actions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import AddressDisplayEdit from "../../admin/shared/AddressDisplayEdit"
import { addressFormFields, validate } from './formFields'
import { validatePresenceOnAll } from "../../../utils/validations"
import FormModal from "../../shared/Form/FormModal"
import CartLineItems from '../shared/CartLineItems'
import Modal from "../../shared/Modal"
import Payment from "./Payment"
import {loadStripe} from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js';
import OfflinePayment from './OfflinePayment';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY)

class Cart extends Component {
  constructor(props) {
    super()
    this.routeParamID = props.match.params.id
    
    this.addToLineItems = this.addToLineItems.bind(this)
    this.billingFormSubmit = this.billingFormSubmit.bind(this)
    this.shippingFormSubmit = this.shippingFormSubmit.bind(this)
    this.showEditIndicator = this.showEditIndicator.bind(this)
    this.showEditModal = this.showEditModal.bind(this)
    this.updateCartProperty = this.updateCartProperty.bind(this)
    this.shippingMethodSelection = this.shippingMethodSelection.bind(this)
    this.submitGuestEmail = this.submitGuestEmail.bind(this)
    this.adjustLineItemQuantity = this.adjustLineItemQuantity.bind(this)
    this.adjustLineItemCost = this.adjustLineItemCost.bind(this)

    this.state = {
      cart: null,
      result: null,
      quantity: 1,
      addProduct: false,
      editForm: null,
      editShipping: false,
      rateFields: null,
      convert: false
    }
  }

  async componentDidMount() {
    let { data, status } = await this.props.getCartByID(this.routeParamID)

    if (status !== 200) {
      return
    }

    const shipping_method = await this.props.getShippingMethodForCheckout()

    const rates = shipping_method.data.shipping_rates.filter((rate) => rate.display === true)

    const fields = rates.map((rate) => {
      if (data.chosen_rate && data.chosen_rate.rate === rate.name) {
        return {
          name: rate.name,
          value: rate.effector,
          default: true,
          redux_field: "shipping_rates"
        }
      } else {
        return {
          name: rate.name,
          value: rate.effector,
          default: false,
          redux_field: "shipping_rates"
        }
      }
    })

    const formRates = [{ 
      label: 'Shipping method', 
      name: 'shipping_rates', 
      typeOfComponent: 'dropdown', 
      options: fields, 
      noValueError: 'You must provide an address', 
      value: null 
    }]

    this.setState({ cart: data, rateFields: formRates  })
  }

  async addToLineItems(cart) {
    const { data } = await this.props.updateCart(cart)
    this.setState({ cart: data })
  }

  async removeLineItem(cart) {
    let { data } = await this.props.updateCart(cart)
    this.setState({ cart: data })
  }

  async adjustLineItemQuantity(cart) {
    let { data } = await this.props.updateCart(cart)
    this.setState({ cart: data })
  }

  renderSubTotal() {
    let sub_total = 0
    this.state.cart.line_items.forEach((item) => {
      sub_total = sub_total + (item.product_price * item.quantity)
    })
    return parseFloat(formatMoney(sub_total))
  }

  renderTax() {
    let sub_total = this.renderSubTotal()
    let shipping = this.state.cart.chosen_rate ? this.state.cart.chosen_rate.cost : 0
    let tax = (sub_total + shipping) * .08
    return parseFloat(formatMoney(tax))
  }

  renderTotal() {
    let sub_total = this.renderSubTotal()
    let tax = this.renderTax()
    let shipping = this.state.cart.chosen_rate ? this.state.cart.chosen_rate.cost : 0
    let total = parseFloat(tax) + parseFloat(sub_total) + shipping
    return formatMoney(total)
  }


  async billingFormSubmit() {
    let cart = this.state.cart
    const bill_addy = this.props.form.billing_admin_checkout_form.values
    cart.billing_address = buildAddress(bill_addy, cart._user_id, "billing")
    const { data } = await this.props.updateCart(cart)
    this.setState({ cart: data })
  }

  async shippingFormSubmit() {
    let cart = this.state.cart
    const ship_addy = this.props.form.shipping_admin_checkout_form.values
    cart.shipping_address = buildAddress(ship_addy, cart._user_id, "shipping")
    const { data } = await this.props.updateCart(cart)
    this.setState({ cart: data })
  }

  async updateCartProperty(address, property) {
    const form_value = this.props.form['edit_cart_property_form'].values[property]
    address[property] = form_value
    let cart = this.state.cart
    if (address.bill_or_ship === "shipping") { 
      cart.shipping_address = address
    } else {
      cart.billing_address = address
    }

    const { data } = await this.props.updateCart(cart)
    this.setState({ editForm: null, propertyToEdit: null, cart: data })
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

  async shippingMethodSelection() {
    const selected_shipping_method = this.props.form[`shipping_method_selection_form`].values
    const cost = selected_shipping_method.shipping_rates.value
    const shipping_method = "Flat Rate"
    const rate = selected_shipping_method.shipping_rates.name

    let cart = {...this.state.cart}

    let chosen_rate = {
        cost,
        shipping_method,
        rate
    }
    cart.chosen_rate = chosen_rate
    let fields = this.state.rateFields[0].options.map((rateField) => {
      if (rateField.name === rate) {
        rateField.default = true
        return rateField
      } else {
        rateField.default = false
        return rateField
      }
    })

    let formRates = this.state.rateFields
    formRates.options = fields

    const { data } = await this.props.updateCart(cart)
    this.setState({ cart: data, editShipping: false, rateFields: formRates })
  }

  async submitGuestEmail() {
    const guest_email = this.props.form[`guest_email_admin_checkout_form`].values.email
    let cart = this.state.cart
    cart.email = guest_email

    const { data } = await this.props.updateCart(cart)
    this.setState({ cart: data })
  }



  async adjustLineItemCost(line_items){
    let cart = this.state.cart
    cart.line_items = line_items
    let { data } = await this.props.updateCart(cart)

    this.setState({ cart: data })
  }

  render() {
    let cart = this.state.cart

    let containerStyle = {
      marginTop: "30px"
    }
    if (!this.props.mobile) {
      containerStyle.fontSize = "20px"
    }
    return (
      <div style={ containerStyle }>
        {cart &&
          <>
            <h1 style={{ textDecoration: "underline"}}> Cart</h1>

            {cart.checkout_state === "complete" && <h2>Status: Complete</h2>}

            {!cart.email ?
              <div>
                <Form 
                  onSubmit={this.submitGuestEmail}
                  submitButtonText={"Submit"}
                  formFields={[
                    { label: 'Guest Email', name: 'email', noValueError: 'You must provide an address', value: null },
                  ]} 
                  form={"guest_email_admin_checkout_form"}
                  validation={validate}
                />
              </div>
            :
              <h2>Email: {cart.email}</h2>
            }

            <CartLineItems
              cart={cart}
              addToLineItems={this.addToLineItems}
              removeLineItem={this.removeLineItem}
              adjustLineItemQuantity={this.adjustLineItemQuantity}
              adjustCost={this.adjustLineItemCost}
            />

            <h2>Billing Address</h2>
            {cart.billing_address ? 
              <AddressDisplayEdit 
                showEditIndicator={this.showEditIndicator} 
                showEditModal={this.showEditModal}
                address={cart.billing_address} 
                bill_or_ship={"billing"} 
                propertyToEdit={this.state.propertyToEdit}
              />
            :             
              <Form 
                onSubmit={this.billingFormSubmit}
                submitButtonText={"Submit"}
                formFields={addressFormFields} 
                form={"billing_admin_checkout_form"}
                validation={validate}
              />
            }

            <h2>Shipping Address</h2>
            {cart.shipping_address ? 
              <AddressDisplayEdit 
                showEditIndicator={this.showEditIndicator} 
                showEditModal={this.showEditModal}
                address={cart.shipping_address} 
                bill_or_ship={"shipping"} 
                propertyToEdit={this.state.propertyToEdit}
              />
            : 
              <Form 
                onSubmit={this.shippingFormSubmit}
                submitButtonText={"Submit"}
                formFields={addressFormFields}
                form={"shipping_admin_checkout_form"}
                validation={validate}
              />
            }


            <h2>Shipping</h2>
            {cart.chosen_rate ?
              <div>
                <h4 className="margin-bottom-none">Selected Shipping: {cart.chosen_rate.rate}</h4>
                <h4 onClick={() => this.setState({ editShipping: true })} className="margin-top-none">Edit Shipping<FontAwesomeIcon icon={faEdit} /></h4>
              </div> 
            : !cart.chosen_rate &&
              <div>
                <h3>Choose Shipping Method</h3>
                <div>
                  <Form 
                    submitButton={<div/>}
                    onChange={this.shippingMethodSelection}
                    formFields={this.state.rateFields}
                    form='shipping_method_selection_form'
                  />
                </div>
              </div>
            }

          {this.state.editShipping && this.state.rateFields &&
            <div>
              <h3>Choose Shipping Method</h3>
              <div>
                <Form 
                  onChange={this.shippingMethodSelection}
                  submitButton={<div/>}
                  cancel={() => this.setState({ editShipping: false })}
                  formFields={this.state.rateFields}
                  form='shipping_method_selection_form'
                />
              </div>
            </div>
          }

            <div className="margin-s-v">
              Sub Total: ${this.renderSubTotal()}
            </div>
            <div className="margin-s-v">
              Shipping: ${cart.chosen_rate ? cart.chosen_rate.cost : 0}            </div>
            <div className="margin-s-v">
              Tax: ${this.renderTax()}
            </div>
            <div className="margin-s-v">
              Total: ${this.renderTotal()}
            </div>
            { cart.billing_address && cart.shipping_address && cart.chosen_rate && cart.line_items.length > 0 &&
              <button onClick={() => this.setState({ convert: true })}>Convert Cart To Order</button>
            }

            {this.state.convert &&
              <Modal cancel={() => this.setState({ convert: false }) }>
                <Elements stripe={stripePromise}>
                  <Payment cart={cart} />
                </Elements>
                <OfflinePayment cart={cart} />
              </Modal>
            }
          </>
        }

        {
          this.state.editForm && 
            <div>
              <FormModal
                onSubmit={this.state.editForm.onSubmit}
                submitButton={<div/>}
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

      </div>
    )
  }
}


const buildAddress = (addy, user_id, bill_or_ship) => {
  const address = {
    first_name: addy.first_name,
    last_name: addy.last_name,
    company: addy.company,
    street_address_1: addy.street_address_1,
    street_address_2: addy.street_address_2,
    city: addy.city,
    state: addy.state,
    zip_code: addy.zip_code,
    phone_number: addy.phone_number,
    bill_or_ship: bill_or_ship,
    _user_id: user_id,
    country: addy.country
  }

  return address
}

function mapStateToProps({ form, mobile }) {
  return { form, mobile }
}

const actions = { getCartByID, updateCart, createOrder, updateOrder, createShipment, getShippingMethodForCheckout, dispatchObj }

export default connect(mapStateToProps, actions)(Cart)
