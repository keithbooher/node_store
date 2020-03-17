import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import hf from '../../../../utils/helperFunctions'
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
    const user_id = this.props.user_id
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


      sub_total = hf.calculateSubtotal(cart)
      cart.total = sub_total * .08

    }
    this.props.addToCart(create_boolean, cart, this.props.user_id)
  }

  render() {
    let product = this.props.product
    let category_path_name = this.props.category_path_name
    return (
      <div>
        <div className="card blue-grey darken-1">
          <div className="card-content white-text">
            <span className="card-title">{product.name}</span>
            <p>{product.description}</p>
          </div>
          <div className="card-action">
            <Link to={`/shop/${category_path_name}/${product.path_name}`} className="">Go to this product</Link>
          </div>
          <div className="add_to_cart" onClick={this.addToCart.bind(this)}>Add To Cart</div>
          {/* add quantity buttons */}
        </div>
    </div>
    )
  }
}

export default ProductCard