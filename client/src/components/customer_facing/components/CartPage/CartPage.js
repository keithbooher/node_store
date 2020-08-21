import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import LineItems from "./LineItems"
import { formatMoney } from '../../../../utils/helpFunctions'

class CartPage extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }

  componentDidMount() {

  }

  renderLineItems() {
    if (this.props.cart.line_items.length === 0) {
      return <h2>You have no items in your cart</h2>
    } else {
      return <LineItems cart={this.props.cart} />
    }
  }

  render() {

    return (
      <div >
        {this.props.cart ?
          <>
            <Link to="/checkout">Go to checkout <FontAwesomeIcon icon={faArrowRight} /></Link>
            <h2>Line Items</h2>
            {this.renderLineItems()}
            <div>Sub Total: ${formatMoney(this.props.cart.sub_total)}</div>
            <div>Tax: ${formatMoney(this.props.cart.tax)}</div>
            {this.props.cart.chosen_rate && <div>Shipping: ${formatMoney(this.props.cart.chosen_rate.cost)}</div>}
            <div>Total: ${formatMoney(this.props.cart.total)}</div>
            <Link to="/checkout"><button>Go to Checkout</button></Link>
          </>
        :
          <FontAwesomeIcon className="loadingGif" icon={faSpinner} />
        }
      </div>
    )
  }
}


function mapStateToProps({ cart }) {
  return { cart }
}

// const actions = { sidebarBoolean }

export default connect(mapStateToProps, null)(CartPage)