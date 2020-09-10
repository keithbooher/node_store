import React, { Component } from 'react'
import { connect } from 'react-redux'
import { convertCart } from '../../../../../../actions'
import _ from "lodash"
import Form from '../../../../../shared/Form';
import { getShippingMethodForCheckout } from "../../../../../../utils/API"
import { calculateSubtotal } from "../../../../../../utils/helpFunctions"

// ONLY MAKING CONSIDERATIONS FOR FLAT RATE SHIPPING FOR NOW
class AddressPanel extends Component  {
  constructor(props) {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      shipping_method: [],
      rateFields: []
    }
  }

  async componentDidMount() {    
    // api call to assign "shipping" checkout status to cart 
    const { data } = await this.props.getShippingMethodForCheckout()

    const rates = data.shipping_rates.filter((rate) => rate.display === true)
    const fields = rates.map((rate) => {
      return {
        name: rate.name,
        value: rate.effector,
        carrier: rate.carrier,
        default: true,
        redux_field: "shipping_rates"
      }
    })

    const formRates = [{ 
      label: 'Shipping method', 
      name: 'shipping_rates', 
      typeOfComponent: 'dropdown', 
      options: fields, 
      noValueError: 'You must provide an address', 
      value: null 
    }]

    this.setState({ shipping_method: data, rateFields: formRates  })
  }
  
  async handleSubmit() {
    const selected_shipping_method = this.props.form[`shipping_method_selection_form`].values
    const cost = selected_shipping_method.shipping_rates.value
    const shipping_method = "Flat Rate"
    const rate = selected_shipping_method.shipping_rates.name
    const carrier = selected_shipping_method.shipping_rates.carrier

    let cart = {...this.props.cart}

    let chosen_rate = {
        cost,
        shipping_method,
        rate,
        carrier
    }

    cart.chosen_rate = chosen_rate

    let sub_total = Number(calculateSubtotal(cart))
    let tax = Number(sub_total * .08)
    let shipping = Number(cart.chosen_rate.cost)

    cart.sub_total = sub_total
    cart.tax = tax
    cart.total = Number(sub_total + tax + shipping)

    cart.checkout_state = "payment"

    // update redux store
    await this.props.updateCart(cart)

    this.props.chooseTab("payment")
  }

  render() {
    return (
      <div className={`shipping_container ${!this.props.mobile && "w-90 margin-auto-h"}`}>
        { this.props.cart ?
          <>
            <div>
              <h4 style={this.props.mobile ? {} : { fontSize: "20px" }}>Choose Shipping Method</h4>
              <div>
                <Form 
                  onSubmit={this.handleSubmit}
                  submitButton={<div className={`${this.props.mobile ? "w-90" : ""} margin-auto-h`} style={{ marginTop: "20px" }}>
                                  <button style={this.props.mobile ? { fontSize: "20px", width: "100%" } : { width: "300px", fontSize: "25px" }} className={`bold margin-m-v`}>Select Shipping Method</button>
                                </div>}
                  formFields={this.state.rateFields}
                  form='shipping_method_selection_form'
                />
              </div>
            </div>
          </>
        : ""}
      </div>
    )
  }
}

function mapStateToProps({ form, mobile }) {
  return { form, mobile }
}

const actions = { convertCart, getShippingMethodForCheckout }

export default connect(mapStateToProps, actions)(AddressPanel)