import React, { Component } from 'react'
import AddressPanel from './panels/AddressPanel'
import PaymentPanel from './panels/PaymentPanel'
import ReviewPanel from './panels/ReviewPanel'
import ShippingPanel from './panels/ShippingPanel'
import API from '../../../../../utils/API'


import './checkout.css.scss'

//manage chosen tab here



class CheckoutContainer extends Component  {
  constructor(props) {
    super()
    this.chooseTab = this.chooseTab.bind(this)
    this.makeNewOrderAvailable = this.makeNewOrderAvailable.bind(this)
    this.choosePreExistingAddress = this.choosePreExistingAddress.bind(this)
    
    this.state = {
      chosen_tab: 'address',
      new_order: null,
      preExistingShipping: null,
      preExistingBilling: null,
    }
  }

  async componentDidMount() {
    const current_cart = await API.getCurrentCart(this.props.current_user)
    console.log(current_cart)
    if (current_cart.data.checkout_state === "shopping") {
      current_cart.data.checkout_state = "address"
    }
    this.setState({ chosen_tab: current_cart.data.checkout_state })

    // MAKE REQUEST TO UPDATE CART STATUS TO ADDRESS (if checkout_state is shopping), 
    // JUST NOT THROUGH REDUX SO WE DONT CAUSE A RERENDER

  }

  chooseTab(chosen_tab) {
    this.setState({ chosen_tab: chosen_tab  })
  }

  makeNewOrderAvailable(order) {
    this.setState({ new_order: order })
  }

  choosePreExistingAddress(ship_or_bill, object) {
    switch (ship_or_bill) {
      case 'shipping':
        this.setState({ preExistingShipping: object })
      case 'billing':
        this.setState({ preExistingShipping: object })
      default:
        break;
    }
    // this.setState({ preExistingAddressChosen: boolean })
  }

  
  render() {
    console.log(this.state)
    return (
      <>
        <h4 onClick={() => this.chooseTab('address')}>Address</h4>
        {this.state.chosen_tab === 'address' ? 
          <AddressPanel 
            chosen_tab={this.state.chosen_tab} 
            // pass this to the preAddy cards
            choosePreExistingAddress={this.choosePreExistingAddress}
            preExistingShipping={this.state.preExistingShipping}
            preExistingBilling={this.state.preExistingBilling}
            />
        : ""}

        <h4 onClick={() => this.chooseTab('shipping')}>Shipping</h4>
        {this.state.chosen_tab === 'shipping' ? 
          <ShippingPanel 
            chooseTab={this.chooseTab}
            preExistingShipping={this.state.preExistingShipping}
            preExistingBilling={this.state.preExistingBilling}
            />
        : ""}

        <h4 onClick={() => this.chooseTab('payment')}>Payment</h4>
        {this.state.chosen_tab === "payment" ? 
          <PaymentPanel 
            makeNewOrderAvailable={this.makeNewOrderAvailable} 
            clearCheckoutForm={this.props.clearCheckoutForm} 
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