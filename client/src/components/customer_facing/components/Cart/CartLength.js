import React, { Component } from 'react'
import { connect } from 'react-redux'
import './cart.css.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"
class CartLength extends Component {
  constructor(props) {
    super()
    this.state = {

    }
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
      <div className="flex" style={{ padding: '0px 10px' }} >
        {this.calculated_cart_length()}
        <FontAwesomeIcon icon={faShoppingCart} />
      </div>
    )
  }
}

function mapStateToProps({ cart }) {
  return { cart }
}


export default connect(mapStateToProps, null)(CartLength)