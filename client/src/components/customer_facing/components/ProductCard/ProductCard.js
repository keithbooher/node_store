import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { capitalizeFirsts, calculateSubtotal } from '../../../../utils/helperFunctions'
import loadingGif from '../../../../images/pizzaLoading.gif'
import './productCard.css.scss'

class ProductCard extends Component {
  constructor(props) {
    super()
    this.state = {quantity: 1}
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

  render() {
    let product = this.props.product
    let category_path_name = this.props.category_path_name
    return (
      <>
        {this.props.auth !== null ? 
          <div className="card margin-s-v">
            <div className="card-content">
              <h3 className="card-title"><Link to={`/shop/${category_path_name}/${product.path_name}`}>{capitalizeFirsts(product.name)}</Link></h3>
              <div className="flex flex_column justify-center background-color-black" style={{ height: "14em" }}>
                <img className="h-auto margin-auto-h" style={{ width: "98%" }} src={product.image} />
              </div>
              <p>{product.description}</p>
            </div>
            <div className="margin-m-v">${product.price}</div>
            <button onClick={this.addToCart.bind(this)}>Add To Cart</button>
            {/* add quantity buttons */}
          </div>
        : <img className="loadingGif" src={loadingGif} /> }
    </>
    )
  }
}

export default ProductCard