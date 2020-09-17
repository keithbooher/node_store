import React, { Component } from 'react'
import Payment from '../../../../components/Payments'
import {loadStripe} from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY)

class PaymentPanel extends Component  {
  constructor(props) {
    super()
    this.state = {

    }
  }

  
  render() {

    // Make sure to fire off the chooseTab() function to get the user to the review screen once they have paid
    return (
      <>
        <Elements stripe={stripePromise}>
          <Payment 
            cart={this.props.cart}
            preExistingShipping={this.props.preExistingShipping} 
            preExistingBilling={this.props.preExistingBilling} 
            makeNewOrderAvailable={this.props.makeNewOrderAvailable} 
            chooseTab={this.props.chooseTab} 
            updateCart={this.props.updateCart}
          />
        </Elements>
      </>
    )
  }
}


export default PaymentPanel