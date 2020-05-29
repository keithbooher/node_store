import React, { Component } from 'react'
import LineItems from '../LineItems'
import './cart.css.scss'
import CartLength from "./CartLength"
import { Link } from 'react-router-dom'

class Cart extends Component {
  constructor(props) {
    super()

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setLengthRef = this.setLengthRef.bind(this);
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

  setLengthRef(node) {
    this.lengthRef = node;
  }

  handleClickOutside(event) {
    if (event.target.dataset.noClose || event.target.tagName === "path") {
      return
    } else if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.expandCart()
    }
  }
  
  expandCart() {
    this.setState({ showCart: !this.state.showCart})
  }

  render() {
    return (
    <div className="relative">
      <div data-noClose={false} className="h-100" style={{ zIndex: 100 }}>
        <CartLength expandCart={this.expandCart}  />
      </div>

      {this.state.showCart && 
        <div>
          <ul ref={this.setWrapperRef} className="expandedCart">
            <LineItems />
            <div onClick={this.expandCart} >
              <Link className="header_list_item clickable" to="/checkout">Checkout</Link>
            </div>
          </ul>
        </div>
      }
    </div>
    )
  }
}



export default Cart
