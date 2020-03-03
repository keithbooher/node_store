import React, { Component } from 'react'
import CheckoutPanel from './CheckoutPanel/MultiStepPanel'
import './checkout.css.scss'

class CheckoutContainer extends Component  {
  constructor(props) {
    super()
    this.state = {
      checkout_steps: ['Address', 'Payment', 'Review']
    }
  }
  
  render() {
    let sections = {
      address: {
        name: "Adress",
        form_attributes: ['street_address', 'city', 'state', 'zip_code']
      },
      payment: {
        name: "Payment",
        form_attributes: [] // Stripe will take care of form (I just need to find out how to style their form)
      },
      review: {
        name: "Review"
      },
    }
    return (
      <div>
        <CheckoutPanel sections={this.state.checkout_steps} />
      </div>
    )
  }
}

export default CheckoutContainer