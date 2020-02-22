import React, { Component } from 'react'
import { connect } from 'react-redux'
import './checkout.css.scss'
// pull from actions. create action to make request for adding product-data to the cart

class Checkout extends Component  {
  constructor(props) {
    super()
    this.state = {
      
    }
  }

  
  render() {
    console.log('checkout',this.props)
    return (
      <div>
        <h1>
          Node Store Checkout
        </h1>
      </div>
    )
  }
}


function mapStateToProps({ auth, cart }) {
  return { auth, cart }
}

export default connect(mapStateToProps, null)(Checkout)