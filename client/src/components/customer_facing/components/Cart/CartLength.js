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
      <a className="flex justify-center align-items-center h-100 hover-color-7" style={this.props.mobile ? { width: "50px" } : { fontSize: "25px", paddingLeft: ".8em" }} >
        <div className="inline">{this.calculated_cart_length()}</div>
        <span style={this.props.mobile ? { margin: "0 .4em" } : { marginLeft: ".2em", marginRight: ".8em" }}><FontAwesomeIcon ref={this.props.lengthRef} style={{ zIndex: 0 }} icon={faShoppingCart} /></span>
      </a>
    )
  }
}

function mapStateToProps({ cart, mobile }) {
  return { cart, mobile }
}


export default connect(mapStateToProps, null)(CartLength)