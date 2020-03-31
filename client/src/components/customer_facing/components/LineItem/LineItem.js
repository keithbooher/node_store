import React, { Component } from 'react'
import './line_item.css.scss'
import { connect } from 'react-redux'
import hf from '../../../../utils/helperFunctions'

class LineItem extends Component {
  constructor(props) {
    super()
    this.alterLineItemQuantity = this.alterLineItemQuantity.bind(this)
    this.state = {}
  }

  alterLineItemQuantity(operator) {
    let line_item = this.props.line_item
    const cart = this.props.cart
    let create_boolean = false

    cart.line_items.forEach((line_item) => {
      if(line_item._product_id === line_item._product_id && operator === 'addition') {
        line_item.quantity += 1
      } else if (line_item._product_id === line_item._product_id && operator === 'subtraction') {
        line_item.quantity += -1
      }
    })

    let removed_zero_quantity_items = cart.line_items.filter((line_item) => line_item.quantity > 0 )
    cart.line_items = removed_zero_quantity_items
    
    let sub_total = hf.calculateSubtotal(cart)

    cart.total = sub_total * .08
    this.props.updateCart(cart)

  }

  removeProduct() {
    let incoming_line_item = this.props.line_item
    const cart = this.props.cart

    const current_cart_line_items = cart.line_items
    let cart_id = cart._id

    let updated_line_items = current_cart_line_items.filter((line_item) => {
      return incoming_line_item._id !== line_item._id
    })
    cart.line_items = updated_line_items

    let sub_total = hf.calculateSubtotal(cart)

    cart.total = sub_total * .08
    this.props.updateCart(cart)
  }

  render() {
    let line_item = this.props.line_item
    return (
      <li className="line_item">
        <div className="line_item_sub_container">
          <i className="fas fa-plus cart_plus_minus" onClick={() => this.alterLineItemQuantity('addition')}></i>
          <div className="line_item_name">{line_item.product_name}</div>
          <div className="line_item_quantity">x{line_item.quantity}</div>
          <i className="fas fa-minus cart_plus_minus" onClick={() => this.alterLineItemQuantity('subtraction')}></i>
          <a className="remove_line_item_button" onClick={this.removeProduct.bind(this)}>remove</a>
        </div>
      </li>
    )
  }
}


export default LineItem