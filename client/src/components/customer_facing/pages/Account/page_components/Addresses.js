import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from '../../../../shared/Form'
import { addressFields } from './formFields'
import AddressCard from '../../../components/AddressCard'
import { updateUser } from '../../../../../actions'
import {reset} from 'redux-form'

class Addresses extends Component {
  constructor(props) {
    super()
    this.state = {}
  }

  async handleSubmit(e, bill_or_ship) {
    // some request to update the users general info
    console.log(bill_or_ship)
    console.log(this.props)
    e.preventDefault()
    
    let addy
    let user = this.props.auth
    if (bill_or_ship === "shipping") {
      addy = this.props.form.user_shipping_form.values
    } else {
      addy = this.props.form.user_billing_form.values
    }
    let new_address = {
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
      _user_id: this.props.auth._id
    }
    if (bill_or_ship === "shipping") {
      user.shipping_address.push(new_address)
      this.props.reset('user_shipping_form')
    } else {
      user.billing_address.push(new_address)
      this.props.reset('user_billing_form')

    }
    this.props.updateUser(user)
    window.scrollTo(0, 0);
  }

  render() {
    console.log(this.props)
    const replacementSubmitButton = (bill_or_ship) => {
      return (<button onClick={(e) => this.handleSubmit(e, bill_or_ship)} className="teal btn-flat right white-text">
        <i className="material-icons right">Submit</i>
      </button>)
    }
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
            submitButton={replacementSubmitButton("billing")}
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
            submitButton={replacementSubmitButton("shipping")}
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



function mapStateToProps({ form, auth }) {
  return { form, auth }
}

const actions = { updateUser, reset }

export default connect(mapStateToProps, actions)(Addresses)