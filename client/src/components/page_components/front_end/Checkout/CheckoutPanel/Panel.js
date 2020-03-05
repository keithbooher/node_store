import React, { Component } from 'react'
import AddressPanel from './panels/AddressPanel'
import PaymentPanels from './panels/PaymentPanel'
import ReviewPanel from './panels/ReviewPanel'


class FormContainer extends Component  {
  constructor(props) {
    super()
    this.state = {
      
    }
  }

  renderChosenPanel() {
    switch(this.props.chosenTab) {
      case "Address":
        return <AddressPanel sections={this.props.sections} />
      case "Payment":
        return <PaymentPanels sections={this.props.sections} />
      case "Review":
        return <ReviewPanel sections={this.props.sections} />
      default:
        return <AddressPanel sections={this.props.sections} />
    }
  }
  
  render() {
    // do stuff with form attributes from sections props
    return (
      <div id="checkout_tabs_container">
        {this.renderChosenPanel()}
      </div>
    )
  }
}

export default FormContainer