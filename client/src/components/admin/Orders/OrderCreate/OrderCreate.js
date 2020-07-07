import React, { Component } from 'react'
import ChooseCustomer from './ChooseCustomer'
import FillCart from "./FillCart"
import ShippingOptions from "./ShippingOptions"
import Payment from "./Payment"

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
       

        { this.state.step === "customer" && <ChooseCustomer topStateSetter={this.topStateSetter} /> }
        { this.state.step === "cart" && <FillCart cart={this.state.cart} topStateSetter={this.topStateSetter} /> }
        { this.state.step === "shipping" && <ShippingOptions cart={this.state.cart} topStateSetter={this.topStateSetter} /> }
        { this.state.step === "payment" && <Payment customer={this.state.customer} cart={this.state.cart} topStateSetter={this.topStateSetter} /> }

        {/* Enter Payment Info */}
        {/* Done */}
      </div>
    )
  }
}

export default OrderCreate