import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from '../../../../../shared/Form'
import { addressFields } from '../formFields'
import { updateUser } from '../../../../../../actions'
import {reset} from 'redux-form'
import { capitalizeFirsts } from "../../../../../../utils/helperFunctions"

class NewBillAddress extends Component {
  constructor(props) {
    super()
    this.state = {}
  }

  async handleSubmit(e, bill_or_ship) {
    // some request to update the users general info
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
    this.props.showForm(null)
    window.scrollTo(0, 0);
  }

  render() {
    const replacementSubmitButton = (bill_or_ship) => {
      return (<button onClick={(e) => this.handleSubmit(e, bill_or_ship)} className="teal btn-flat right white-text">
        <i className="material-icons right">Submit</i>
      </button>)
    }
    return (
      <div className="new_user_address_forms_container">
        <div className="user_billing_form">
          <h4>New {capitalizeFirsts(this.props.bill_or_ship)} Address</h4>
          <Form 
            onSubmit={this.handleSubmit} 
            submitButtonText={"Next"}
            formFields={addressFields} 
            submitButton={replacementSubmitButton(this.props.bill_or_ship)}
            form={`user_${this.props.bill_or_ship}_form`}
            cancel={() => this.props.showForm(null)}
          />
        </div>
      </div>
    )
  }
}



function mapStateToProps({ form, auth }) {
  return { form, auth }
}

const actions = { updateUser, reset }

export default connect(mapStateToProps, actions)(NewBillAddress)