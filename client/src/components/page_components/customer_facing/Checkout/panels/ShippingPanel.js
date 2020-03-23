import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateCart } from '../../../../../actions'
import _ from "lodash"

class AddressPanel extends Component  {
  constructor(props) {
    super()
    this.handleNext = this.handleNext.bind(this)
    this.state = {

    }
  }

  async componentDidMount() {    
    // api call to assign "shipping" checkout status to cart 
  }
  
  handleNext() {
    this.props.chooseTab('payment')
  }

  render() {
    console.log(this.props)

    return (
      <div className="shipping_container">
        { this.props.cart ?
          <>
            Shipping Panel
            <button onClick={this.handleNext} className="teal btn-flat right white-text">
              <i className="material-icons right">Next</i>
            </button>
          </>
        : ""}
      </div>
    )
  }
}

function mapStateToProps({ cart }) {
  return { cart }
}

const actions = { updateCart }

export default connect(mapStateToProps, actions)(AddressPanel)