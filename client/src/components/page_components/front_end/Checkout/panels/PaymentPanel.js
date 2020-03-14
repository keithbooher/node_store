import React, { Component } from 'react'
import Payment from '../../Payments'


class PaymentPanel extends Component  {
  constructor(props) {
    super()
    this.state = {

    }
  }

  
  render() {
    // Make sure to fire off the chooseTab() function to get the user to the review screen once they have paid
    return (
      <div id="">
        {this.props.chosen_tab === "payment" ? 
          
            <Payment makeNewOrderAvailable={this.props.makeNewOrderAvailable} clearCheckoutForm={this.props.clearCheckoutForm} cart={this.props.cart} chooseTab={this.props.chooseTab} updateCart={this.props.updateCart}  convertCart={this.props.convertCart} />

          : ""}
      </div>
    )
  }
}

export default PaymentPanel