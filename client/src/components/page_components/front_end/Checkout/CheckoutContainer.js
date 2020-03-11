import React, { Component } from 'react'
import TopTabs from './CheckoutPanel/TopTabs'
import Panel from './CheckoutPanel/Panel'
import loadingGif from '../../../../images/pizzaLoading.gif'
import './checkout.css.scss'

class CheckoutContainer extends Component  {
  constructor(props) {
    super()
    let checkout_state = props.cart.checkout_state
    this.state = {
      checkout_steps: ['address', 'payment', 'review'],
      chosen_tab: checkout_state === 'shopping' ? 'address' : checkout_state,
      cart_checkout_status: checkout_state,
    }
  }

  chooseTab(tab_of_choice) {
    console.log(tab_of_choice)
    this.setState({ chosen_tab: tab_of_choice })
  }
  
  render() {
    return (
      <div>
        {!this.props.cart ? <img className="loadingGif loadingGifCenterScreen" src={loadingGif} /> :
        <div>
          <TopTabs cart={this.props.cart} chooseTab={this.chooseTab.bind(this)} chosenTab={this.state.chosen_tab} sections={this.state.checkout_steps} />
          <Panel updateCheckoutState={this.props.updateCheckoutState} address_form_state={this.props.address_form_state} chooseTab={this.chooseTab.bind(this)} cart={this.props.cart} sections={this.state.checkout_steps} chosenTab={this.state.chosen_tab} />
        </div>
        }
      </div>
    )
  }
}

export default CheckoutContainer