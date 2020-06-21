import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from "lodash"
import Form from '../../../../../shared/Form/Form'
import { addressFormFields, validate } from '../formFields'
import { updatedFormFields } from "../../../../../../utils/helperFunctions"
import AddressCard from '../../../../components/AddressCard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"


class AddressPanel extends Component  {
  constructor(props) {
    super()
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.nextTab = this.nextTab.bind(this)
    this.editSubmittedForm = this.editSubmittedForm.bind(this)
    this.choosePreExistingAddress = this.choosePreExistingAddress.bind(this)
    this.state = {
      billing_card_chosen: false,
      shipping_card_chosen: false,
      billing_form_submit: false,
      shipping_form_submit: false
    }
  }

  async componentDidMount() {    
  }
  

  handleFormSubmit(bill_or_ship) {
    let cart_instance = this.props.cart
    cart_instance.checkout_state = 'address'
    let shipping_address = {}
    let billing_address = {}

    if (bill_or_ship === "shipping") {
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

      cart_instance.shipping_address = shipping_address
      this.setState({ shipping_form_submit: true })
    } else  {
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

      cart_instance.billing_address = billing_address
      this.setState({ billing_form_submit: true })
    }
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
    let cart_instance = this.props.cart
    cart_instance.checkout_state = 'address'

    if (address.bill_or_ship === "billing") {
      cart_instance.billing_address = address
      this.setState({ billing_card_chosen: !this.state.billing_card_chosen })
    } else {
      cart_instance.shipping_address = address
      this.setState({ shipping_card_chosen: !this.state.shipping_card_chosen })
    }
    this.props.choosePreExistingAddress(address)
    this.props.updateCart(cart_instance)
  }

  renderAddressCards() {
    if (this.props.auth._id !== "000000000000000000000000") {
      return (
        <>
          <AddressCard actionBox={ this.choosePreExistingAddress } bill_or_ship="billing_address" hideCreate={true} />    
          <AddressCard actionBox={ this.choosePreExistingAddress } bill_or_ship="shipping_address" hideCreate={true} />    
        </>
      )
    }
  }

  editSubmittedForm(bill_or_ship) {
    if(bill_or_ship === "bill") {
      this.setState({ billing_form_submit: false, billing_card_chosen: false })
    } else {
      this.setState({ shipping_form_submit: false, shipping_card_chosen: false })
    }
  }

  renderNewAddressForm() {
    return (
      <div className="address_form_container">
        <div className="billing_address_form_container address_form">
          { this.state.billing_card_chosen === true || this.state.billing_form_submit === true ? 
              <div style={{ marginTop: "50px" }} className="hover" onClick={() => this.editSubmittedForm("bill")}>
                Edit Billing Form
                <FontAwesomeIcon icon={faEdit} />
              </div>
            :
              <>
                <h5 className="address_form_title">Billing</h5>
                <Form 
                  onSubmit={() => this.handleFormSubmit("billing")} 
                  submitButtonText={"Submit"}
                  onChange={() => this.formOnChange('billing null')}
                  formFields={addressFormFields} 
                  form={"billing_checkout_form"}
                  initialValues={this.billing_initial_values()}
                  validation={validate}
                />
              </>
          }
        </div> 


        <div className="shipping_address_form_container address_form">
          { this.state.shipping_card_chosen === true || this.state.shipping_form_submit === true ? 
              <div style={{ marginTop: "50px" }} className="hover" onClick={() => this.editSubmittedForm("ship")}>
                Edit Shipping Form  
                <FontAwesomeIcon icon={faEdit} />
              </div>
            :
              <>
                <h5 className="address_form_title">Shipping</h5>
                <Form 
                  onSubmit={() => this.handleFormSubmit("shipping")}
                  submitButtonText={"Submit"}
                  onChange={() => this.formOnChange('shipping null')}
                  formFields={addressFormFields}
                  form={"shipping_checkout_form"}
                  initialValues={this.shipping_initial_values()}
                  validation={validate}
                />
              </>
          }
        </div>

      </div>
    )
  }

  nextTab() {
    let cart_instance = this.props.cart
    cart_instance.checkout_state = "shipping"
    this.props.updateCart(cart_instance)
  }

  render() {
    const replacementSubmitButton = (
      <button onClick={this.nextTab} className="teal btn-flat right white-text">
        <i className="material-icons right">Next</i>
      </button>
    )

    let bill_complete = false
    let ship_complete = false
    if (this.state.billing_form_submit === true || this.state.billing_card_chosen) {
      bill_complete = true
    }
    if (this.state.shipping_form_submit === true || this.state.shipping_card_chosen) {
      ship_complete = true
    }

    return (
      <div>
        { this.props.cart ?
          <>

            { this.renderAddressCards() }

            { this.renderNewAddressForm() }

            { bill_complete && ship_complete && replacementSubmitButton }

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