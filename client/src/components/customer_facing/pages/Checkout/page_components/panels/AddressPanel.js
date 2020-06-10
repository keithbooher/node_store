import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from "lodash"
import Form from '../../../../../shared/Form/Form'
import { addressFormFields } from '../formFields'
import { updatedFormFields } from "../../../../../../utils/helperFunctions"
import AddressCard from '../../../../components/AddressCard';


class AddressPanel extends Component  {
  constructor(props) {
    super()
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.choosePreExistingAddress = this.choosePreExistingAddress.bind(this)
    this.state = {
      billing_card_chosen: false,
      shipping_card_chosen: false,
    }
  }

  async componentDidMount() {    
  }
  

  handleFormSubmit(e) {
    e.preventDefault()
    // NEED TO PREVENT SUBMISSION IF NEITHER A PRE-EXISTING ADDY CARD 
    // HAS BEEN SELECTED OR THE FORM HAS BEEN FILLED OUT
    let cart_instance = this.props.cart
    cart_instance.checkout_state = 'shipping'
    let shipping_address = {}
    let billing_address = {}


    if (this.props.preExistingShipping === null) {
      const ship_addy = this.props.form.shipping_checkout_form.values
      shipping_address = {
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
    } else {
      shipping_address = this.props.preExistingShipping
    }

    if (this.props.preExistingBilling === null) {
      const bill_addy = this.props.form.billing_checkout_form.values
      billing_address = {
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
    } else {
      billing_address = this.props.preExistingBilling
    }

    cart_instance.shipping_address = shipping_address
    cart_instance.billing_address = billing_address

    this.props.updateCart(cart_instance)
  }

  billing_initial_values() {
    let billing_initial_values = this.props.form.billing_checkout_form ? this.props.form.billing_checkout_form.values : {} 
    if (this.props.cart.billing_address) {
      billing_initial_values = updatedFormFields(addressFormFields, this.props.cart.billing_address)
    }
    return billing_initial_values
  }

  shipping_initial_values() {
    let shipping_initial_values = this.props.form.shipping_checkout_form ? this.props.form.shipping_checkout_form.values : {}
    if (this.props.cart.shipping_address) {
      shipping_initial_values = updatedFormFields(addressFormFields, this.props.cart.shipping_address)
    }
    return shipping_initial_values
  }

  formOnChange(bill_or_ship) { 
    this.props.choosePreExistingAddress({ bill_or_ship })
  }

  choosePreExistingAddress(address) {
    if (address.bill_or_ship === "billing") {
      this.setState({ billing_card_chosen: !this.state.billing_card_chosen })
    } else {
      this.setState({ shipping_card_chosen: !this.state.shipping_card_chosen })
    }
    this.props.choosePreExistingAddress(address)
  }

  renderAddressCards() {
    if (this.props.auth._id !== "000000000000000000000000") {
      return (
        <>
          <AddressCard actionBox={ this.choosePreExistingAddress } bill_or_ship="billing_address" />    
          <AddressCard actionBox={ this.choosePreExistingAddress } bill_or_ship="shipping_address" />    
        </>
      )
    }
  }

  renderNewAddressForm() {
    return (
      <div className="address_form_container">
      
        { this.state.billing_card_chosen === true ? "" :
          <div className="billing_address_form_container address_form">
            <h5 className="address_form_title">Billing</h5>
            <Form 
              onSubmit={this.handleFormSubmit} 
              onChange={() => this.formOnChange('billing null')}
              formFields={addressFormFields} 
              form={"billing_checkout_form"}
              initialValues={this.billing_initial_values()}
              submitButton={<></>}
            />
          </div> }

        { this.state.shipping_card_chosen === true ? "" :
          <div className="shipping_address_form_container address_form">
            <h5 className="address_form_title">Shipping</h5>
            <Form 
              onSubmit={this.handleFormSubmit} 
              onChange={() => this.formOnChange('shipping null')}
              formFields={addressFormFields}
              form={"shipping_checkout_form"}
              initialValues={this.shipping_initial_values()}
              submitButton={<></>}
            />
          </div>}
      </div>
    )
  }

  render() {
    const replacementSubmitButton = (
      <button onClick={(e) => this.handleFormSubmit(e)} className="teal btn-flat right white-text">
        <i className="material-icons right">Next</i>
      </button>
    )
    return (
      <div>
        { this.props.cart ?
          <>

            { this.renderAddressCards() }

            { this.renderNewAddressForm() }

            { replacementSubmitButton }

          </>
        : ""}
      </div>
    )
  }
}

function mapStateToProps({ form, cart, auth }) {
  return { form, cart, auth }
}

export default connect(mapStateToProps, null)(AddressPanel)