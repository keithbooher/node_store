import React, { Component } from 'react'
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
    let sub_total = cart.sub_total
    let shipping = cart.chosen_rate.cost
    let tax = (sub_total + shipping) * .08


    cart.tax = tax
    cart.sub_total = sub_total
    cart.total = sub_total + shipping + tax
    const { data } = await updateCart(cart)

    let state = {
      cart: data,
      step: "payment",
    }
    this.props.topStateSetter(state)

    this.props.refProp.current.scrollTo(0, 0);
  }

  render() {
    console.log(this.props)
    return (
      <div>
        {this.state.shipping_method !== null && 
          <>
            <h1>Shipping Method: {this.state.shipping_method.name}</h1>
            <h2>Shipping Rates</h2>
            {this.state.shipping_method.shipping_rates.map((rate) => {
              let active = false
              if (this.state.chosen_rate && this.state.chosen_rate._id === rate._id ) {
                active = true
              }
              return (
                <div 
                  style={active ? {color: "blue"} : {}} 
                  className={"padding-s margin-xs-v background-color-grey-2"} 
                  onClick={() => this.chooseRate(rate)}
                >
                  <h2 className="padding-s">{rate.name}</h2>
                  <h3 className="padding-s">${rate.effector}</h3>
                </div>
              )
            })}
          </>
        }

        {this.state.chosen_rate && 
          <button className="margin-s-v" onClick={this.proceedToNextStep}>Proceed to Payment</button>
        }
      </div>
    )
  }
}

export default ShippingOptions