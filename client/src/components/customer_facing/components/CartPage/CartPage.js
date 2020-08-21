import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import LineItems from "./LineItems"

class CartPage extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }

  componentDidMount() {

  }

  renderCart() {
    if (this.props.cart.line_items.length === 0) {
      return <h2>You have items in your cart</h2>
    } else {
      return <LineItems cart={this.props.cart} />
    }
  }

  render() {

    return (
      <div >
        {this.props.cart ?
          this.renderCart()
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