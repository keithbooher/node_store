import React, { Component } from 'react'
import LineItems from '../LineItems'
import './cart.css.scss'
import CartLength from "./CartLength"

class Cart extends Component {
  constructor(props) {
    super()

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.expandCart = this.expandCart.bind(this)
    this.state = {
      showCart: false
    }
  }


  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.expandCart()
    }
  }
  
  expandCart() {
    let boolean = this.state.showCart
    this.setState({ showCart: !boolean})
  }

  render() {
    return (
    <div onClick={this.expandCart} className="relative header_list_item clickable">
      <CartLength />
      {this.state.showCart === false ? "" : 
        <ul ref={this.setWrapperRef} className="expandedCart"><LineItems /></ul>
        }
    </div>
    )
  }
}



export default Cart
