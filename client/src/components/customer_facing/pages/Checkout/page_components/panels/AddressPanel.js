import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from "lodash"
import Form from '../../../../../shared/Form/Form'
import { addressFormFields, validate } from '../formFields'
import { updatedFormFields } from "../../../../../../utils/helperFunctions"
import AddressCard from '../../../../components/AddressCard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { validatePresenceOnAll } from "../../../../../../utils/validations"


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

  handleFormSubmit(bill_or_ship) {
    let cart_instance = this.props.cart
    cart_instance.checkout_state = 'address'

    if (this.props.cart._user_id === "000000000000000000000000") {
      const guest_email = this.props.form.guest_email_checkout_form.values.email
      cart_instance.email = guest_email
    }

    if (bill_or_ship === "shipping") {
      const ship_addy = this.props.form.shipping_checkout_form.values
      cart_instance.shipping_address = buildAddress(ship_addy, cart_instance._user_id, "shipping")
      this.setState({ shipping_form_submit: true })
    } else  {
      const bill_addy = this.props.form.billing_checkout_form.values
      cart_instance.billing_address = buildAddress(bill_addy, cart_instance._user_id, "billing")
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
    this.props.updateCart(cart_instance)
  }

  editSubmittedForm(bill_or_ship) {
    if(bill_or_ship === "bill") {
      this.setState({ billing_form_submit: false, billing_card_chosen: false })
    } else {
      this.setState({ shipping_form_submit: false, shipping_card_chosen: false })
    }
  }

  nextTab() {
    let cart_instance = this.props.cart
    cart_instance.checkout_state = "shipping"
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

  render() {
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

            {this.props.cart._user_id === "000000000000000000000000" &&
              <div>
                <Form 
                  submitButton={<div></div>}
                  formFields={[
                    { label: 'Guest Email', name: 'email', noValueError: 'You must provide an address', value: null },
                  ]} 
                  form={"guest_email_checkout_form"}
                  validation={validatePresenceOnAll}
                />
              </div>
            }

            <div className="address_form_container">
              <div className="billing_address_form_container address_form">
                { this.state.billing_card_chosen === true || this.state.billing_form_submit === true ? 
                    <div className="hover text-align-center padding-m" onClick={() => this.editSubmittedForm("bill")}>
                      <h2>Edit Billing</h2>
                      <FontAwesomeIcon style={{ fontSize: "60px" }} icon={faEdit} />
                    </div>
                  :
                    <>
                      <h5 className="address_form_title">Billing</h5>
                      <Form 
                        onSubmit={() => this.handleFormSubmit("billing")} 
                        submitButtonText={"Submit"}
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
                    <div className="hover text-align-center padding-m" onClick={() => this.editSubmittedForm("ship")}>
                      <h2>Edit Shipping</h2>
                      <FontAwesomeIcon style={{ fontSize: "60px" }} icon={faEdit} />
                    </div>
                  :
                    <>
                      <h5 className="address_form_title">Shipping</h5>
                      <Form 
                        onSubmit={() => this.handleFormSubmit("shipping")}
                        submitButtonText={"Submit"}
                        formFields={addressFormFields}
                        form={"shipping_checkout_form"}
                        initialValues={this.shipping_initial_values()}
                        validation={validate}
                      />
                    </>
                }
              </div>
            </div>

            { bill_complete && ship_complete && 
              <button onClick={this.nextTab} className="teal btn-flat right white-text">
                <i className="material-icons right">Next</i>
              </button>
            }

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