import React, { Component } from 'react'
import { connect } from 'react-redux'
import { convertCart } from '../../../../../../actions'
import _ from "lodash"
import Form from '../../../../../shared/Form';
import { shippingMethods } from "../formFields"
import { createShipment } from "../../../../../../utils/API"
class AddressPanel extends Component  {
  constructor(props) {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {

    }
  }

  async componentDidMount() {    
    // api call to assign "shipping" checkout status to cart 
  }
  
  async handleSubmit(e) {
    e.preventDefault()
    const selected_shipping_method = this.props.form[`shipping_method_selection_form`].values
    const cost = selected_shipping_method.shipping_rates.cost
    const shipping_method = selected_shipping_method.shipping_rates.name

    let cart = {...this.props.cart}

    let chosen_rate = {
        cost,
        shipping_method
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
                  onSubmit={(e) => this.handleSubmit(e)}
                  submitButtonText={"Select Shipping Method"}
                  formFields={shippingMethods}
                  formId='shipping_method_selection_form'
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