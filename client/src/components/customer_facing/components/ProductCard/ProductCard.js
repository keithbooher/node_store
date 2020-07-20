import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { capitalizeFirsts, calculateSubtotal } from '../../../../utils/helperFunctions'
import loadingGif from '../../../../images/pizzaLoading.gif'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import 'react-widgets/dist/css/react-widgets.css'
import './productCard.css.scss'

class ProductCard extends Component {
  constructor(props) {
    super()
    this.setQuantity = this.setQuantity.bind(this)
    this.checkInventoryCount = this.checkInventoryCount.bind(this)
    this.state = {
      quantity: 1
    }
  }

  addToCart() {
    let product = this.props.product
    let cart = this.props.cart
    const quantity = this.state.quantity
    const user_id = this.props.user._id

    let sub_total, create_boolean

    if (this.props.cart == null) {
      create_boolean = true
      sub_total = product.price * .08
      cart = {
        line_items: [
          {
            product_name: product.name,
            image: product.image,
            _product_id: product._id,
            quantity: quantity,
            product_price: product.price
          }
        ],
        _user_id: user_id,
        email: this.props.user.email,
        sub_total: sub_total,
        total: sub_total + product.price
      }
    } else {
      create_boolean = false
      sub_total = 0
      // CHECK TO SEE IF PRODUCT IS CONTAINED WITHIN CART ALREADY
      let found = false;
      for(var i = 0; i < cart.line_items.length; i++) {
        if (cart.line_items[i]._product_id == product._id) {
            found = true;
            break;
        }
      }

      // IF FOUND, SIMPLY UPDATE THE LINE ITEM QUANTITY. OTHERWISE CREATE A NEW LINE_ITEM AND PUSH TO THE CART
      if(found === true) {
        cart.line_items.forEach((line_item) => {
          if(product._id === line_item._product_id) {
            line_item.quantity += quantity
          }
        })
      } else {
        let line_item = {
          product_name: product.name,
          image: product.image,
          _product_id: product._id,
          quantity: quantity,
          product_price: product.price
        }
        cart.line_items.push(line_item)
      }


      sub_total = calculateSubtotal(cart)
      cart.total = sub_total * .08
    }
    cart.checkout_state = "shopping"
    if (create_boolean === true) {
      this.props.createCart(cart)
    } else {
      this.props.updateCart(cart)
    }
    //////
  }

  setQuantity(direction) {
    let quantity
    if(direction === "up") {
      quantity = this.state.quantity + 1
    } else {
      quantity = this.state.quantity - 1
    }
    
    if (quantity > this.props.product.inventory_count || quantity < 1) {
      return
    }
    this.setState({ quantity })
  }

  checkInventoryCount(e) {
    let value = e.target.value
    if (value > this.props.product.inventory_count) {
      value = this.props.product.inventory_count
      this.setState({ quantity: value })
    }
    if (value === "") {
      value = 1
      this.setState({ quantity: value })
    }
  }

  onChangeInput(e) {
    this.setState({ quantity: e.target.value })
  }

  preventAlpha(e) {
    if (!this.isNumber(e)) {
      e.preventDefault();
    }
  }

  isNumber(e) {
    var charCode = e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
  }

  render() {
    let product = this.props.product
    let category_path_name = this.props.category_path_name
    return (
      <>
        {this.props.auth !== null ? 
          <div className={`card margin-s-v ${product._id === "" && "hidden"}`}>
            <div className="card-content">
              <div style={{ marginBottom: "1em" }}>
                <div className="inline" style={{ fontSize: "22px" }}>${product.price}</div>
                <h2 className="inline card-title margin-s-h"><Link className="inline" to={`/shop/${category_path_name}/${product.path_name}`}>{capitalizeFirsts(product.name)}</Link></h2>
              </div>
              <div className="flex flex_column justify-center background-color-black card_image_container">
                <img className="margin-auto-h card_image" src={product.image} />
              </div>
              <div className="margin-s-v" style={{ fontSize: "18px" }}>{product.short_description}</div>
              <div className="margin-s-v" style={{ fontSize: "14px" }}>In Stock: {product.inventory_count}</div>
            </div>
            <div>
              <div className="flex">
                <input onKeyDown={(e) => this.preventAlpha(e)} onChange={(e) => this.onChangeInput(e)} onBlur={e => this.checkInventoryCount(e)} style={{ marginRight: "5px", width: "60px" }} className="inline quantity_input" value={this.state.quantity} defaultValue={1}/>
                <div className="flex flex_column">
                  <FontAwesomeIcon onClick={() => this.setQuantity("up")} icon={faChevronUp} />
                  <FontAwesomeIcon onClick={() => this.setQuantity("down")} icon={faChevronDown} />
                </div>
              </div>
              <button className="inline" onClick={this.addToCart.bind(this)}>Add To Cart</button>
            </div>
          </div>
        : <img className="loadingGif" src={loadingGif} /> }
    </>
    )
  }
}

export default ProductCard