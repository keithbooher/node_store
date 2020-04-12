import React, { Component } from 'react'
import { connect } from 'react-redux'
import './line_item.css.scss'
import hf from '../../../../utils/helperFunctions'
import { updateCart } from "../../../../actions"

class LineItems extends Component {
  constructor(props) {
    super()
    this.removeProduct = this.removeProduct.bind(this)
    this.alterLineItemQuantity = this.alterLineItemQuantity.bind(this)
    this.state = {}
  }

  alterLineItemQuantity(incoming_line_item, operator) {
    const cart = this.props.cart

    cart.line_items.forEach((line_item) => {
      if(incoming_line_item._product_id === line_item._product_id && operator === 'addition') {
        line_item.quantity += 1
      } else if (incoming_line_item._product_id === line_item._product_id && operator === 'subtraction') {
        line_item.quantity += -1
      }
    })

    let removed_zero_quantity_items = cart.line_items.filter((line_item) => line_item.quantity > 0 )
    cart.line_items = removed_zero_quantity_items
    
    let sub_total = hf.calculateSubtotal(cart)

    cart.total = sub_total * .08
    this.props.updateCart(cart)
  }

  removeProduct(incoming_line_item) {
    const cart = this.props.cart

    const current_cart_line_items = cart.line_items

    let updated_line_items = current_cart_line_items.filter((line_item) => {
      return incoming_line_item._id !== line_item._id
    })
    cart.line_items = updated_line_items

    let sub_total = hf.calculateSubtotal(cart)

    cart.total = sub_total * .08
    this.props.updateCart(cart)
  }

  displayLineItems() {
    return this.props.cart.line_items.map((line_item) => {
      return (<li className="line_item">
                <div className="line_item_sub_container">
                  <i className="fas fa-plus cart_plus_minus" onClick={() => this.alterLineItemQuantity(line_item, 'addition')}></i>
                  <div className="line_item_name">{line_item.product_name}</div>
                  <div className="line_item_quantity">x{line_item.quantity}</div>
                  <i className="fas fa-minus cart_plus_minus" onClick={() => this.alterLineItemQuantity(line_item, 'subtraction')}></i>
                  <a className="remove_line_item_button" onClick={() => this.removeProduct(line_item)}>remove</a>
                </div>
              </li>)
    })
  }

  render() {
    return (
      <ul className="expandedCart">
        {this.displayLineItems()}
      </ul>
    )
  }
}

function mapStateToProps({ cart }) {
  return { cart }
}

const actions = { updateCart }

export default connect(mapStateToProps, actions)(LineItems)