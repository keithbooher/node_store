import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from "lodash"
import Form from '../../../../../shared/Form/Form'
import formFields from '../formFields'
import hf from "../../../../../../utils/helperFunctions"
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
    console.log(this.props.auth)
  }
  

  handleFormSubmit(e) {
    e.preventDefault()
    console.log("formSubmit")
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
    this.props.chooseTab('shipping')
  }

  billing_initial_values() {
    let billing_initial_values = this.props.form.billing_checkout_form ? this.props.form.billing_checkout_form.values : {} 
    if (this.props.cart.billing_address) {
      billing_initial_values = hf.updatedFormFields(formFields, this.props.cart.billing_address)
    }
    return billing_initial_values
  }

  shipping_initial_values() {
    let shipping_initial_values = this.props.form.shipping_checkout_form ? this.props.form.shipping_checkout_form.values : {}
    if (this.props.cart.shipping_address) {
      shipping_initial_values = hf.updatedFormFields(formFields, this.props.cart.shipping_address)
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
    return (
      <>
        <AddressCard actionBox={ this.choosePreExistingAddress } bill_or_ship="billing_address" />    
        <AddressCard actionBox={ this.choosePreExistingAddress } bill_or_ship="shipping_address" />    
      </>
    )
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
              submitButtonText={"Next"}
              formFields={formFields} 
              replaceSubmitButton={true}
              submitButton={""}
              formId={"billing_form"}
              form={"billing_checkout_form"}
              initialValues={this.billing_initial_values()}
            />
          </div> }

        { this.state.shipping_card_chosen === true ? "" :
          <div className="shipping_address_form_container address_form">
            <h5 className="address_form_title">Shipping</h5>
            <Form 
              onSubmit={this.handleFormSubmit} 
              onChange={() => this.formOnChange('shipping null')}
              formFields={formFields}
              formId={"shipping_form"}
              form={"shipping_checkout_form"}
              replaceSubmitButton={true}
              submitButton={""}
              initialValues={this.shipping_initial_values()}
            />
          </div>}
      </div>
    )
  }

  checkForPastAddys() {
    if (this.props.auth !== null) {
      if (this.props.auth.billing_address.length > 0 || this.props.auth.shipping_address.length > 0) {
        return true
      }
    } else {
      return false
    }
  }

  render() {
    // console.log(this.props)
    const replacementSubmitButton = (
      <button onClick={(e) => this.handleFormSubmit(e)} className="teal btn-flat right white-text">
        <i className="material-icons right">Next</i>
      </button>
    )
    return (
      <div>
        { this.props.cart ?
          <>

            {/* LETS CHECK IF THEY HAVE ANY PAST ADDRESSES TO USE  */}
            {/* IF NOT, THEN DISPLAY THE FORM FIRST, OTHERWISE DISPLAY PAST ADDRESS CARDS */}
            {/* WE'LL PUT BACK IN THE LEGIT SUBMIT BUTTON FOR THE FORM AND USE THE CUSTOM NEXT 
                BUTTON FOR THE ADDRESS CARDS, THIS WAY WE GET UTILIZE THE REDUX FORM VAILDATION 
                WHEN WE DO A TRUE FORM SUBMISSION */}
            {/* {this.checkForPastAddys() ? : } */}

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