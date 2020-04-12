import React, { Component } from 'react'
import { connect } from 'react-redux'
import './cart.css.scss'
import { usersCart } from "../../../../actions"

class CartLength extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }

  async componentDidMount() {
    this.props.usersCart()
  }

  calculated_cart_length() {
    let calculated_cart_length = 0
    if(this.props.cart) {
      this.props.cart.line_items.forEach(line_item => {
        calculated_cart_length = calculated_cart_length + line_item.quantity
      });
    }
    return calculated_cart_length
  }

  render() {
    return (
      <div className="flex" onClick={this.props.expandCart} style={{ padding: '0px 10px' }} >
        {this.calculated_cart_length()}
        <i className="fas fa-shopping-cart"></i>
      </div>
    )
  }
}

function mapStateToProps({ cart }) {
  return { cart }
}

const actions = { usersCart }


export default connect(mapStateToProps, actions)(CartLength)