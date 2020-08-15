import React, { Component } from 'react'
import { getUserByEmail } from "../../../../utils/API"
import { dispatchObj } from "../../../../actions"
import Form from "../../../shared/Form"
import { connect } from 'react-redux'
import { reset } from "redux-form"
import AddressCard from '../../../customer_facing/components/AddressCard'
import { addressFormFields, validate } from './formFields'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

class ChooseCustomer extends Component {
  constructor(props) {
    super()
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.chooseAddress = this.chooseAddress.bind(this)
    this.proceedToNextStep = this.proceedToNextStep.bind(this)
    this.state = {
      customer_type: null,
      chosen_customer: null,
      billing_address: null,
      shipping_address: null,
      guest_email: null
    }
  }

  async handleSearchSubmit() {
    const search_for_customer = this.props.form['customer_search_form'].values
    let { data } = await getUserByEmail(search_for_customer.email)
    console.log(search_for_customer)
    console.log(data)
    if (data === "") return
    this.setState({ chosen_customer: data })
  }

  chooseAddress(address) {
    if (address.bill_or_ship === "billing") {
      this.setState({ billing_address: address })
    } else {
      this.setState({ shipping_address: address })
    }
  }


  proceedToNextStep() {
    let customer
    let email
    if (this.state.chosen_customer) {
      customer = this.state.chosen_customer
      email = this.state.chosen_customer.email
    } else {
      email = this.props.form.guest_email_admin_checkout_form.values.email
      customer = {
        _id: "000000000000000000000000",
        email: email
      }
    }

    let cart = {
      billing_address: this.props.form.billing_admin_checkout_form.values,
      shipping_address: this.props.form.shipping_admin_checkout_form.values,
      _user_id: customer._id,
      email,
      line_items: []
    }

    const state = {
      cart,
      step: "cart",
      customer: customer
    }

    this.props.topStateSetter(state)
    this.props.dispatchObj(reset("billing_admin_checkout_form"))
    this.props.dispatchObj(reset("shipping_admin_checkout_form"))
    this.props.dispatchObj(reset("guest_email_admin_checkout_form"))

    this.props.refProp.current.scrollTo(0, 0);

  }

  billing_initial_values() {
    let billing_initial_values = this.state.billing_address ? this.state.billing_address : {} 
    return billing_initial_values
  }

  shipping_initial_values() {
    let shipping_initial_values = this.state.shipping_address ? this.state.shipping_address : {}
    return shipping_initial_values
  }

  render() {
    let show_address_form = false
    if (this.state.customer_type === "guest" || this.state.chosen_customer !== null ) {
      show_address_form = true
    }
    return (
      <>
        {this.state.customer_type === null && 
          <div className="h-100">
            <div  
              onClick={() => this.setState({ customer_type: "guest" })}
              className="h-40 flex flex_column justify-center"
            >
              <h1 className="text-align-center">Guest</h1>
            </div>
            <div 
              onClick={() => this.setState({ customer_type: "customer" })}
              className="h-40 flex flex_column justify-center"
            >
              <h1 className="text-align-center">Customer</h1>
            </div>
          </div>
        }

        {this.state.customer_type !== null && 
          <div className="flex flex_column" style={{ marginTop: "30px" }}>
            <div 
              style={ this.state.customer_type === "guest" ? { color: "blue" } : {}} 
              onClick={() => this.setState({ customer_type: "guest" })}
            >
              Guest
            </div>
            <div 
              style={ this.state.customer_type === "customer" ? { color: "blue" } : {}} 
              onClick={() => this.setState({ customer_type: "customer" })}
            >
              Customer
            </div>
          </div>
        }



        {this.state.customer_type === "customer" &&
          <div className="margin-m-v">
            <div>Choose Customer</div>
            <Form 
              onSubmit={this.handleSearchSubmit}
              submitButtonText={<FontAwesomeIcon icon={faSearch} />}
              searchButton={true}
              formFields={[
                { label: 'Search For User By Email', name: 'email', noValueError: 'You must provide an email' },
              ]}
              form='customer_search_form'
            />
          </div>
        }

        {show_address_form &&
          <div className="margin-m-v">
            {this.state.customer_type === "customer" &&
              <div>
                <AddressCard fedUser={this.state.chosen_customer} actionBox={ this.chooseAddress } bill_or_ship="billing_address" hideCreate={true} />    
                <AddressCard fedUser={this.state.chosen_customer} actionBox={ this.chooseAddress } bill_or_ship="shipping_address" hideCreate={true} />    
              </div>
            }

            {this.state.customer_type === "guest" &&
              <div>
                <Form 
                  submitButton={<div></div>}
                  submitButtonText={"Submit"}
                  formFields={[
                    { label: 'Guest Email', name: 'email', noValueError: 'You must provide an address', value: null },
                  ]} 
                  form={"guest_email_admin_checkout_form"}
                  initialValues={this.billing_initial_values()}
                  validation={validate}
                />
              </div>
            }

            <h5 className="address_form_title">Billing</h5>
            <Form 
              submitButton={<div></div>}
              submitButtonText={"Submit"}
              formFields={addressFormFields} 
              form={"billing_admin_checkout_form"}
              initialValues={this.billing_initial_values()}
              validation={validate}
            />

            <h5 className="address_form_title">Shipping</h5>
            <Form 
              submitButton={<div></div>}
              submitButtonText={"Submit"}
              formFields={addressFormFields}
              form={"shipping_admin_checkout_form"}
              initialValues={this.shipping_initial_values()}
              validation={validate}
            />

            <button onClick={this.proceedToNextStep}>Proceed to product selection</button>
          </div>

        }
      </>
    )
  }
}


function mapStateToProps({ form }) {
  return { form }
}

const actions = { dispatchObj }

export default connect(mapStateToProps, actions)(ChooseCustomer)
