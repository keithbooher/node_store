import React, { Component } from 'react'
import { connect } from 'react-redux'
import LineItem from './LineItem'
import '../../../stylesheets/cart.css.scss'


class Cart extends Component {
  constructor(props) {
    super()
    this.state = {showCart: false}
  }
  expandCart() {
    let boolean = this.state.showCart
    this.setState({ showCart: !boolean})
  }

  renderExpandedCart() {
    return this.props.cart.line_items.map(line_item => {
      return <LineItem line_item={line_item} />
    });
  }

  renderCartLength() {
    return (
      <div style={{ display: 'flex', backgroundColor: 'darkred', padding: '0px 10px' }} onClick={this.expandCart.bind((this))}>
        {this.props.cart ? this.props.cart.line_items.length : 0}
        <i className="fas fa-shopping-cart"></i>
      </div>
    )
  }

  render() {
    console.log(this.props)
    return (
    <div>
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

export default connect(mapStateToProps)(Cart)