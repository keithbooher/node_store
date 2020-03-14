import React, { Component } from 'react'


class ReviewPanel extends Component  {
  constructor(props) {
    super()
    this.state = {

    }
  }

  componentWillUnmount() {
    this.props.convertCart(null)
  }

  
  render() {
    console.log(this.props)
    // This panel is for show the user that they have successfully placed 
    // their order and to show them their order number
    return (
      <div id="">
        {this.props.new_order !== {} ? this.props.cart.checkout_state === 'complete' ?
        <div>
         "Congrats on your order! You figure it out from here :]"
          <div>Order #: {this.props.new_order._id}</div>
         </div>
         : "" : ""}
      </div>
    )
  }
}

export default ReviewPanel