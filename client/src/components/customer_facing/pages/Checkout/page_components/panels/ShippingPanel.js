import React, { Component } from 'react'
import { connect } from 'react-redux'
import { convertCart } from '../../../../../../actions'
import _ from "lodash"
import Form from '../../../../../shared/Form';
import { getShippingMethodForCheckout } from "../../../../../../utils/API"

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
    const { data } = await getShippingMethodForCheckout()

    const rates = data.shipping_rates.filter((rate) => rate.display === true)
    const fields = rates.map((rate) => {
      return {
        name: rate.name,
        value: rate.effector,
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
    console.log(selected_shipping_method)
    const cost = selected_shipping_method.shipping_rates.value
    const shipping_method = "Flat Rate"
    const rate = selected_shipping_method.shipping_rates.name

    let cart = {...this.props.cart}

    let chosen_rate = {
        cost,
        shipping_method,
        rate
    }

    cart.chosen_rate = chosen_rate
    cart.checkout_state = "payment"

    // update redux store
    const thing = await this.props.updateCart(cart)

    this.props.chooseTab("payment")
  }

  render() {
    return (
      <div className="shipping_container">
        { this.props.cart ?
          <>
            <div>
              <h4>Choose Shipping Method</h4>
              <div>
                <Form 
                  onSubmit={this.handleSubmit}
                  submitButtonText={"Select Shipping Method"}
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

function mapStateToProps({ form }) {
  return { form }
}

const actions = { convertCart }

export default connect(mapStateToProps, actions)(AddressPanel)