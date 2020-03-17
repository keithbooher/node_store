import React, { Component } from 'react'
import _ from "lodash"
import Form from '../../../shared/Form/Form'
import formFields from '../formFields'

class AddressPanel extends Component  {
  constructor(props) {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    console.log(props)
    this.state = {

    }
  }

  async handleSubmit() {
    let cart_instance = this.props.cart
    cart_instance.checkout_state = 'payment'
    const ship_addy = this.props.address_form_state.shipping_checkout_form.values
    const bill_addy = this.props.address_form_state.billing_checkout_form.values
    const shipping_address = {
      first_name: ship_addy.first_name,
      last_name: ship_addy.last_name,
      company: ship_addy.company,
      street_address_1: ship_addy.street_address_1,
      street_address_2: ship_addy.street_address_2,
      city: ship_addy.city,
      state: ship_addy.state,
      zip_code: ship_addy.zip_code,
      phone_number: ship_addy.phone_number,
      bill_or_ship: 'shipping',
      _user_id: cart_instance._user_id
    }
    const billing_address = {
      first_name: bill_addy.first_name,
      last_name: bill_addy.last_name,
      company: bill_addy.company,
      street_address_1: bill_addy.street_address_1,
      street_address_2: bill_addy.street_address_2,
      city: bill_addy.city,
      state: bill_addy.state,
      zip_code: bill_addy.zip_code,
      phone_number: bill_addy.phone_number,
      bill_or_ship: 'billing',
      _user_id: cart_instance._user_id
    }
    cart_instance.shipping_address = shipping_address
    cart_instance.billing_address = billing_address

    await this.props.updateCart(cart_instance)
  }


  render() {
    // Fill out fields if they already exist (if they navigate away from the site. If not redux will keep the values filled out)
    let billing_initial_values = {}
    let shipping_initial_values = {}
    if (this.props.cart.billing_address) {
      formFields.forEach((field) => {
        billing_initial_values[field.name] = this.props.cart.billing_address[field.name]
      })
    }
    if (this.props.cart.shipping_address) {
      formFields.forEach((field) => {
        shipping_initial_values[field.name] = this.props.cart.shipping_address[field.name]
      })
    }
    
    const replacementSubmitButton = (
      <button onClick={(e) => this.handleSubmit(e)} className="teal btn-flat right white-text">
        <i className="material-icons right">Next</i>
      </button>
    )
    return (
      <div>
          <div className="address_form_container">
            <div className="billing_address_form_container address_form">
              <h5 className="address_form_title">Billing</h5>
              <Form 
                onSubmit={this.handleSubmit} 
                submitButtonText={"Next"}
                formFields={formFields} 
                replaceSubmitButton={true}
                submitButton={""}
                formId={"billing_form"}
                form={"billing_checkout_form"}
                initialValues={billing_initial_values}
              />
            </div>
            <div className="shipping_address_form_container address_form">
              <h5 className="address_form_title">Shipping</h5>
              <Form 
                onSubmit={this.handleSubmit} 
                formFields={formFields}
                formId={"shipping_form"}
                form={"shipping_checkout_form"}
                replaceSubmitButton={true}
                submitButton={replacementSubmitButton}
                initialValues={shipping_initial_values}
              />
            </div>
          </div>
      </div>
    )
  }
}

export default AddressPanel