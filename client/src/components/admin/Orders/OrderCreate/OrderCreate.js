import React, { Component } from 'react'
import ChooseCustomer from './ChooseCustomer'
import FillCart from "./FillCart"

class OrderCreate extends Component {
  constructor(props) {
    super()
    this.topStateSetter = this.topStateSetter.bind(this)
    this.state = {
      customer: null,
      cart: null,
      step: "customer",

    }
  }

  topStateSetter(state) {
    this.setState(state)
  }
  

  render() {
    console.log(this.state)
    return (
      <div>
        {/* Choose customer (guest or not) and fill out info */}
        { this.state.step === "customer" && <ChooseCustomer topStateSetter={this.topStateSetter} /> }
        {/* Create Cart and add line items */}
        { this.state.step === "cart" && <FillCart topStateSetter={this.topStateSetter} /> }
        {/* Choose Shipping */}
        {/* Enter Payment Info */}
        {/* Done */}
      </div>
    )
  }
}

export default OrderCreate