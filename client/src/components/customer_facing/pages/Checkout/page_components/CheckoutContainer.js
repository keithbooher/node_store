import React, { Component } from 'react'
import AddressPanel from './panels/AddressPanel'
import PaymentPanel from './panels/PaymentPanel'
import ReviewPanel from './panels/ReviewPanel'
import ShippingPanel from './panels/ShippingPanel'
import { updateCart, getCurrentCart } from '../../../../../utils/API'

import './checkout.css.scss'

class CheckoutContainer extends Component  {
  constructor(props) {
    super()
    this.chooseTab = this.chooseTab.bind(this)
    this.makeNewOrderAvailable = this.makeNewOrderAvailable.bind(this)
    this.choosePreExistingAddress = this.choosePreExistingAddress.bind(this)
    this.updateCart = this.updateCart.bind(this)
    
    this.state = {
      chosen_tab: 'address',
      new_order: null,
      preExistingShipping: null,
      preExistingBilling: null,
      current_cart: null
    }
  }

  async componentDidMount() {
    const current_cart = await getCurrentCart(this.props.current_user)
    console.log(current_cart)
    if (current_cart.data.checkout_state === "shopping") {
      current_cart.data.checkout_state = "address"
    }
    this.setState({ chosen_tab: current_cart.data.checkout_state, current_cart: current_cart.data })

    // MAKE REQUEST TO UPDATE CART STATUS TO ADDRESS (if checkout_state is shopping), 
    // JUST NOT THROUGH REDUX SO WE DONT CAUSE A RERENDER

  }

  async updateCart(cart) {
    const update_cart = await updateCart(cart)
    this.setState({ current_cart: update_cart.data })
  }

  chooseTab(chosen_tab) {
    this.setState({ chosen_tab: chosen_tab  })
  }

  makeNewOrderAvailable(order) {
    this.setState({ new_order: order })
  }

  // TO DO
  // can this be moved to the address panel?
  choosePreExistingAddress(address) {
    console.log(address.bill_or_ship)
    switch (address.bill_or_ship) {
      case 'shipping':
        this.setState({ preExistingShipping: address })
        break
      case 'billing':
        this.setState({ preExistingBilling: address })
        break
      case 'shipping null':
        this.setState({ preExistingShipping: null })
        break
      case 'billing null':
        this.setState({ preExistingBilling: null })
        break
      default:
        break;
    }
  }

  
  render() {
    console.log(this.state)
    return (
      <>
        <h4 onClick={() => this.chooseTab('address')}>Address</h4>
        {this.state.chosen_tab === 'address' ? 
          <AddressPanel 
            chooseTab={this.chooseTab}
            chosen_tab={this.state.chosen_tab} 
            updateCart={this.updateCart}
            // pass this to the preAddy cards
            choosePreExistingAddress={this.choosePreExistingAddress}
            preExistingShipping={this.state.preExistingShipping}
            preExistingBilling={this.state.preExistingBilling}
            />
        : ""}

        <h4 onClick={() => this.chooseTab('shipping')}>Shipping</h4>
        {this.state.chosen_tab === 'shipping' ? 
          <ShippingPanel
            cart={this.state.current_cart}
            updateCart={this.updateCart}
            chooseTab={this.chooseTab}
            />
        : ""}

        <h4 onClick={() => this.chooseTab('payment')}>Payment</h4>
        {this.state.chosen_tab === "payment" ? 
          <PaymentPanel 
            cart={this.state.current_cart}
            makeNewOrderAvailable={this.makeNewOrderAvailable} 
            chooseTab={this.chooseTab} 
            chosen_tab={this.state.chosen_tab} 
            preExistingShipping={this.state.preExistingShipping}
            preExistingBilling={this.state.preExistingBilling}
            />
          : ""}

        <h4>Review</h4>
        {this.state.new_order !== null ? this.state.chosen_tab === "review" ?
          <ReviewPanel 
            convertCart={this.props.convertCart} 
            new_order={this.state.new_order} 
            chooseTab={this.chooseTab} 
            chosen_tab={this.state.chosen_tab} 
            />
          : "": ""}
      </>
    )
  }
}

export default CheckoutContainer