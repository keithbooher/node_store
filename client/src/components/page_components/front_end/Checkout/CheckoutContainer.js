import React, { Component } from 'react'
import loadingGif from '../../../../images/pizzaLoading.gif'
import Form from '../../shared/Form/Form'
import AddressPanel from './panels/AddressPanel'
import PaymentPanel from './panels/PaymentPanel'
import ReviewPanel from './panels/ReviewPanel'
import './checkout.css.scss'

class CheckoutContainer extends Component  {
  constructor(props) {
    super()
    this.chooseTab = this.chooseTab.bind(this)
    this.makeNewOrderAvailable = this.makeNewOrderAvailable.bind(this)

    let checkout_state = props.cart.checkout_state
    this.state = {
      chosen_tab: checkout_state === 'shopping' ? 'address' : checkout_state,
      cart_checkout_status: checkout_state,
      new_order: {}
    }
  }

  chooseTab(chosen_tab) {
    this.setState({ chosen_tab: chosen_tab  })
  }

  makeNewOrderAvailable(order) {
    this.setState({ new_order: order })
  }

  
  render() {
    return (
      <div>
        <div>

          <h4 onClick={() => this.chooseTab('address')}>Billing & Shipping</h4>
          <AddressPanel 
            chosen_tab={this.state.chosen_tab} 
            updateCart={this.props.updateCart} 
            address_form_state={this.props.address_form_state} 
            cart={this.props.cart} />

          <h4 onClick={() => this.chooseTab('payment')}>Payment</h4>
          <PaymentPanel 
            makeNewOrderAvailable={this.makeNewOrderAvailable} 
            clearCheckoutForm={this.props.clearCheckoutForm} 
            chooseTab={this.chooseTab} 
            chosen_tab={this.state.chosen_tab} 
            updateCart={this.props.updateCart} 
            convertCart={this.props.convertCart} 
            cart={this.props.cart} />

          <h4>Review</h4>
          <ReviewPanel 
            convertCart={this.props.convertCart} 
            new_order={this.state.new_order} 
            chooseTab={this.chooseTab} 
            chosen_tab={this.state.chosen_tab} 
            updateCart={this.props.updateCart} 
            address_form_state={this.props.address_form_state} 
            cart={this.props.cart} />

        </div>
      </div>
    )
  }
}

export default CheckoutContainer