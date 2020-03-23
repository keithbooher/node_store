import React, { Component } from 'react'
import { connect } from 'react-redux'
import { convertCart } from '../../../../../actions'


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
    console.log('review panel')
    // This panel is for show the user that they have successfully placed 
    // their order and to show them their order number
    return (
      <>
        {this.props.cart ? this.props.cart.checkout_state === 'complete' ?
          <>
            "Congrats on your order! You figure it out from here :]"
            <div>Order #: {this.props.new_order._id}</div>
          </>
       : "" : "" }

      </>
    )
  }
}

function mapStateToProps({ cart }) {
  return { cart }
}

const actions = { convertCart }

export default connect(mapStateToProps, actions)(ReviewPanel)