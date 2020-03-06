import React, { Component } from 'react'
import TopTabs from './CheckoutPanel/TopTabs'
import Panel from './CheckoutPanel/Panel'
import './checkout.css.scss'

class CheckoutContainer extends Component  {
  constructor(props) {
    super()
    this.state = {
      checkout_steps: ['Address', 'Payment', 'Review'],
      chosen_tab: 'Address',
      cart_checkout_status: 'Address',
    }
  }

  chooseTab(tab_of_choice) {
    console.log(tab_of_choice)
    this.setState({ chosen_tab: tab_of_choice })
  }
  
  render() {
    return (
      <div>
        <TopTabs cart={this.props.cart} chooseTab={this.chooseTab.bind(this)} chosenTab={this.state.chosen_tab} sections={this.state.checkout_steps} />
        <Panel cart={this.props.cart} sections={this.state.checkout_steps} chosenTab={this.state.chosen_tab} />
      </div>
    )
  }
}

export default CheckoutContainer