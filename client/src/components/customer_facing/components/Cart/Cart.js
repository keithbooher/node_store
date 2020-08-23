import React, { Component } from 'react'
import { connect } from 'react-redux'
import LineItems from '../LineItems'
import './cart.css.scss'
import CartLength from "./CartLength"
import { Link } from 'react-router-dom'
import { formatMoney } from '../../../../utils/helpFunctions'
import { dispatchEnlargeImage, showCartAction } from "../../../../actions"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

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
    } else if (this.props.showCart === true && !this.node.contains(e.target)) {
      this.expandCart()
    }
  }
  
  expandCart() {
    this.props.showCartAction(!this.props.showCart)
  }

  render() {
    let shipping = 0 
    if (this.props.cart) {
      shipping = this.props.cart.chosen_rate ? this.props.cart.chosen_rate.cost : 0
    }

    return (
    <div>
      <div onClick={this.expandCart} ref={this.dropRef} className="h-100">
        <CartLength expandCart={this.expandCart}  />
      </div>

      {this.props.showCart && 
        <div>
          <ul ref={node => this.node = node} className="expandedCart st-nav-dropdown-background-color border-radius-bottom">
            <div className="flex flex_column">
              <Link onClick={this.expandCart} to="/cart">Go to cart <FontAwesomeIcon icon={faArrowRight} /></Link>
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
                      <div>Total: ${formatMoney(this.props.cart.total)}</div>
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