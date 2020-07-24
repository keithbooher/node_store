import React, { Component } from 'react'
import LineItems from '../LineItems'
import './cart.css.scss'
import CartLength from "./CartLength"
import { Link } from 'react-router-dom'

class Cart extends Component {
  constructor(props) {
    super()
    this.dropRef = React.createRef()

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

  handleClickOutside(e) {
    if(e.target === this.dropRef.current || e.target.tagName === "svg" || e.target.tagName === "path") {
      return
    } else if (this.state.showCart === true && !this.node.contains(e.target)) {
      this.expandCart()
    }
  }
  
  expandCart() {
    this.setState({ showCart: !this.state.showCart})
  }

  render() {
    return (
    <div>
      <div ref={this.dropRef} className="h-100">
        <CartLength expandCart={this.expandCart}  />
      </div>

      {this.state.showCart && 
        <div>
          <ul ref={node => this.node = node} className="expandedCart">
            <LineItems expandCart={this.expandCart} />
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
