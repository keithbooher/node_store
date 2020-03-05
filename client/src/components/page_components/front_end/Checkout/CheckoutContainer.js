import React, { Component } from 'react'
import TopTabs from './CheckoutPanel/TopTabs'
import Panel from './CheckoutPanel/Panel'
import './checkout.css.scss'

class CheckoutContainer extends Component  {
  constructor(props) {
    super()
    this.state = {
      checkout_steps: ['Address', 'Payment', 'Review'],
      chosen_tab: 'Address'
    }
  }

  chooseTab(tab_of_choice) {
    console.log(tab_of_choice)
    this.setState({ chosen_tab: tab_of_choice })
  }
  
  render() {
    let sections = {
      address: {
        name: "Adress",
        form_attributes: ['street_address', 'city', 'state', 'zip_code']
      },
      payment: {
        name: "Payment",
        form_attributes: [] // Stripe will take care of form (I just need to find out how to style their form)
      },
      review: {
        name: "Review"
      },
    }
    return (
      <div>
        <TopTabs chooseTab={this.chooseTab.bind(this)} chosenTab={this.state.chosen_tab} sections={this.state.checkout_steps} />
        <Panel sections={this.state.checkout_steps} chosenTab={this.state.chosen_tab} />
      </div>
    )
  }
}

export default CheckoutContainer