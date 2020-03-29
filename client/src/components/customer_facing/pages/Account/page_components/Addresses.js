import React, { Component } from 'react'
import Form from '../../../../shared/Form'
import { addressFields } from './formFields'
import AddressCard from '../../../components/AddressCard'

class Addresses extends Component {
  constructor(props) {
    super()
    this.state = {}
  }

  async handleSubmit() {
    // some request to update the users general info
  }

  render() {
    const replacementSubmitButton = (
      <button onClick={(e) => this.handleSubmit(e)} className="teal btn-flat right white-text">
        <i className="material-icons right">Submit</i>
      </button>
    )
    return (
    <div>
      <div>
        <AddressCard bill_or_ship="billing_address" />    
        <AddressCard bill_or_ship="shipping_address" />    
      </div>
      <div className="new_user_address_forms_container">
        <div className="user_billing_form">
          <h4>New Billing Address</h4>
          <Form 
            onSubmit={this.handleSubmit} 
            submitButtonText={"Next"}
            formFields={addressFields} 
            replaceSubmitButton={true}
            submitButton={replacementSubmitButton}
            formId={"user_billing_form"}
            form={"user_billing_form"}
            initialValues={{}}
          />
        </div>
        <div className="user_shipping_form">
          <h4>New Shipping Address</h4>
          <Form 
            onSubmit={this.handleSubmit} 
            submitButtonText={"Next"}
            formFields={addressFields} 
            replaceSubmitButton={true}
            submitButton={replacementSubmitButton}
            formId={"user_shipping_form"}
            form={"user_shipping_form"}
            initialValues={{}}
          />
        </div>
      </div>
    </div>
    )
  }
}


export default Addresses