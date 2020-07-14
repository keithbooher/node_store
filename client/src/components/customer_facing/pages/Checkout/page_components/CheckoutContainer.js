import React, { Component } from 'react'
import { connect } from 'react-redux'
import AddressPanel from './panels/AddressPanel'
import PaymentPanel from './panels/PaymentPanel'
import ReviewPanel from './panels/ReviewPanel'
import ShippingPanel from './panels/ShippingPanel'
import { updateCart, getCurrentCart } from '../../../../../utils/API'
import { getGuestCart } from "../../../../../actions"
import { withCookies } from 'react-cookie'

import './checkout.css.scss'

class CheckoutContainer extends Component  {
  constructor(props) {
    super()
    this.chooseTab = this.chooseTab.bind(this)
    this.makeNewOrderAvailable = this.makeNewOrderAvailable.bind(this)
    this.updateCart = this.updateCart.bind(this)
    
    this.state = {
      chosen_tab: 'address',
      new_order: null,
      current_cart: null
    }
  }

  async componentDidMount() {
    const { cookies } = this.props
    let current_cart
    if (!this.props.current_user) {
      const guest_cart_id = cookies.get('guest_cart')
      current_cart = await this.props.getGuestCart(guest_cart_id)
    } else {
      current_cart = await getCurrentCart(this.props.current_user._id)
      current_cart = current_cart.data
    }

    if (current_cart.checkout_state === "shopping") {
      current_cart.checkout_state = "address"
    }
    this.setState({ chosen_tab: current_cart.checkout_state, current_cart: current_cart })

    // MAKE REQUEST TO UPDATE CART STATUS TO ADDRESS (if checkout_state is shopping), 
    // JUST NOT THROUGH REDUX SO WE DONT CAUSE A RERENDER

  }

  async updateCart(cart) {
    //update data base
    const update_cart = await updateCart(cart)
    this.setState({ current_cart: update_cart.data, chosen_tab: update_cart.data.checkout_state  })
  }

  chooseTab(chosen_tab) {
    this.setState({ chosen_tab: chosen_tab  })
  }

  makeNewOrderAvailable(order, cart) {
    this.setState({ new_order: order, chosen_tab: "review", current_cart: cart })
  }

  paramterChooseTab(chosen_tab) {
    if (chosen_tab === "shipping") {
      if (this.state.current_cart.shipping_address && this.state.current_cart.billing_address) {
        this.setState({ chosen_tab: chosen_tab  })
      }
    } else if (chosen_tab === "payment") {
      if (this.state.current_cart.shipping_address && 
            this.state.current_cart.billing_address &&
              this.state.current_cart.chosen_rate ) {
        this.setState({ chosen_tab: chosen_tab  })
      }
    }
  }

  
  render() {
    console.log(this.state)
    let address_boolean = false
    let shipping_boolean = false
    let payment_boolean = false
    switch (this.state.chosen_tab) {
      case "address":
      case "shipping":
        address_boolean = true
        break;
      case "payment":
        address_boolean = true        
        shipping_boolean = true        
        break;
      case "review":
        address_boolean = true        
        shipping_boolean = true
        payment_boolean = true
        break;
      default:
        break;
    }
    return (
      <>
        <h2 className={`underline ${address_boolean && "color-grey-4"}`} onClick={() => this.chooseTab('address')}>Address</h2>
        {this.state.chosen_tab === 'address' ? 
          <AddressPanel 
            chooseTab={this.chooseTab}
            chosen_tab={this.state.chosen_tab} 
            updateCart={this.updateCart}
            />
        : ""}

        <h2 className={`underline ${shipping_boolean && "color-grey-4"}`} onClick={() => this.paramterChooseTab('shipping')}>Shipping</h2>
        {this.state.chosen_tab === 'shipping' ? 
          <ShippingPanel
            cart={this.state.current_cart}
            updateCart={this.updateCart}
            chooseTab={this.chooseTab}
            />
        : ""}

        <h2  className={`underline ${payment_boolean && "color-grey-4"}`} onClick={() => this.paramterChooseTab('payment')}>Payment</h2>
        {this.state.chosen_tab === "payment" ? 
          <PaymentPanel 
            cart={this.state.current_cart}
            makeNewOrderAvailable={this.makeNewOrderAvailable} 
            chooseTab={this.chooseTab} 
            chosen_tab={this.state.chosen_tab} 
            preExistingShipping={this.state.preExistingShipping}
            preExistingBilling={this.state.preExistingBilling}
            updateCart={this.updateCart}
            />
          : ""}

        <h2 className="underline">Review</h2>
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


const actions = { updateCart, getGuestCart }

export default connect(null, actions)(withCookies(CheckoutContainer))