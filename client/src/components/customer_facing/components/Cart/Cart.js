import React, { Component } from 'react'
import LineItems from '../LineItems'
import './cart.css.scss'
import CartLength from "./CartLength"

class Cart extends Component {
  constructor(props) {
    super()
    this.expandCart = this.expandCart.bind(this)
    this.state = {
      showCart: false
    }
  }

  expandCart() {
    let boolean = this.state.showCart
    this.setState({ showCart: !boolean})
  }

  render() {
    return (
    <div className="header_list_item clickable">
      <CartLength expandCart={this.expandCart} />
      {this.state.showCart === false ? "" : <LineItems />}
    </div>
    )
  }
}



export default Cart