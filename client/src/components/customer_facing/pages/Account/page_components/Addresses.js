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

  renderAddressCards(bill_or_ship) {
    const auth = this.props.auth
    return auth[bill_or_ship].map((address) => {
      return <div className="address_card_container">
              <div>first name: {address.first_name ? address.first_name : "" }</div>
              <div>last name: {address.last_name ? address.first_name : "" }</div>
              <div>company: {address.company ? address.company : "" }</div>
              <div>street address 1: {address.street_address_1 ? address.street_address_1 : "" }</div>
              <div>street address 2: {address.street_address_2 ? address.street_address_2 : "" }</div>
              <div>city: {address.city ? address.city : "" }</div>
              <div>state: {address.state ? address.state : "" }</div>
              <div>zip code: {address.zip_code ? address.zip_code : "" }</div>
              <div>phone number: {address.phone_number ? address.phone_number : "" }</div>
            </div>
    })
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