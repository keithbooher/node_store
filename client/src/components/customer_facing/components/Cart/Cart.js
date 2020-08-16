import React, { Component } from 'react'
import { connect } from 'react-redux'
import LineItems from '../LineItems'
import './cart.css.scss'
import CartLength from "./CartLength"
import { Link } from 'react-router-dom'
import { formatMoney } from '../../../../utils/helpFunctions'
import { dispatchEnlargeImage, showCartAction } from "../../../../actions"

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
    this.props.showCartAction(false)
    this.setState({ showCart: !this.state.showCart})
  }

  render() {
    let shipping = 0 
    if (this.props.cart) {
      shipping = this.props.cart.chosen_rate ? this.props.cart.chosen_rate.cost : 0
    }

    // if (!this.state.showCart && this.props.showCart) {
    //   this.setState({ showCart: true })
    // }

    return (
    <div>
      <div onClick={this.expandCart} ref={this.dropRef} className="h-100">
        <CartLength expandCart={this.expandCart}  />
      </div>

      {this.state.showCart && 
        <div>
          <ul ref={node => this.node = node} className="expandedCart">
            <div className="flex flex_column">
              {this.props.cart && this.props.cart.line_items.length > 0 && 
                <>
                  <div id="items">
                    <LineItems cart={this.props.cart} expandCart={this.expandCart} />
                  </div>

                  <div className="flex space-between background-color-grey-5">
                    <div className="flex flex_column">
                      <div>Sub Total: ${formatMoney(this.props.cart.sub_total)}</div>
                      <div>Tax: ${formatMoney(this.props.cart.tax)}</div>
                      {this.props.cart.chosen_rate && <div>Shipping: ${formatMoney(shipping)}</div>}
                      <div>Total: ${formatMoney(this.props.cart.total + this.props.cart.tax + shipping)}</div>
                    </div>
                    <button onClick={this.expandCart} ><Link onClick={this.expandCart} className="header_list_item clickable" to="/checkout">Checkout</Link></button>
                  </div>
                </>
              }

            </div>
          </ul>
        </div>
      }
    </div>
    )
  }
}

function mapStateToProps({ cart, showCart }) {
  return { cart, showCart }
}

const actions = { dispatchEnlargeImage, showCartAction }

export default connect(mapStateToProps, actions)(Cart)