import React, { Component } from 'react'
import AddressPanel from './panels/AddressPanel/AddressPanel'
import PaymentPanel from './panels/PaymentPanel'
import ReviewPanel from './panels/ReviewPanel'


class Panel extends Component  {
  constructor(props) {
    super()
    this.state = {
      
    }
  }

  renderChosenPanel() {
    console.log(this.props)
    switch(this.props.chosenTab) {
      case "address":
        return <AddressPanel updateCheckoutState={this.props.updateCheckoutState} chooseTab={this.props.chooseTab} address_form_state={this.props.address_form_state} cart={this.props.cart} sections={this.props.sections} />
      case "payment":
        return <PaymentPanel sections={this.props.sections} />
      case "review":
        return <ReviewPanel sections={this.props.sections} />
      default:
        return <AddressPanel sections={this.props.sections} />
    }
  }
  
  render() {
    // do stuff with form attributes from sections props
    console.log(this.props)
    return (
      <div id="checkout_tabs_container">
        {!this.props.cart ? "" :
        this.renderChosenPanel()}
      </div>
    )
  }
}

export default Panel