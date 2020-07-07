import React, { Component } from 'react'
import ChooseCustomer from './ChooseCustomer'
import FillCart from "./FillCart"
import { getShippingMethodForCheckout } from "../../../../utils/API"
import { updateCart } from "../../../../utils/API"

class ShippingOptions extends Component {
  constructor(props) {
    super()
    this.proceedToNextStep = this.proceedToNextStep.bind(this)
    this.state = {
      shipping_method: null,
      chosen_rate: null
    }
  }

  async componentDidMount() {
    const { data } = await getShippingMethodForCheckout()
    this.setState({ shipping_method: data })
  }

  chooseRate(rate) {
    this.setState({ chosen_rate: rate })
  }
  
  async proceedToNextStep() {
    let cart = this.props.cart
    cart.chosen_rate = {
      cost: this.state.chosen_rate.effector,
      shipping_method: this.state.shipping_method.name,
      rate: this.state.chosen_rate.name
    }
    cart.total += this.state.chosen_rate.effector
    const { data } = await updateCart(cart)

    let state = {
      cart: data,
      step: "payment",
    }
    this.props.topStateSetter(state)
  }

  render() {
    console.log(this.state)
    console.log(this.props)
    return (
      <div>
        {this.state.shipping_method !== null && 
          <>
            <h3>Shipping Method: {this.state.shipping_method.name}</h3>
            <h5>Shipping Rates</h5>
            {this.state.shipping_method.shipping_rates.map((rate) => {
              let active = false
              if (this.state.chosen_rate && this.state.chosen_rate._id === rate._id ) {
                active = true
              }
              return (
                <div 
                  style={active ? {color: "blue"} : {}} 
                  className={"clickable background-color-grey-2"} 
                  onClick={() => this.chooseRate(rate)}
                >
                  <div>{rate.name}</div>
                  <div>${rate.effector}</div>
                </div>
              )
            })}
          </>
        }

        {this.state.chosen_rate && 
          <button onClick={this.proceedToNextStep}>Proceed to Payment</button>
        }
      </div>
    )
  }
}

export default ShippingOptions