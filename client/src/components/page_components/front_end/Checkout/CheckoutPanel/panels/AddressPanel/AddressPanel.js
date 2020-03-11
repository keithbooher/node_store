import React, { Component } from 'react'
import _ from "lodash"
import Form from '../../../../../shared/Form/Form'
import shippingFormFields from './shippingFormFields'
import billingFormFields from './billingFormFields'

class AddressPanel extends Component  {
  constructor(props) {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    console.log(props)
    this.state = {

    }
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log(this.props)
    // let cart_instance = this.props.cart
    // cart_instance.checkout_state = 'payment'
    // console.log(cart_instance)
    // this.props.updateCheckoutState(cart_instance)
    // this.props.chooseTab('payment')
  }


  render() {
    console.log(this.props)
    const replacementSubmitButton = (
      <button onClick={(e) => this.handleSubmit(e)} className="teal btn-flat right white-text">
        <i className="material-icons right">Next</i>
      </button>
    )
    return (
      <div id="">
        <div className="address_form_container">
          <div className="billing_address_form_container address_form">
            <h5 className="address_form_title">Billing Address</h5>
            <Form 
              onSubmit={this.handleSubmit} 
              submitButtonText={"Next"}
              formFields={billingFormFields} 
              replaceSubmitButton={true}
              submitButton={""}
              formId={"billing_form"}
              form={"checkout_form"}
            />
          </div>
          <div className="shipping_address_form_container address_form">
            <h5 className="address_form_title">Shipping Address</h5>
            <Form 
              onSubmit={this.handleSubmit} 
              formFields={shippingFormFields}
              formId={"shipping_form"}
              form={"checkout_form"}
              replaceSubmitButton={true}
              submitButton={replacementSubmitButton}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default AddressPanel