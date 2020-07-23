import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateCart } from "../../actions"
import mobile from "is-mobile"

let isMobile = mobile()
class LowInventory extends Component {
  constructor(props) {
    super()
    this.ref = React.createRef()
    this.outerRef = React.createRef()
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.state = {

    }
  }

  componentDidMount() {
    let cart = this.props.cart
    let out_of_stock_items = this.props.out_of_stock_items

    if (this.props.adjust) {
      out_of_stock_items = out_of_stock_items.filter((item) => item !== null).map((item) => {
        return {_id: item._id, inventory_count: item.inventory_count}
      })
  
      cart.line_items = cart.line_items.map((item) => {
        let remove
  
        out_of_stock_items.forEach(oos_item => {
          if (oos_item._id === item._id && oos_item.inventory_count < 1) {
            remove = true
          } else if (oos_item === item._id) {
            item.quantity = oos_item.inventory_count
            remove = false
          } else {
            remove = false
          }
        })
  
        if (remove) {
          return null
        } else {
          return item
        }
      })
      
      cart.line_items = cart.line_items.filter((item) => item !== null)
  
      this.props.updateCart(cart)
    }

    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(e) {
    if(e.target === this.ref.current || this.ref.current.contains(e.target)) {
      return
    } else {
      this.props.cancel()
    }
  }

  render() {

    const style_outer = {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#4242428a",
      zIndex: 10
    }

    const style_inner = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: isMobile ? "90%" : "30em",
      height: "auto",
      padding: "3em",
      zIndex: 20
    }

    return (
      <div id="out_of_stock_modal" style={ style_outer }>
        <div className="inner_container theme-nav-background-color color-white" ref={this.ref} style={ style_inner }>
          <h3>{this.props.title}</h3>
          {this.props.out_of_stock_items.filter((item) => item !== null).map((item) => {
            return (
              <p style={{ fontSize: "18px" }}>{item.product_name}</p>
            )
          })}

          <button onClick={this.props.cancel} className="margin-auto-h">Okay</button>
        </div>
      </div>
    )
  }
}


const actions = { updateCart }

export default connect(null, actions)(LowInventory)