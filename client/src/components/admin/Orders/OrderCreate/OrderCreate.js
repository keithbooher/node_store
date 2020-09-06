import React, { Component } from 'react'
import { connect } from 'react-redux'
import ChooseCustomer from './ChooseCustomer'
import FillCart from "./FillCart"
import ShippingOptions from "./ShippingOptions"
import Payment from "./Payment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSync } from "@fortawesome/free-solid-svg-icons"

class OrderCreate extends Component {
  constructor(props) {
    super()
    this.topStateSetter = this.topStateSetter.bind(this)
    this.restart = this.restart.bind(this)

    this.state = {
      customer: null,
      cart: null,
      step: "customer",
    }
  }

  topStateSetter(state) {
    this.setState(state)
  }

  restart() {
    this.setState({ customer: null, cart: null, step: "customer" })
  }
  

  render() {
    let fontSize = "1em"
    if (!this.props.mobile) {
      fontSize = "25px"
    }
    return (
      <div className="h-100" style={{ fontSize }}>

        {this.state.step !== "customer" && 
          <div className="absolute hover hover-color-2" style={{ top: "5px", right: "5px" }} onClick={this.restart}>
            Start Over <FontAwesomeIcon icon={faSync} />
          </div>
        }

        { this.state.step === "customer" && <ChooseCustomer refProp={this.props.refProp} topStateSetter={this.topStateSetter} /> }
        { this.state.step === "cart" && <FillCart refProp={this.props.refProp} cart={this.state.cart} topStateSetter={this.topStateSetter} /> }
        { this.state.step === "shipping" && <ShippingOptions refProp={this.props.refProp} cart={this.state.cart} topStateSetter={this.topStateSetter} /> }
        { this.state.step === "payment" && <Payment refProp={this.props.refProp} customer={this.state.customer} cart={this.state.cart} topStateSetter={this.topStateSetter} /> }

        {/* Enter Payment Info */}
        {/* Done */}
      </div>
    )
  }
}

function mapStateToProps({ mobile }) {
  return { mobile }
}

export default connect(mapStateToProps, null)(OrderCreate)