import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import LineItems from "./LineItems"
import { formatMoney } from '../../../../utils/helpFunctions'
import MetaTags from 'react-meta-tags'

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

    let containerStyle = {
      padding: ".4em .4em 80px .4em"
    }

    if (!this.props.mobile) {
      containerStyle.width = "80%"
      containerStyle.margin = "0px auto"
    }

    return (
      <div style={ containerStyle } className={`${!this.props.mobile && "max-customer-container-width margin-auto-h"}`}>
        <MetaTags>
          <title>Cart | Keep Your Eye Open</title>
          <meta name="description" content="Review your cart" />
          <meta name="keywords" content="" />
        </MetaTags>
        {this.props.cart ?
          <>
            <Link style={ this.props.mobile ? {} : { fontSize: "20px" }} to="/checkout">Go to checkout <FontAwesomeIcon icon={faArrowRight} /></Link>
            <h2 style={ this.props.mobile ? {} : { fontSize: "25px" }}>Products In Your Cart</h2>
            {this.renderLineItems()}
            <div style={ this.props.mobile ? {} : { fontSize: "25px" }}><span className="store_text_color">Sub Total:</span> ${formatMoney(this.props.cart.sub_total)}</div>
            <div style={ this.props.mobile ? {} : { fontSize: "25px" }}><span className="store_text_color">Tax:</span> ${formatMoney(this.props.cart.tax)}</div>
            {this.props.cart.chosen_rate && <div style={ this.props.mobile ? {} : { fontSize: "25px" }}><span className="store_text_color">Shipping:</span> ${formatMoney(this.props.cart.chosen_rate.cost)}</div>}
            <div style={ this.props.mobile ? {} : { fontSize: "25px" }}><span className="store_text_color">Total:</span> ${formatMoney(this.props.cart.total)}</div>
            <Link to="/checkout"><button className="margin-s-v">Go to Checkout</button></Link>
          </>
        :
          <FontAwesomeIcon className="loadingGif" icon={faSpinner} spin />
        }
      </div>
    )
  }
}


function mapStateToProps({ cart, mobile }) {
  return { cart, mobile }
}

// const actions = { sidebarBoolean }

export default connect(mapStateToProps, null)(CartPage)