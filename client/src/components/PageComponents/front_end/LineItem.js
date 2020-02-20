import React, { Component } from 'react'
import '../../../stylesheets/line_item.css.scss'
import { connect } from 'react-redux'
import { incrementLineItemQuantity } from '../../../actions'

class LineItem extends Component {
  constructor(props) {
    super()
    this.state = {}
  }

  add() {
    let line_item = this.props.line_item
    const cart = this.props.cart
    this.props.incrementLineItemQuantity('addition', cart, line_item)
  }

  subtract() {
    let line_item = this.props.line_item
    const cart = this.props.cart
    this.props.incrementLineItemQuantity('subtraction', cart, line_item)
  }

  render() {
    let line_item = this.props.line_item
    return (
      <li className="line_item">
        <i className="fas fa-plus cart_plus_minus" onClick={this.add.bind(this)}></i>
        <div className="line_item_name">{line_item.product_name}</div>
        <div className="line_item_name">x{line_item.quantity}</div>
        <i className="fas fa-minus cart_plus_minus" onClick={this.subtract.bind(this)}></i>
      </li>
    )
  }
}


export default connect(null, {incrementLineItemQuantity})(LineItem)