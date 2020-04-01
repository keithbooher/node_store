import React, { Component } from 'react'
import { connect } from 'react-redux'
import LineItem from '../LineItem'
import { updateCart, usersCart } from '../../../../actions'
import './cart.css.scss'


class Cart extends Component {
  constructor(props) {
    super()
    this.state = {showCart: false}
  }
  componentDidMount() {
    console.log(this.props)
    if (this.props.auth) {
      this.props.usersCart(this.props.auth._id)
    }
  }
  expandCart() {
    let boolean = this.state.showCart
    this.setState({ showCart: !boolean})
  }

  renderExpandedCart() {
    return this.props.cart.line_items.map(line_item => {
      return <LineItem updateCart={this.props.updateCart} line_item={line_item} cart={this.props.cart} />
    });
  }

  renderCartLength() {
    let calculated_cart_length = null
    if(this.props.cart) {
      this.props.cart.line_items.forEach(line_item => {
        calculated_cart_length = calculated_cart_length + line_item.quantity
      });
    }
    return (
      <div className="flex" style={{ padding: '0px 10px' }} >
        {calculated_cart_length}
        <i className="fas fa-shopping-cart"></i>
      </div>
    )
  }

  render() {
    return (
    <div onClick={this.expandCart.bind((this))} className="header_list_item clickable">
      {this.renderCartLength()}
      {this.state.showCart === false ? "" : 
          <ul className="expandedCart">{this.renderExpandedCart()}</ul>}
    </div>
    )
  }
}

function mapStateToProps({ auth, cart, products }) {
  return { auth, cart, products }
}

const actions = { usersCart, updateCart }


export default connect(mapStateToProps, actions)(Cart)