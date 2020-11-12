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
    console.log({cart: this.props.cart})
    let shipping = 0 
    if (this.props.cart) {
      shipping = this.props.cart.chosen_rate ? this.props.cart.chosen_rate.cost : 0
    }

    let fontSize = "1em"
    let totalsFontSize = "1em"
    if (!this.props.mobile) {
      fontSize = "25px"
      totalsFontSize = "20px"
    }

    return (
    <div>
      <div onClick={this.expandCart} ref={this.dropRef} className="h-100">
        <CartLength  />
      </div>

      {this.props.showCart && 
        <div>
          <ul ref={node => this.node = node} className={`${this.props.mobile ? "expandedCart" : "expandedCartDesktop"} st-border-color st-nav-dropdown-background-color border-radius-bottom`}>
            <div className="flex flex_column">
              <div className="padding-s-v font-size-1-2 theme-background-3" style={{ paddingBottom: ".5em", fontSize }}><Link onClick={this.expandCart} className="padding-s inline hover-color-7" to="/cart">Go to cart <FontAwesomeIcon icon={faArrowRight} /></Link></div>
              {this.props.cart && this.props.cart.line_items.length > 0 && 
                <div id="items" className="padding-xs">
                  <LineItems cart={this.props.cart} expandCart={this.expandCart} />
                </div>
              }
            </div>
            <div className="flex space-between theme-background-3 padding-s">
              <div className="flex flex_column" style={{ fontSize: totalsFontSize }}>
                <div className="color-white"><span className="bold store_text_color">Sub Total:</span> ${formatMoney(this.props.cart.sub_total)}</div>
                {!this.props.noTaxSetting && <div className="color-white"><span className="bold store_text_color">Tax:</span> ${formatMoney(this.props.cart.tax)}</div>}
                {this.props.cart.chosen_rate && <div className="color-white"><span className="bold store_text_color">Shipping:</span> ${formatMoney(shipping)}</div>}
                {this.props.cart.discount_codes.length > 0 && 
                  <div className="color-white"><span className="bold store_text_color">Discount Code:</span> {this.props.cart.discount_codes[0].discount_code}</div>
                }
                <div className="color-white"><span className="bold store_text_color">Total:</span> ${formatMoney(this.props.cart.total)}</div>
              </div>
              <Link onClick={this.expandCart} className="" to="/checkout"><button className="margin-auto-v flex flex_column justify-center" onClick={this.expandCart} style={{ height: '25px', padding: "25px 10px", fontSize: "18px" }} >Checkout</button></Link>
            </div>
          </ul>
        </div>
      }
    </div>
    )
  }
}

function mapStateToProps({ cart, showCart, mobile, noTaxSetting }) {
  return { cart, showCart, mobile, noTaxSetting }
}

const actions = { dispatchEnlargeImage, showCartAction }

export default connect(mapStateToProps, actions)(Cart)