import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from "lodash"
import Form from '../../../../../shared/Form/Form'
import { shippingAddressFormFields, billingAddressFormFields, validate } from '../formFields'
import { updatedAddressFormFields } from "../../../../../../utils/helpFunctions"
import AddressCard from '../../../../components/AddressCard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"
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
      shipping_form_submit: false,
      shipping_same_as_billing: false
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
      // this.props.setPreExistingAddress({ bill_or_ship: "shipping" })
    } else  {
      const bill_addy = this.props.form.billing_checkout_form.values
      cart_instance.billing_address = buildAddress(bill_addy, cart_instance._user_id, "billing")
      this.setState({ billing_form_submit: true })
      // this.props.setPreExistingAddress({ bill_or_ship: "billing" })
    }
    this.props.updateCart(cart_instance)
  }

  billing_initial_values() {
    let billing_initial_values = this.props.form.billing_checkout_form ? this.props.form.billing_checkout_form.values : {} 
    if (this.props.cart.billing_address) {
      billing_initial_values = updatedAddressFormFields(billingAddressFormFields, this.props.cart.billing_address)
    }
    return billing_initial_values
  }

  shipping_initial_values() {
    let shipping_initial_values = this.props.form.shipping_checkout_form ? this.props.form.shipping_checkout_form.values : {}
    if (this.props.cart.shipping_address) {
      shipping_initial_values = updatedAddressFormFields(shippingAddressFormFields, this.props.cart.shipping_address)
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
    this.props.setPreExistingAddress(address)
    this.props.updateCart(cart_instance)
  }

  editSubmittedForm(bill_or_ship) {
    if(bill_or_ship === "bill") {
      this.setState({ billing_form_submit: false, billing_card_chosen: false })
      this.props.setPreExistingAddress({ bill_or_ship: "billing" })
    } else {
      this.setState({ shipping_form_submit: false, shipping_card_chosen: false })
      this.props.setPreExistingAddress({ bill_or_ship: "shipping" })
    }
  }

  nextTab() {
    let cart_instance = this.props.cart
    cart_instance.checkout_state = "shipping"
    if (this.state.shipping_same_as_billing) {
      cart_instance.shipping_address = cart_instance.billing_address
    }
    this.props.updateCart(cart_instance)
  }

  renderAddressCards() {
    if (this.props.auth._id !== "000000000000000000000000") {
      return (
        <>
          {this.props.auth.billing_address.length > 0 && <AddressCard actionBox={ this.choosePreExistingAddress } bill_or_ship="billing_address" hideCreate={true} />}
          {this.props.auth.shipping_address.length > 0 && <AddressCard actionBox={ this.choosePreExistingAddress } bill_or_ship="shipping_address" hideCreate={true} />}
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
    if (this.state.shipping_form_submit === true || this.state.shipping_card_chosen || this.state.shipping_same_as_billing === true) {
      ship_complete = true
    }

    let hide_combination_option = false
    if (this.props.cart && this.props.cart.billing_address) {
      if (this.props.cart.shipping_address) {
        hide_combination_option = true
      }
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

            {!hide_combination_option &&
              <div className={`flex align-items-center border-radius-s padding-m justify-center theme-background-3`} style={this.props.mobile === true ? { margin: "20px auto", width: "80%" } : { margin: "20px 0px", width: "250px" }}>
                <h4>Shipping address the <br /> same as Billing?</h4>
                {this.state.shipping_same_as_billing ? 
                  <FontAwesomeIcon onClick={() => this.setState({ shipping_same_as_billing: !this.state.shipping_same_as_billing })} icon={faCheck} className="margin-s-h" style={{ fontSize: "30px" }} />
                :
                  <FontAwesomeIcon onClick={() => this.setState({ shipping_same_as_billing: !this.state.shipping_same_as_billing })} icon={faTimes} className="margin-s-h" style={{ fontSize: "30px" }} />}
              </div>
            }

            <div className="address_form_container">
              <div className="billing_address_form_container address_form">
                { this.state.billing_card_chosen === true || this.state.billing_form_submit === true ? 
                    <div className="hover text-align-center padding-m" onClick={() => this.editSubmittedForm("bill")}>
                      <h2>Edit Billing</h2>
                      <FontAwesomeIcon style={{ fontSize: "40px" }} icon={faEdit} />
                    </div>
                  :
                    <>
                      <h5 className="address_form_title">Billing</h5>
                      <Form 
                        onSubmit={() => this.handleFormSubmit("billing")} 
                        submitButtonText={"Submit"}
                        formFields={billingAddressFormFields} 
                        form={"billing_checkout_form"}
                        initialValues={this.billing_initial_values()}
                        validation={validate}
                      />
                    </>
                }
              </div> 
      
      
              {!this.state.shipping_same_as_billing && 
                <div className="shipping_address_form_container address_form">
                  {this.state.shipping_card_chosen === true || this.state.shipping_form_submit === true ? 
                      <>
                          <div className="hover text-align-center padding-m" onClick={() => this.editSubmittedForm("ship")}>
                          <h2>Edit Shipping</h2>
                          <FontAwesomeIcon style={{ fontSize: "40px" }} icon={faEdit} />
                        </div>
                      </>
                    :
                      <>
                        <h5 className="address_form_title">Shipping</h5>
                        <Form 
                          onSubmit={() => this.handleFormSubmit("shipping")}
                          submitButtonText={"Submit"}
                          formFields={shippingAddressFormFields}
                          form={"shipping_checkout_form"}
                          initialValues={this.shipping_initial_values()}
                          validation={validate}
                        />
                      </>
                  }
                </div>
              }
            </div>

            { bill_complete && ship_complete && 
              <div className="w-90 margin-auto-h text-align-center" style={{ marginTop: "20px" }}>
                <button style={this.props.mobile ? { fontSize: "20px", width: "100%" } : { width: "400px", fontSize: "30px" }} className={`bold margin-m-v`} onClick={this.nextTab} >Continue</button>
              </div>
            }

          </>
        : ""}
      </div>
    )
  }
}

function mapStateToProps({ form, cart, auth, mobile }) {
  return { form, cart, auth, mobile }
}

export default connect(mapStateToProps, null)(AddressPanel)


const buildAddress = (addy, user_id, bill_or_ship) => {
  console.log(addy)
  let address

  if (bill_or_ship === "shipping") {
    address = {
      first_name: addy.first_name_shipping,
      last_name: addy.last_name_shipping,
      company: addy.company_shipping,
      street_address_1: addy.street_address_1_shipping,
      street_address_2: addy.street_address_2_shipping,
      city: addy.city_shipping,
      state: addy.state_shipping,
      zip_code: addy.zip_code_shipping,
      phone_number: addy.phone_number_shipping,
      bill_or_ship: bill_or_ship,
      _user_id: user_id,
      country: addy.country_shipping
    }
  } else {
    address = {
      first_name: addy.first_name_billing,
      last_name: addy.last_name_billing,
      company: addy.company_billing,
      street_address_1: addy.street_address_1_billing,
      street_address_2: addy.street_address_2_billing,
      city: addy.city_billing,
      state: addy.state_billing,
      zip_code: addy.zip_code_billing,
      phone_number: addy.phone_number_billing,
      bill_or_ship: bill_or_ship,
      _user_id: user_id,
      country: addy.country_billing
    }
  }


  return address
}