import React, { Component } from 'react'
import MultiPanel from '../../../shared/MultiPanel/MultiPanel'
import Details from './page_components/Details'
import Addresses from './page_components/Addresses'
import Orders from './page_components/Orders'
import Reviews from './page_components/Reviews'
import './account.scss'
class Account extends Component  {
  constructor(props) {
    super()
    this.chooseTab = this.chooseTab.bind(this)
    this.state = {
      chosen_tab: "details"
    }
  }


  chooseTab(tab_of_choice) {
    this.setState({ chosen_tab: tab_of_choice })
  }

  
  render() {
    const sections = ["details", "addresses", "orders", "reviews"]
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Account</h1>
        <MultiPanel chosen_tab={this.state.chosen_tab} chooseTab={this.chooseTab} sections={sections}>
          <div>
            {this.state.chosen_tab === 'details' ? <Details /> : ""}
            {this.state.chosen_tab === 'addresses' ? <Addresses /> : ""}
            {this.state.chosen_tab === 'orders' ? <Orders /> : ""}
            {this.state.chosen_tab === 'reviews' ? <Reviews /> : ""}
          </div>
        </MultiPanel>
      </div>
    )
  }
}

export default Account