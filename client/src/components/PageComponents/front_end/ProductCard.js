import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { addToCart } from '../../../actions'
import '../../../stylesheets/productCard.css.scss'

class ProductCard extends Component {
  constructor(props) {
    super()
    this.state = {quantity: 1}
  }

  addToCart() {
    const product = this.props.product
    const cart = this.props.cart
    const quantity = this.state.quantity
    const user_id = this.props.user_id
    this.props.addToCart(user_id, cart, product, quantity)
  }

  render() {
    let product = this.props.product
    let category_path_name = this.props.category_path_name
    return (
      <div key={product._id}>
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

export default connect(null, {addToCart})(ProductCard)